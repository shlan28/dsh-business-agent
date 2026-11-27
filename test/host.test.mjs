import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { apply } from '../src/host.js'

function makeRes() {
  return {
    statusCode: 0,
    headersSent: false,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name] = value
    },
    end(body) {
      this.body = body
      this.headersSent = true
    },
  }
}

function makeReq(method, path, body) {
  return {
    url: path,
    method,
    headers: {},
    async *[Symbol.asyncIterator]() {
      if (body !== undefined) yield Buffer.from(JSON.stringify(body))
    },
  }
}

test('host routes, chat wiring and agent tools work together', async () => {
  const dataHome = await mkdtemp(join(tmpdir(), 'bc-host-'))
  const previousHome = process.env.DSH_HOME
  process.env.DSH_HOME = dataHome
  try {
    const routes = []
    const tools = []
    const sections = []
    const prompts = []
    let eventHandler
    let created = 0
    const webServer = {
      register(route) {
        routes.push(route)
        return () => {}
      },
    }
    const ctx = {
      webServer,
      get(name) {
        switch (name) {
          case 'connection':
            return { requestRejection: () => 0 }
          case 'webServer':
            return webServer
          case 'sessionController':
            return {
              async create() {
                created += 1
                return { sessionId: created === 1 ? 'sess-1' : `sess-${created}` }
              },
              async prompt(payload) {
                prompts.push(payload)
              },
              cancel() {},
            }
          case 'workingDirectory':
            return { defaultDirectory: dataHome }
          case 'tools':
            return {
              register(tool) {
                tools.push(tool)
                return () => {}
              },
            }
          case 'systemPrompt':
            return {
              section(section) {
                sections.push(section)
                return () => {}
              },
            }
          default:
            return undefined
        }
      },
      effect(fn) {
        const dispose = fn()
        return () => dispose?.()
      },
      on(event, handler) {
        if (event === 'session/event') eventHandler = handler
        return () => {}
      },
    }
    apply(ctx, {})

    assert.equal(routes.length, 1)
    assert.equal(tools.length, 6)
    assert.equal(sections.length, 1)
    const handler = routes[0].handler
    const call = async (method, path, body) => {
      const res = makeRes()
      await handler(makeReq(method, path, body), res)
      return { status: res.statusCode, data: JSON.parse(res.body) }
    }

    const initial = await call('GET', '/business-cards/state')
    assert.equal(initial.status, 200)
    assert.equal(initial.data.contacts.length, 0)
    assert.equal(initial.data.capabilities.chat, true)

    const saved = await call('POST', '/business-cards/op', {
      action: 'save',
      contact: {
        name: '沈亦舟',
        type: 'investor',
        company: '红杉中国',
        tags: ['AI 应用'],
        contact: { email: 'yz@example.com', wechat: 'shenyizhou' },
      },
    })
    assert.equal(saved.data.ok, true)
    const contactId = saved.data.contact.id

    const saveTool = tools.find(tool => tool.name === 'business_contact_save')
    const partial = await saveTool.execute({ id: contactId, role: '董事总经理' })
    assert.equal(partial.ok, true)
    const getTool = tools.find(tool => tool.name === 'business_contact_get')
    const fetched = await getTool.execute({ id: contactId })
    assert.equal(fetched.contact.role, '董事总经理')
    assert.equal(fetched.contact.contact.email, 'yz@example.com')
    assert.deepEqual(fetched.contact.tags, ['AI 应用'])

    const found = tools.find(tool => tool.name === 'business_contact_list')
    const listed = await found.execute({ query: '红杉' })
    assert.equal(listed.ok, true)
    assert.equal(listed.count, 1)

    const sent = await call('POST', '/business-cards/chat/send', { id: contactId, text: '她最近在投什么？' })
    assert.equal(sent.data.ok, true)
    assert.equal(sent.data.sessionId, 'sess-1')
    assert.equal(created, 1)
    assert.equal(prompts.length, 1)
    assert.match(prompts[0].content[0].text, /沈亦舟/)
    assert.match(prompts[0].content[0].text, /她最近在投什么/)

    eventHandler('sess-1', { type: 'turn/start', data: {} })
    eventHandler('sess-1', {
      type: 'assistant/message',
      data: { message: { content: [{ type: 'text', text: '她最近在看 AI 应用。' }] } },
    })
    eventHandler('sess-1', { type: 'turn/end', data: { reason: { kind: 'completed' } } })
    await new Promise(resolve => setTimeout(resolve, 40))

    const chat = await call('GET', `/business-cards/chat/state?id=${contactId}&after=0`)
    assert.equal(chat.status, 200)
    assert.equal(chat.data.running, false)
    assert.equal(chat.data.entries.length, 2)
    assert.equal(chat.data.entries[0].role, 'user')
    assert.equal(chat.data.entries[1].role, 'assistant')

    const second = await call('POST', '/business-cards/chat/send', { id: contactId, text: '再查一次' })
    assert.equal(second.data.ok, true)
    assert.equal(created, 1, 'session is reused')
    eventHandler('sess-1', { type: 'turn/end', data: { reason: { kind: 'completed' } } })

    const researchTool = tools.find(tool => tool.name === 'business_contact_research')
    const research = await researchTool.execute({ id: contactId, focus: '最近的公开动态' })
    assert.equal(research.ok, true)
    assert.equal(prompts.length, 3)

    await call('POST', '/business-cards/op', {
      action: 'note',
      id: contactId,
      text: '聊了下 B 轮节奏',
      kind: 'call',
    })
    const afterNote = await call('GET', '/business-cards/state')
    assert.equal(afterNote.data.contacts[0].timeline.length, 1)
    assert.equal(afterNote.data.contacts[0].timeline[0].kind, 'call')

    const compose = await call('POST', '/business-cards/compose', { text: '周牧，观夏创始人，客户，标签 品牌 / DTC' })
    assert.equal(compose.data.ok, true)
    assert.equal(compose.data.status, 'pending')
    assert.equal(created, 2, 'compose opens its own session')
    assert.equal(prompts.length, 4)
    assert.match(prompts[3].content[0].text, /周牧/)

    eventHandler('sess-2', {
      type: 'assistant/message',
      data: { message: { content: [{ type: 'text', text: '这个人的名字是？' }] } },
    })
    const asked = await call('GET', `/business-cards/compose/state?id=${compose.data.id}`)
    assert.equal(asked.data.status, 'pending')
    assert.match(asked.data.reply, /名字/)

    const composed = await saveTool.execute(
      { name: '周牧', type: 'client', company: '观夏', tags: ['品牌', 'DTC'] },
      { agent: { id: 'sess-2' } },
    )
    assert.equal(composed.ok, true)
    const done = await call('GET', `/business-cards/compose/state?id=${compose.data.id}`)
    assert.equal(done.data.status, 'done')
    assert.equal(done.data.contactId, composed.id)

    const withComposed = await call('GET', '/business-cards/state')
    assert.equal(withComposed.data.contacts.length, 2)

    const deleted = await call('POST', '/business-cards/op', { action: 'delete', id: contactId })
    assert.equal(deleted.data.ok, true)
    assert.equal(deleted.data.state.contacts.length, 1)
    const deletedComposed = await call('POST', '/business-cards/op', { action: 'delete', id: composed.id })
    assert.equal(deletedComposed.data.ok, true)
    assert.equal(deletedComposed.data.state.contacts.length, 0)
  } finally {
    if (previousHome === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = previousHome
    await rm(dataHome, { recursive: true, force: true })
  }
})
