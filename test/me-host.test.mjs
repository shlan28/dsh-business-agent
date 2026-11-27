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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

test('my-card chat: dsh asks questions, answers are saved, chat state tracks', async () => {
  const dataHome = await mkdtemp(join(tmpdir(), 'bc-me-'))
  const previousHome = process.env.DSH_HOME
  process.env.DSH_HOME = dataHome
  try {
    const routes = []
    const tools = []
    const prompts = []
    let eventHandler
    let created = 0
    const webServer = { register: route => { routes.push(route); return () => {} } }
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
                return { sessionId: `s-me-${created}` }
              },
              async prompt(payload) {
                prompts.push(payload)
              },
              cancel() {},
            }
          case 'workingDirectory':
            return { defaultDirectory: dataHome }
          case 'tools':
            return { register: tool => { tools.push(tool); return () => {} } }
          case 'systemPrompt':
            return { section: () => () => {} }
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
    const handler = routes[0].handler
    const call = async (method, path, body) => {
      const res = makeRes()
      await handler(makeReq(method, path, body), res)
      return { status: res.statusCode, data: JSON.parse(res.body) }
    }

    const empty = await call('GET', '/business-cards/state')
    assert.equal(empty.data.hasMe, false)
    assert.equal(empty.data.questions.length, 7, '空档案有 7 个待答问题')

    const started = await call('POST', '/business-cards/me/chat/start')
    assert.equal(started.data.ok, true)
    assert.equal(started.data.started, true)
    assert.equal(started.data.sessionId, 's-me-1')
    assert.equal(created, 1, '为我的名片单独开会话')
    assert.match(prompts[0].content[0].text, /【还没填】/)
    assert.match(prompts[0].content[0].text, /一次只问一个问题/)

    eventHandler('s-me-1', { type: 'turn/start', data: {} })
    eventHandler('s-me-1', {
      type: 'assistant/message',
      data: { message: { content: [{ type: 'text', text: '你叫什么名字？' }] } },
    })
    eventHandler('s-me-1', { type: 'turn/end', data: { reason: { kind: 'completed' } } })
    await sleep(40)

    const state = await call('GET', '/business-cards/me/chat/state?after=0')
    assert.equal(state.data.entries.length, 2, '开场提问 + 用户 kickoff')
    assert.equal(state.data.running, false)
    assert.equal(state.data.questions.length, 7)

    const sent = await call('POST', '/business-cards/me/chat/send', { text: '关于「你叫什么名字？」：石璐' })
    assert.equal(sent.data.ok, true)
    assert.match(prompts[prompts.length - 1].content[0].text, /石璐/)

    const saveMe = tools.find(tool => tool.name === 'business_me_save')
    await saveMe.execute({
      identity: { name: '石璐', oneLiner: '做 AI 原生社区', stage: '种子轮' },
      source: { kind: 'chat', note: '用户说：我叫石璐' },
    })
    const afterSave = await call('GET', '/business-cards/state')
    assert.equal(afterSave.data.hasMe, true)
    assert.equal(afterSave.data.questions.length, 4, '答完 3 个只剩 4 个')

    const again = await call('POST', '/business-cards/me/chat/start')
    assert.equal(again.data.started, false, '已有对话不重复开场')

    // 别的会话的事件不会写进我的名片
    eventHandler('s-unknown', { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '不该出现' }] } } })
    await sleep(20)
    const untouched = await call('GET', '/business-cards/me/chat/state?after=0')
    assert.equal(untouched.data.entries.some(entry => entry.text === '不该出现'), false)
  } finally {
    if (previousHome === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = previousHome
    await rm(dataHome, { recursive: true, force: true })
  }
})
