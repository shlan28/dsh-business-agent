import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
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

test('research appends one dated document per round with its sources', async () => {
  await withStore(async (store, dir) => {
    const created = await store.upsert({ name: '顾宁' })
    const first = await store.appendResearch(created.id, {
      title: '品牌联名',
      summary: '最近在做城市主题联名',
      sources: [
        { title: '36kr', url: 'https://36kr.com/p/1' },
        { title: 'bad', url: 'javascript:alert(1)' },
      ],
      at: '2026-11-01T02:00:00+08:00',
    })
    assert.equal(first.research.entries.length, 1)
    const doc = first.research.entries[0]
    assert.equal(doc.title, '品牌联名')
    assert.equal(doc.sources.length, 1, 'javascript: url 被丢弃')
    assert.equal(doc.sources[0].site, '36kr.com')
    assert.equal(doc.at, '2026-10-31T18:00:00.000Z')
    assert.equal(first.research.updatedAt, doc.at)

    const second = await store.appendResearch(created.id, {
      summary: '刚拿了一轮融资',
      sources: [{ url: 'https://example.com/a' }],
    })
    assert.equal(second.research.entries.length, 2, '第二次研究不覆盖第一次')
    assert.equal(second.research.entries[0].summary, '刚拿了一轮融资')
    assert.equal(second.research.entries[0].title, '刚拿了一轮融资', '缺标题时用首行兜底')
    assert.notEqual(second.research.entries[0].id, second.research.entries[1].id)

    await assert.rejects(
      () => store.appendResearch(created.id, { summary: '没有来源', sources: [] }),
      /来源/,
    )

    const reloaded = await new Store(dir).load()
    assert.equal(reloaded.find('顾宁').research.entries.length, 2)
  })
})

test('legacy single research record is migrated into one document', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'bc-store-'))
  try {
    await writeFile(
      join(dir, 'contacts.json'),
      JSON.stringify({
        schema: 1,
        revision: 3,
        contacts: [
          {
            id: 'c_legacy',
            no: 1,
            name: '沈亦舟',
            type: 'investor',
            timeline: [],
            research: {
              summary: '旧版单份研究',
              sources: [{ title: 'X', url: 'https://x.example.com/1' }],
              updatedAt: '2026-10-01T00:00:00.000Z',
            },
          },
        ],
      }),
    )
    const store = await new Store(dir).load()
    const contact = store.find('沈亦舟')
    assert.equal(contact.research.entries.length, 1)
    assert.equal(contact.research.entries[0].summary, '旧版单份研究')
    assert.equal(contact.research.entries[0].at, '2026-10-01T00:00:00.000Z')
    assert.equal(contact.research.entries[0].sources[0].site, 'x.example.com')
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
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

test('my profile: save, partial update, reload and reset', async () => {
  await withStore(async (store, dir) => {
    assert.equal(store.publicMe().identity.name, '')
    const saved = await store.saveMe({
      identity: { name: '石璐', oneLiner: '做 AI 原生社区', stage: '种子轮' },
      needs: [{ text: 'Q1 融 500 万', kind: 'funding' }],
      offers: [{ text: '帮人看技术选型' }],
      goals: [{ text: '跑通 3 个标杆客户' }],
      preferences: { tone: '直接', redLines: ['周末不发消息'] },
      source: { kind: 'chat', field: 'needs', note: '用户说：我们在融种子轮' },
    })
    assert.equal(saved.identity.name, '石璐')
    assert.equal(saved.needs[0].kind, 'funding')
    assert.equal(saved.sources[0].note, '用户说：我们在融种子轮')
    assert.ok(saved.updatedAt)

    const partial = await store.saveMe({ preferences: { channel: '微信优先' }, needs: undefined })
    assert.equal(partial.identity.name, '石璐', '部分更新不丢身份')
    assert.equal(partial.needs.length, 1, 'undefined 的列表不清空')
    assert.equal(partial.preferences.tone, '直接')
    assert.equal(partial.preferences.channel, '微信优先')

    const reloaded = await new Store(dir).load()
    assert.equal(reloaded.publicMe().identity.name, '石璐')
    assert.equal(reloaded.publicMe().goals.length, 1)

    await store.resetMe()
    assert.equal(store.publicMe().identity.name, '')
    assert.equal(store.publicMe().needs.length, 0)
    const afterReset = await new Store(dir).load()
    assert.equal(afterReset.publicMe().identity.name, '')
  })
})

test('corrupt me.json is backed up and degrades to an empty profile', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'bc-store-'))
  try {
    await writeFile(join(dir, 'me.json'), '{oops')
    const store = await new Store(dir).load()
    assert.equal(store.publicMe().identity.name, '')
    const backups = await readdir(join(dir, 'backups'))
    assert.ok(backups.some(name => name.startsWith('broken-me-')), '坏文件先备份')
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
