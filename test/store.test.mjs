import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Store } from '../src/store.js'

async function withStore(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'bc-store-'))
  try {
    const store = await new Store(dir).load()
    return await fn(store, dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

test('upsert assigns numbers and persists across reload', async () => {
  await withStore(async (store, dir) => {
    const first = await store.upsert({ name: '沈亦舟', type: 'investor', company: '红杉中国', tags: ['AI 应用', 'B 轮'] })
    assert.equal(first.no, 1)
    assert.equal(first.type, 'investor')
    assert.deepEqual(first.tags, ['AI 应用', 'B 轮'])
    const second = await store.upsert({ name: '周牧', type: 'client' })
    assert.equal(second.no, 2)
    assert.equal(store.list().length, 2)

    const reloaded = await new Store(dir).load()
    assert.equal(reloaded.list().length, 2)
    assert.equal(reloaded.find('沈亦舟').company, '红杉中国')
  })
})

test('update keeps untouched fields and can clear next step', async () => {
  await withStore(async store => {
    const created = await store.upsert({ name: '林晚', email: undefined, contact: { email: 'wan@example.com' } })
    const updated = await store.upsert({ id: created.id, name: '林晚', nextStep: { text: '约咖啡', at: '2026-12-01T10:00:00+08:00' } })
    assert.equal(updated.contact.email, 'wan@example.com')
    assert.equal(updated.nextStep.text, '约咖啡')
    const cleared = await store.upsert({ id: created.id, name: '林晚', nextStep: null })
    assert.equal(cleared.nextStep, null)
  })
})

test('notes update timeline and last contact', async () => {
  await withStore(async store => {
    const created = await store.upsert({ name: '陈可为' })
    const noted = await store.addNote(created.id, { text: '聊了 PLG 漏斗', kind: 'call', at: '2026-11-16T12:00:00+08:00' })
    assert.equal(noted.timeline.length, 1)
    assert.equal(noted.lastContactAt, '2026-11-16T04:00:00.000Z')
    await assert.rejects(() => store.addNote(created.id, { text: '  ' }), /记点什么/)
  })
})

test('research accepts http sources and drops javascript urls', async () => {
  await withStore(async store => {
    const created = await store.upsert({ name: '顾宁' })
    const saved = await store.saveResearch(created.id, {
      summary: '最近在做城市主题联名',
      sources: [
        { title: '36kr', url: 'https://36kr.com/p/1' },
        { title: 'bad', url: 'javascript:alert(1)' },
      ],
    })
    assert.equal(saved.research.sources.length, 1)
    assert.equal(saved.research.sources[0].site, '36kr.com')
    assert.ok(saved.research.updatedAt)
  })
})

test('chat entries are ordered, trimmed and incrementally readable', async () => {
  await withStore(async store => {
    const created = await store.upsert({ name: '苏迟' })
    await store.appendChat(created.id, { role: 'user', text: '你好' })
    await store.appendChat(created.id, { role: 'assistant', text: '你好，我是 DSH' })
    const delta = await store.chatDelta(created.id, 0)
    assert.equal(delta.entries.length, 2)
    assert.equal(delta.lastSeq, 2)
    const tail = await store.chatDelta(created.id, 1)
    assert.equal(tail.entries.length, 1)
    assert.equal(tail.entries[0].role, 'assistant')
  })
})

test('corrupt contacts file is backed up and does not crash', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'bc-store-'))
  try {
    await writeFile(join(dir, 'contacts.json'), '{not json')
    const store = await new Store(dir).load()
    assert.equal(store.list().length, 0)
    const backups = await readFile(join(dir, 'contacts.json'), 'utf8')
    assert.equal(backups, '{not json')
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('remove deletes contact and chat file', async () => {
  await withStore(async (store, dir) => {
    const created = await store.upsert({ name: '白露' })
    await store.appendChat(created.id, { role: 'user', text: 'hi' })
    await store.remove(created.id)
    assert.equal(store.list().length, 0)
    await assert.rejects(() => readFile(join(dir, 'chats', `${created.id}.json`), 'utf8'))
  })
})
