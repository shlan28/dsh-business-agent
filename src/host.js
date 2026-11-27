// 人脉名片墙 Host 半片：本地档案读写、DSH 会话接线、研究写回、agent 工具。
import { homedir } from 'node:os'
import { join } from 'node:path'
import { HttpError, LIMITS, Store, hasMe, publicContact } from './store.js'
import {
  ME_CHAT_KICKOFF,
  chatPrompt,
  composePrompt,
  meChatPrompt,
  meQuestions,
  researchInstruction,
} from './prompt.js'

export const name = 'business-cards'
export const inject = ['webServer']

const PREFIX = '/business-cards'
const ME_CHAT_ID = 'me'
const MAX_BODY = 1_000_000

const messageOf = error => {
  const message = error?.message ?? error
  return typeof message === 'string' && message ? message : '未知错误'
}

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(body))
}

async function readJson(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY) throw new HttpError(413, '请求内容太大')
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new HttpError(400, '请求不是有效的 JSON')
  }
}

function rejectionOf(ctx, req) {
  const service = ctx.get('connection')
  if (typeof service?.requestRejection !== 'function') return 403
  return service.requestRejection({ headers: req.headers })
}

function messageText(data) {
  const message = data?.message
  if (typeof message === 'string') return message.trim()
  const content = message?.content
  if (!Array.isArray(content)) return ''
  return content
    .filter(block => block?.type === 'text' && typeof block.text === 'string')
    .map(block => block.text)
    .join('\n')
    .trim()
}

function toolLabel(name) {
  if (/web.?search|search/i.test(name)) return '搜索公开信息'
  if (/fetch|scrape|crawl/i.test(name)) return '读取网页'
  if (name === 'business_contact_research_save') return '把研究写回档案'
  if (name === 'business_contact_note') return '记一条互动'
  if (name === 'business_contact_save') return '更新档案'
  return name || '调用工具'
}

