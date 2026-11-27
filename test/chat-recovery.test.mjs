import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { apply } from '../src/host.js'

function makeRes() {
  return {
    statusCode: 0,
    headersSent: false,
    headers: {},
    body: '',
    setHeader(name, value) { this.headers[name] = value },
    end(body) { this.body = body; this.headersSent = true },
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

test('chat history survives a missing DSH session and a lost local cache', async () => {
  const dataHome = await mkdtemp(join(tmpdir(), 'bc-recover-'))
  const previousHome = process.env.DSH_HOME
  process.env.DSH_HOME = dataHome
  try {
    const routes = []
    const prompts = []
    let created = 0
    let failFirstPrompt = true
    const historyRecords = [
      { type: 'event', event: { type: 'user/message', data: { message: '她最近在投什么？' } } },
      { type: 'event', event: { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '她在看 AI 应用层。' }] } } } },
    ]
    const webServer = { register: route => { routes.push(route); return () => {} } }
    const ctrl = {
      async create() { created += 1; return { sessionId: `s-${created}` } },
      async prompt(payload) {
        if (failFirstPrompt) {
          failFirstPrompt = false
          throw new Error('session/not-found: session "s-0" not found')
        }
        prompts.push(payload)
      },
      async events() { return { cursor: 2, records: historyRecords, hasMore: false } },
      cancel() {},
    }
    const ctx = {
      webServer,
      get(name) {
        switch (name) {
          case 'connection': return { requestRejection: () => 0 }
          case 'webServer': return webServer
          case 'sessionController': return ctrl
          case 'workingDirectory': return { defaultDirectory: dataHome }
          case 'tools': return { register: () => () => {} }
          case 'systemPrompt': return { section: () => () => {} }
          default: return undefined
        }
      },
      effect(fn) { const dispose = fn(); return () => dispose?.() },
      on() { return () => {} },
    }
    apply(ctx, {})
    const handler = routes[0].handler
    const call = async (method, path, body) => {
      const res = makeRes()
      await handler(makeReq(method, path, body), res)
      return { status: res.statusCode, data: JSON.parse(res.body) }
    }

    const saved = await call('POST', '/business-cards/op', {
      action: 'save',
      contact: { name: '沈亦舟', type: 'investor' },
    })
    const contactId = saved.data.contact.id

    // 第一次发送：原会话报 not-found → 自动新建会话并重试成功
    const sent = await call('POST', '/business-cards/chat/send', { id: contactId, text: '她最近在投什么？' })
    assert.equal(sent.data.ok, true)
    await sleep(60)
    assert.equal(created, 2, '会话丢失后自动重建了一次')
    assert.equal(prompts.length, 1, '重试用的是新会话')
    assert.equal(prompts[0].sessionId, 's-2')

    const afterSend = await call('GET', `/business-cards/chat/state?id=${contactId}&after=0`)
    const texts = afterSend.data.entries.map(entry => entry.text).join('\n')
    assert.match(texts, /原来的 DSH 会话已不存在/, '给出重建提示，历史不丢')
    assert.match(texts, /她最近在投什么？/)

    // 模拟面板缓存文件丢失：删掉 chats/<id>.json 与 .bak，再起一个全新的 Host 实例（冷启动）
    await rm(join(dataHome, 'business-cards', 'chats', `${contactId}.json`), { force: true })
    await rm(join(dataHome, 'business-cards', 'chats', `${contactId}.json.bak`), { force: true })

    const routes2 = []
    const webServer2 = { register: route => { routes2.push(route); return () => {} } }
    const ctx2 = {
      webServer: webServer2,
      get(name) {
        switch (name) {
          case 'connection': return { requestRejection: () => 0 }
          case 'webServer': return webServer2
          case 'sessionController': return ctrl
          case 'workingDirectory': return { defaultDirectory: dataHome }
          case 'tools': return { register: () => () => {} }
          case 'systemPrompt': return { section: () => () => {} }
          default: return undefined
        }
      },
      effect(fn) { const dispose = fn(); return () => dispose?.() },
      on() { return () => {} },
    }
    apply(ctx2, {})
    const handler2 = routes2[0].handler
    const call2 = async (method, path, body) => {
      const res = makeRes()
      await handler2(makeReq(method, path, body), res)
      return { status: res.statusCode, data: JSON.parse(res.body) }
    }

    const restored = await call2('GET', `/business-cards/chat/state?id=${contactId}&after=0`)
    assert.equal(restored.status, 200)
    const restoredTexts = restored.data.entries.map(entry => entry.text).join('\n')
    assert.match(restoredTexts, /已从 DSH 会话恢复这段对话的历史记录/, '缓存丢了也能从会话恢复')
    assert.match(restoredTexts, /她在看 AI 应用层。/, 'DSH 会话里的历史消息回来了')
  } finally {
    if (previousHome === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = previousHome
    await rm(dataHome, { recursive: true, force: true })
  }
})