export function apply(ctx, config = {}) {
  const dataDir = join(process.env.DSH_HOME || join(homedir(), '.dsh'), 'business-cards')
  const store = new Store(dataDir)
  const ready = store.load().catch(error => {
    console.warn('[business-cards] 档案载入失败', messageOf(error))
    return store
  })

  /** 每个联系人当前轮次的状态；重启后从空闲开始。 */
  const runs = new Map()
  /** 「我的名片」补全会话的轮次状态。 */
  const meRun = { running: false, error: '', lastAssistant: '', lastAssistantAt: 0 }
  /** 一句话新建的临时会话：sessionId → compose 记录。 */
  const composes = new Map()
  const runOf = id => {
    let run = runs.get(id)
    if (!run) {
      run = { running: false, error: '', lastAssistant: '', lastAssistantAt: 0 }
      runs.set(id, run)
    }
    return run
  }

  const sessionController = () => ctx.get('sessionController')
  const sessionCwd = () => {
    if (typeof config?.workspace === 'string' && config.workspace.trim()) return config.workspace.trim()
    try {
      return ctx.get('workingDirectory')?.defaultDirectory || process.cwd()
    } catch {
      return process.cwd()
    }
  }

  const composeOfSession = sessionId =>
    sessionId ? [...composes.values()].find(entry => entry.sessionId === sessionId) || null : null

  async function openDshSession() {
    const ctrl = sessionController()
    if (!ctrl) throw new HttpError(503, '当前环境没有会话服务')
    const value = await ctrl.create({ cwd: sessionCwd() })
    const sessionId = value?.sessionId ? String(value.sessionId) : ''
    if (!sessionId) throw new HttpError(502, '会话服务没有返回 sessionId')
    return sessionId
  }

  const isSessionMissing = error => {
    const message = messageOf(error).toLowerCase()
    return message.includes('session/not-found') || message.includes('session not found') || (message.includes('session') && message.includes('not found'))
  }

  /** 会话已经不存在时：新建一个、重新绑定、把旧历史留在面板里，再重试这次请求。 */
  async function promptWithRecovery({ ctrl, chatId, sessionId, promptText, requestId, rebind }) {
    const fire = sid =>
      ctrl.prompt(
        { sessionId: sid, requestId, mode: 'queue', content: [{ type: 'text', text: promptText }] },
        new AbortController().signal,
      )
    try {
      await fire(sessionId)
      return sessionId
    } catch (error) {
      if (!isSessionMissing(error)) throw error
      const fresh = await openDshSession()
      await rebind(fresh)
      await store
        .appendChat(chatId, {
          role: 'system',
          text: '原来的 DSH 会话已不存在，已新建一个会话继续；这张卡里的历史记录不受影响。',
          at: Date.now(),
        })
        .catch(() => {})
      await fire(fresh)
      return fresh
    }
  }

  /** 面板的聊天缓存丢了，但 DSH 会话还在：把最近的消息读回来。 */
  async function restoreChatFromSession(chatId, sessionId) {
    const ctrl = sessionController()
    if (!ctrl || typeof ctrl.events !== 'function' || !sessionId) return false
    try {
      const existing = await store.chatDelta(chatId, 0)
      if (existing.entries.length) return false
      const page = await ctrl.events(
        { address: { kind: 'session', sessionId }, maxMessages: 120 },
        new AbortController().signal,
      )
      const records = Array.isArray(page?.records) ? page.records : []
      const entries = []
      for (const record of records) {
        const event = record?.event ?? record
        const type = event?.type
        if (type !== 'user/message' && type !== 'assistant/message') continue
        const text = messageText(event?.data ?? {})
        if (!text) continue
        entries.push({ role: type === 'user/message' ? 'user' : 'assistant', text, at: Date.now() })
      }
      if (!entries.length) return false
      await store.appendChat(chatId, { role: 'system', text: '已从 DSH 会话恢复这段对话的历史记录。', at: Date.now() })
      for (const entry of entries) await store.appendChat(chatId, entry)
      return true
    } catch {
      return false
    }
  }

  async function ensureSession(contact) {
    if (contact.sessionId) return contact.sessionId
    const sessionId = await openDshSession()
    await store.bindSession(contact.id, sessionId)
    return sessionId
  }

  async function send(contactId, rawText, kind = 'chat') {
    await ready
    const contact = store.find(contactId)
    if (!contact) throw new HttpError(404, '找不到这张名片')
    const text = typeof rawText === 'string' ? rawText.trim().slice(0, LIMITS.chatText) : ''
    if (!text) throw new HttpError(400, '说点什么再发送')
    const ctrl = sessionController()
    if (!ctrl) throw new HttpError(503, '当前环境没有会话服务，暂时只能查看档案')
    const run = runOf(contact.id)
    if (run.running) throw new HttpError(409, 'DSH 正在回复，先等一下或点停止')
    const sessionId = await ensureSession(contact)
    run.running = true
    run.error = ''
    const display = kind === 'research' ? `研究此人：${text}` : text
    await store.appendChat(contact.id, { role: 'user', text: display, at: Date.now() })
    const requestId = `bc-${contact.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    const prompt = chatPrompt(contact, kind === 'research' ? researchInstruction(text) : text, kind, store.publicMe(), store.publicTypes())
    void (async () => {
      try {
        await promptWithRecovery({
          ctrl,
          chatId: contact.id,
          sessionId,
          promptText: prompt,
          requestId,
          rebind: fresh => store.bindSession(contact.id, fresh),
        })
      } catch (error) {
        run.running = false
        run.error = messageOf(error)
        await store
          .appendChat(contact.id, {
            role: 'error',
            text: `DSH 没有接住这次请求：${run.error}`,
            at: Date.now(),
          })
          .catch(() => {})
      }
    })()
    return { ok: true, sessionId, contact: publicContact(store.find(contact.id)) }
  }

  async function startCompose(id, rawText) {
    await ready
    const text = typeof rawText === 'string' ? rawText.trim().slice(0, 2000) : ''
    if (!text) throw new HttpError(400, '说说这个人是谁')
    const ctrl = sessionController()
    if (!ctrl) throw new HttpError(503, '当前环境没有会话服务')
    let run = id ? composes.get(id) : null
    if (run?.status === 'done') throw new HttpError(409, '这张名片已经建好了')
    if (!run) {
      const sessionId = await openDshSession()
      run = {
        id: `cmp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        sessionId,
        status: 'pending',
        reply: '',
        error: '',
        contactId: null,
        turns: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      composes.set(run.id, run)
      const stale = [...composes.values()]
        .filter(entry => entry.status !== 'pending')
        .sort((a, b) => a.updatedAt - b.updatedAt)
        .slice(0, Math.max(0, composes.size - 20))
      for (const entry of stale) composes.delete(entry.id)
    }
    run.status = 'pending'
    run.reply = ''
    run.error = ''
    run.updatedAt = Date.now()
    run.turns += 1
    const prompt = composePrompt(text, run.turns === 1, store.publicTypes())
    void (async () => {
      try {
        await ctrl.prompt(
          {
            sessionId: run.sessionId,
            requestId: `bc-compose-${run.id}-${run.turns}`,
            mode: 'queue',
            content: [{ type: 'text', text: prompt }],
          },
          new AbortController().signal,
        )
      } catch (error) {
        run.status = 'error'
        run.error = messageOf(error)
        run.updatedAt = Date.now()
      }
    })()
    return {
      ok: true,
      id: run.id,
      sessionId: run.sessionId,
      status: run.status,
      reply: run.reply,
    }
  }

  async function composeState(id) {
    const run = id ? composes.get(id) : null
    if (!run) throw new HttpError(404, '这次新建已经结束，请重新发起')
    return {
      ok: true,
      id: run.id,
      status: run.status,
      reply: run.reply,
      error: run.error,
      contactId: run.contactId,
      updatedAt: run.updatedAt,
    }
  }

  async function stop(contactId) {
    await ready
    const contact = store.find(contactId)
    if (!contact) throw new HttpError(404, '找不到这张名片')
    const ctrl = sessionController()
    if (ctrl && contact.sessionId) {
      try {
        ctrl.cancel({ sessionId: contact.sessionId })
      } catch (error) {
        throw new HttpError(500, `停止失败：${messageOf(error)}`)
      }
    }
    const run = runOf(contact.id)
    run.running = false
    return { ok: true }
  }

  async function ensureMeSession() {
    if (store.me?.sessionId) return store.me.sessionId
    const sessionId = await openDshSession()
    await store.bindMeSession(sessionId)
    return sessionId
  }

  /** 给「我的名片」发一轮：DSH 会按缺失清单提问，回答通过 business_me_save 落盘。 */
  async function sendMe(rawText) {
    await ready
    const text = typeof rawText === 'string' ? rawText.trim().slice(0, LIMITS.chatText) : ''
    if (!text) throw new HttpError(400, '说点什么再发送')
    const ctrl = sessionController()
    if (!ctrl) throw new HttpError(503, '当前环境没有会话服务，暂时无法在会话里补全档案')
    if (meRun.running) throw new HttpError(409, 'DSH 正在回复，先等一下')
    const sessionId = await ensureMeSession()
    meRun.running = true
    meRun.error = ''
    await store.appendChat(ME_CHAT_ID, { role: 'user', text, at: Date.now() })
    const requestId = `bc-me-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    const prompt = meChatPrompt(store.publicMe(), text)
    void (async () => {
      try {
        await promptWithRecovery({
          ctrl,
          chatId: ME_CHAT_ID,
          sessionId,
          promptText: prompt,
          requestId,
          rebind: fresh => store.bindMeSession(fresh),
        })
      } catch (error) {
        meRun.running = false
        meRun.error = messageOf(error)
        await store
          .appendChat(ME_CHAT_ID, { role: 'error', text: `DSH 没有接住这次请求：${meRun.error}`, at: Date.now() })
          .catch(() => {})
      }
    })()
    return { ok: true, sessionId }
  }

  /** 第一次打开「我的名片」：让 DSH 主动问第一个问题（已有对话就不重复开场）。 */
  async function startMeChat() {
    await ready
    const chat = await store.chatDelta(ME_CHAT_ID, 0)
    if (chat.entries.length) return { ok: true, started: false, sessionId: store.me?.sessionId || null }
    const result = await sendMe(ME_CHAT_KICKOFF)
    return { ...result, started: true }
  }

  async function meChatState(after) {
    await ready
    await restoreChatFromSession(ME_CHAT_ID, store.me?.sessionId)
    const chat = await store.chatDelta(ME_CHAT_ID, after)
    return {
      ok: true,
      sessionId: store.me?.sessionId || null,
      revision: store.revision,
      running: meRun.running,
      error: meRun.error,
      entries: chat.entries,
      lastSeq: chat.lastSeq,
      hasMe: hasMe(store.me),
      questions: meQuestions(store.publicMe()),
    }
  }

  async function research(contactId, focus) {
    const text = researchInstruction(focus)
    return send(contactId, text, 'research')
  }

  async function chatState(contactId, after) {
    await ready
    const contact = store.find(contactId)
    if (!contact) throw new HttpError(404, '找不到这张名片')
    await restoreChatFromSession(contact.id, contact.sessionId)
    const chat = await store.chatDelta(contact.id, after)
    const run = runOf(contact.id)
    return {
      ok: true,
      sessionId: contact.sessionId,
      revision: store.revision,
      running: run.running,
      error: run.error,
      entries: chat.entries,
      lastSeq: chat.lastSeq,
    }
  }

  async function handleOp(body) {
    await ready
    const action = typeof body?.action === 'string' ? body.action : ''
    switch (action) {
      case 'save': {
        const contact = await store.upsert(body?.contact ?? body)
        return { ok: true, contact, state: store.snapshot() }
      }
      case 'delete': {
        const contact = await store.remove(body?.id)
        return { ok: true, contact, state: store.snapshot() }
      }
      case 'note': {
        const contact = await store.addNote(body?.id, body)
        return { ok: true, contact, state: store.snapshot() }
      }
      case 'nextStep': {
        const contact = await store.setNextStep(body?.id, body)
        return { ok: true, contact, state: store.snapshot() }
      }
      case 'research': {
        const contact = await store.appendResearch(body?.id, body)
        return { ok: true, contact, state: store.snapshot() }
      }
      case 'me': {
        const me = await store.saveMe(body?.patch ?? body)
        return { ok: true, me, hasMe: hasMe(store.me), state: store.snapshot() }
      }
      case 'typesSave': {
        const result = await store.saveTypes(body?.types)
        return { ok: true, ...result, state: store.snapshot() }
      }
      case 'meReset': {
        const me = await store.resetMe()
        return { ok: true, me, hasMe: false, state: store.snapshot() }
      }
      default:
        throw new HttpError(400, `未知操作：${action || '（空）'}`)
    }
  }

  // 会话事件 → 聊天记录。只处理绑定到本插件的会话。
  ctx.effect(
    () =>
      ctx.on('session/event', (session, event) => {
        const sessionId = typeof session === 'string' ? session : session?.id
        if (!sessionId) return
        const compose = composeOfSession(String(sessionId))
        if (compose) {
          const data = event?.data ?? {}
          if (event?.type === 'assistant/message') {
            const text = messageText(data)
            if (text) {
              compose.reply = text
              compose.updatedAt = Date.now()
            }
          } else if (event?.type === 'turn/end') {
            const reason = data.reason ?? {}
            if (reason.kind === 'aborted') {
              compose.status = 'error'
              compose.error = '已停止'
              compose.updatedAt = Date.now()
            } else if (reason.kind && reason.kind !== 'completed') {
              compose.status = 'error'
              compose.error = messageOf(reason.error?.message || `执行结束：${reason.kind}`)
              compose.updatedAt = Date.now()
            }
          }
          return
        }
        if (store.me?.sessionId && String(sessionId) === store.me.sessionId) {
          const data = event?.data ?? {}
          const at = Date.now()
          switch (event?.type) {
            case 'turn/start':
              meRun.running = true
              meRun.error = ''
              break
            case 'tool/call': {
              const name = typeof data.name === 'string' ? data.name : ''
              if (!name) break
              void store.appendChat(ME_CHAT_ID, { role: 'tool', name, text: toolLabel(name), at }).catch(() => {})
              break
            }
            case 'assistant/message': {
              const text = messageText(data)
              if (!text) break
              if (text === meRun.lastAssistant && at - meRun.lastAssistantAt < 10_000) break
              meRun.lastAssistant = text
              meRun.lastAssistantAt = at
              void store.appendChat(ME_CHAT_ID, { role: 'assistant', text, at }).catch(() => {})
              break
            }
            case 'turn/end': {
              meRun.running = false
              meRun.lastAssistant = ''
              const reason = data.reason ?? {}
              if (reason.kind === 'aborted') {
                void store.appendChat(ME_CHAT_ID, { role: 'system', text: '已停止', at }).catch(() => {})
              } else if (reason.kind && reason.kind !== 'completed') {
                meRun.error = messageOf(reason.error?.message || `执行结束：${reason.kind}`)
                void store.appendChat(ME_CHAT_ID, { role: 'error', text: meRun.error, at }).catch(() => {})
              }
              break
            }
            default:
              break
          }
          return
        }
        const contact = store.bySession(String(sessionId))
        if (!contact) return
        const run = runOf(contact.id)
        const data = event?.data ?? {}
        const at = Date.now()
        switch (event?.type) {
          case 'turn/start':
            run.running = true
            run.error = ''
            break
          case 'tool/call': {
            const name = typeof data.name === 'string' ? data.name : ''
            if (!name) break
            void store.appendChat(contact.id, { role: 'tool', name, text: toolLabel(name), at }).catch(() => {})
            break
          }
          case 'assistant/message': {
            const text = messageText(data)
            if (!text) break
            if (text === run.lastAssistant && at - run.lastAssistantAt < 10_000) break
            run.lastAssistant = text
            run.lastAssistantAt = at
            void store.appendChat(contact.id, { role: 'assistant', text, at }).catch(() => {})
            break
          }
          case 'turn/end': {
            run.running = false
            run.lastAssistant = ''
            const reason = data.reason ?? {}
            if (reason.kind === 'aborted') {
              void store.appendChat(contact.id, { role: 'system', text: '已停止', at }).catch(() => {})
            } else if (reason.kind && reason.kind !== 'completed') {
              run.error = messageOf(reason.error?.message || `执行结束：${reason.kind}`)
              void store
                .appendChat(contact.id, { role: 'error', text: run.error, at })
                .catch(() => {})
            }
            break
          }
          default:
            break
        }
      }),
    'business-cards: session events',
  )

  // 面板接口。
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'prefix',
        path: PREFIX,
        handler: async (req, res) => {
          try {
            const rejection = rejectionOf(ctx, req)
            if (rejection) {
              json(res, rejection, { ok: false, error: '未授权' })
              return
            }
            const url = new URL(req.url, 'http://business-cards.local')
            const route = url.pathname.slice(PREFIX.length) || '/'
            const method = req.method || 'GET'

            if (route === '/state' && method === 'GET') {
              await ready
              json(res, 200, {
                ok: true,
                ...store.snapshot(),
                me: store.publicMe(),
                hasMe: hasMe(store.me),
                questions: meQuestions(store.publicMe()),
                types: store.publicTypes(),
                capabilities: {
                  chat: Boolean(sessionController()),
                },
              })
              return
            }
            if (route === '/op' && method === 'POST') {
              json(res, 200, await handleOp(await readJson(req)))
              return
            }
            if (route === '/chat/state' && method === 'GET') {
              const id = url.searchParams.get('id') || ''
              const after = Number(url.searchParams.get('after') || 0)
              json(res, 200, await chatState(id, after))
              return
            }
            if (route === '/chat/send' && method === 'POST') {
              const body = await readJson(req)
              json(res, 200, await send(body?.id, body?.text, body?.kind === 'research' ? 'research' : 'chat'))
              return
            }
            if (route === '/chat/stop' && method === 'POST') {
              const body = await readJson(req)
              json(res, 200, await stop(body?.id))
              return
            }
            if (route === '/me/chat/state' && method === 'GET') {
              const after = Number(url.searchParams.get('after') || 0)
              json(res, 200, await meChatState(after))
              return
            }
            if (route === '/me/chat/send' && method === 'POST') {
              const body = await readJson(req)
              json(res, 200, await sendMe(body?.text))
              return
            }
            if (route === '/me/chat/start' && method === 'POST') {
              json(res, 200, await startMeChat())
              return
            }
            if (route === '/research' && method === 'POST') {
              const body = await readJson(req)
              json(res, 200, await research(body?.id, body?.focus))
              return
            }
            if (route === '/compose' && method === 'POST') {
              const body = await readJson(req)
              json(res, 200, await startCompose(body?.id, body?.text))
              return
            }
            if (route === '/compose/state' && method === 'GET') {
              json(res, 200, await composeState(url.searchParams.get('id') || ''))
              return
            }
            json(res, 404, { ok: false, error: '未知接口' })
          } catch (error) {
            if (res.headersSent) {
              res.end()
              return
            }
            json(res, Number(error?.status) || 500, { ok: false, error: messageOf(error) })
          }
        },
      }),
    'business-cards: /business-cards routes',
  )

  // Agent 工具：让主会话也能打理这份人脉档案。
  const tools = ctx.get('tools')
  if (tools) {
    const fail = error => ({ ok: false, error: messageOf(error) })
    const brief = contact => ({
      id: contact.id,
      no: contact.no,
      name: contact.name,
      nameEn: contact.nameEn,
      type: contact.type,
      role: contact.role,
      company: contact.company,
      city: contact.city,
      tags: contact.tags,
      lastContactAt: contact.lastContactAt,
      nextStep: contact.nextStep,
      hasResearch: Boolean(contact.research?.entries?.length),
    })

    const toolList = [
      {
        name: 'business_me_get',
        description:
          "Read the user's own profile (who they are, goals, current needs, what they can offer, communication preferences). Read this BEFORE giving advice about a contact, choosing who to follow up with, or preparing a meeting.",
        parameters: { type: 'object', additionalProperties: false, properties: {} },
      },
      {
        name: 'business_me_save',
        description:
          'Save facts about the USER themselves (not a contact): identity, needs, offers, goals, preferences. Partial update: send only the fields you are changing; needs/offers/goals replace that whole list when present. Only save what the user actually said — never infer. Mention where it came from in source.note.',
        parameters: {
          type: 'object',
          additionalProperties: false,
          properties: {
            identity: {
              type: 'object',
              additionalProperties: false,
              properties: {
                name: { type: 'string' },
                nameEn: { type: 'string' },
                title: { type: 'string' },
                company: { type: 'string' },
                oneLiner: { type: 'string', description: 'One sentence: what they are building.' },
                city: { type: 'string' },
                stage: { type: 'string', description: 'Company stage, e.g. 种子轮 / A 轮.' },
              },
            },
            needs: {
              type: 'array',
              description: 'What the user needs right now; replaces the existing list.',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  text: { type: 'string' },
                  kind: { type: 'string', enum: ['funding', 'clients', 'partners', 'hiring', 'info', 'other'] },
                  dueAt: { type: 'string', description: 'ISO date, optional.' },
                },
                required: ['text'],
              },
            },
            offers: {
              type: 'array',
              description: 'What the user can offer others; replaces the existing list.',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: { text: { type: 'string' } },
                required: ['text'],
              },
            },
            goals: {
              type: 'array',
              description: 'Goals for this year / quarter; replaces the existing list.',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: { text: { type: 'string' } },
                required: ['text'],
              },
            },
            preferences: {
              type: 'object',
              additionalProperties: false,
              properties: {
                tone: { type: 'string' },
                channel: { type: 'string' },
                cadence: { type: 'string' },
                redLines: { type: 'array', items: { type: 'string' } },
              },
            },
            source: {
              type: 'object',
              additionalProperties: false,
              properties: {
                kind: { type: 'string', description: 'chat / form / import' },
                field: { type: 'string' },
                note: { type: 'string', description: 'Quote or context showing where this came from.' },
              },
            },
          },
        },
      },
      {
        name: 'business_contact_list',
        description:
          'List the user\'s private business contacts (investors, partners, clients, advisors) from the sidebar people wall. Use it to find someone before reading or updating a card. Optional query matches name, company or tag.',
        parameters: {
          type: 'object',
          additionalProperties: false,
          properties: {
            query: { type: 'string', description: 'Name, company, role or tag to filter by.' },
          },
        },
      },
      {
        name: 'business_contact_get',
        description:
          'Read one full business-contact card: role, company, contact details, next step, recent interactions and saved research. Pass the id or exact name.',
        parameters: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string', description: 'Contact id or exact name.' },
          },
          required: ['id'],
        },
      },
      {
        name: 'business_contact_save',
        description:
          'Create or update a business-contact card. Use it when the user asks to add someone to the people wall or change their details. Omit fields you are not changing when updating.',
        parameters: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string', description: 'Existing contact id; omit to create.' },
            name: { type: 'string', description: 'Full name.' },
            nameEn: { type: 'string', description: 'English name.' },
            type: {
              type: 'string',
              description:
                'Relationship category id. Use the ids returned by business_contact_list.types (defaults: investor / partner / client / advisor / other). Do not invent new ids.',
            },
            role: { type: 'string', description: 'Job title.' },
            company: { type: 'string', description: 'Company or fund.' },
            city: { type: 'string', description: 'City.' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Up to 4 short tags.' },
            email: { type: 'string' },
            wechat: { type: 'string' },
            phone: { type: 'string' },
            notes: { type: 'string', description: 'Free-form notes about this person.' },
            nextStepText: { type: 'string', description: 'The next follow-up action.' },
            nextStepAt: { type: 'string', description: 'ISO date-time for the next step.' },
            lastContactAt: { type: 'string', description: 'ISO date-time of the last contact.' },
          },
        },
      },
      {
        name: 'business_contact_note',
        description:
          'Append one interaction or note to a contact\'s timeline (WeChat/meeting/call/email/note). Do not rewrite existing entries.',
        parameters: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string', description: 'Contact id or exact name.' },
            text: { type: 'string', description: 'What happened.' },
            kind: { type: 'string', enum: ['wechat', 'meeting', 'call', 'email', 'note'] },
            at: { type: 'string', description: 'ISO date-time; defaults to now.' },
          },
          required: ['id', 'text'],
        },
      },
      {
        name: 'business_contact_research_save',
        description:
          'Append ONE research record (a dated document with its sources) to a contact card. Each research turn adds a new record; never overwrite earlier ones. Requires at least one real HTTP(S) source found via web search — if nothing could be found, do not call this tool. Write summary as a Markdown document (800-1500 characters) with the sections `## 一句话结论`, `## 事实（附来源）`, `## 判断（推测）`, `## 下一步动作`; use lists/tables where they help. Pass source URLs as plain strings. If the call fails, retry once with a shorter summary.',
        parameters: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string', description: 'Contact id or exact name.' },
            summary: { type: 'string', description: 'The record itself, 800-1500 Chinese characters, as Markdown with sections: 一句话结论 / 事实（附来源）/ 判断（推测）/ 下一步动作.' },
            title: { type: 'string', description: 'One-line title for this record, e.g. "近半年投资方向".' },
            focus: { type: 'string', description: 'What this round was asked to look into.' },
            sources: {
              type: 'array',
              description: '2-5 source URLs actually used this round, as plain URL strings.',
              items: { type: 'string' },
            },
          },
          required: ['id', 'summary', 'sources'],
        },
      },
      {
        name: 'business_contact_research',
        description:
          'Start a research turn on one contact in that contact\'s own DSH session. Use it when the user asks you to look someone up; the research agent writes the brief back to the card.',
        parameters: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string', description: 'Contact id or exact name.' },
            focus: { type: 'string', description: 'Optional focus for the research.' },
          },
          required: ['id'],
        },
      },
    ]

    const output = {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    }

    for (const definition of toolList) {
      ctx.effect(
        () =>
          tools.register({
            ...definition,
            output,
            async execute(args, exec) {
              try {
                await ready
                switch (definition.name) {
                  case 'business_me_get':
                    return { ok: true, me: store.publicMe(), hasMe: hasMe(store.me) }
                  case 'business_me_save': {
                    const me = await store.saveMe({
                      identity: args?.identity,
                      needs: args?.needs,
                      offers: args?.offers,
                      goals: args?.goals,
                      preferences: args?.preferences,
                      source: args?.source,
                    })
                    return { ok: true, me, hasMe: hasMe(me) }
                  }
                  case 'business_contact_list': {
                    const query = typeof args?.query === 'string' ? args.query.trim().toLowerCase() : ''
                    const contacts = store.list().filter(contact => {
                      if (!query) return true
                      return [contact.name, contact.nameEn, contact.company, contact.role, ...(contact.tags || [])]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase()
                        .includes(query)
                    })
                    return {
                      ok: true,
                      count: contacts.length,
                      contacts: contacts.map(brief),
                      types: store.publicTypes(),
                    }
                  }
                  case 'business_contact_get': {
                    const contact = store.find(args?.id)
                    if (!contact) return fail('找不到这张名片')
                    return { ok: true, contact: publicContact(contact) }
                  }
                  case 'business_contact_save': {
                    const raw = { id: args?.id }
                    for (const key of ['name', 'nameEn', 'type', 'role', 'company', 'city', 'tags', 'notes', 'lastContactAt']) {
                      if (args?.[key] !== undefined) raw[key] = args[key]
                    }
                    if (args?.email !== undefined || args?.wechat !== undefined || args?.phone !== undefined) {
                      raw.contact = {}
                      if (args.email !== undefined) raw.contact.email = args.email
                      if (args.wechat !== undefined) raw.contact.wechat = args.wechat
                      if (args.phone !== undefined) raw.contact.phone = args.phone
                    }
                    if (args?.nextStepText !== undefined) {
                      raw.nextStep = { text: args.nextStepText, at: args.nextStepAt }
                    }
                    const contact = await store.upsert(raw)
                    const compose = exec?.agent?.id ? composeOfSession(String(exec.agent.id)) : null
                    if (compose) {
                      compose.status = 'done'
                      compose.contactId = contact.id
                      compose.reply = compose.reply || '已建好'
                      compose.updatedAt = Date.now()
                    }
                    return { ok: true, id: contact.id, contact: brief(contact) }
                  }
                  case 'business_contact_note': {
                    const target = store.find(args?.id)
                    if (!target) return fail('找不到这张名片')
                    const contact = await store.addNote(target.id, {
                      text: args?.text,
                      kind: args?.kind,
                      at: args?.at,
                    })
                    return { ok: true, id: contact.id, timeline: contact.timeline.slice(0, 3) }
                  }
                  case 'business_contact_research_save': {
                    const target = store.find(args?.id)
                    if (!target) return fail('找不到这张名片')
                    const contact = await store.appendResearch(target.id, {
                      summary: args?.summary,
                      title: args?.title,
                      focus: args?.focus,
                      sources: args?.sources,
                    })
                    const entry = contact.research.entries[0]
                    return {
                      ok: true,
                      id: contact.id,
                      researchId: entry?.id,
                      at: entry?.at,
                      title: entry?.title,
                      sources: entry?.sources?.length || 0,
                      count: contact.research.entries.length,
                    }
                  }
                  case 'business_contact_research': {
                    const target = store.find(args?.id)
                    if (!target) return fail('找不到这张名片')
                    const result = await research(target.id, args?.focus)
                    return { ok: true, id: target.id, sessionId: result.sessionId, started: true }
                  }
                  default:
                    return fail('未知工具')
                }
              } catch (error) {
                return fail(error)
              }
            },
          }),
        `business-cards: ${definition.name} tool`,
      )
    }

    ctx.effect(
      () =>
        ctx.get('systemPrompt')?.section({
          name: 'business-cards',
          order: 58,
          text: 'The user keeps a private business-contact wall (investors, partners, clients, advisors) in the sidebar. Use the business_contact_* tools when they mention a specific person or company, ask you to add someone, record an interaction, prepare for a meeting, or look someone up. Never invent contact details. Research means real web search: append each round as its own dated record with business_contact_research_save (summary + HTTP(S) sources), never overwrite older records. Contact categories are user-defined: business_contact_list returns the available types, and business_contact_save only accepts those ids. The user\'s own profile lives in business_me_get/business_me_save: read it before suggesting who to contact or what to say; when advice depends on their situation but the profile is empty, ask 1-2 questions and save the answers with business_me_save (only what they actually said).',
        }),
      'business-cards: prompt section',
    )
  }

  // 方便排查：数据目录与工具名不进日志内容，只留一条启动信息。
  ctx.effect(() => {
    console.info(`[business-cards] store: ${dataDir}`)
    return () => {}
  }, 'business-cards: boot')
}
