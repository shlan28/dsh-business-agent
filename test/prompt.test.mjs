import test from 'node:test'
import assert from 'node:assert/strict'
import { ME_PROMPT_LIMIT, chatPrompt, meDossier } from '../src/prompt.js'

const me = {
  identity: { name: '石璐', title: '创始人', company: 'Achoverse', oneLiner: '做 AI 原生社区', stage: '种子轮', city: '上海' },
  needs: [{ kind: 'funding', text: 'Q1 前融完 500 万种子轮' }],
  offers: [{ text: '帮人看 AI 产品技术选型' }],
  goals: [{ text: '跑通 3 个标杆客户' }],
  preferences: { tone: '直接', channel: '微信优先', redLines: ['周末不发消息'] },
}

const contact = { name: '沈亦舟', type: 'investor', company: '红杉中国', role: '合伙人', tags: [], timeline: [], research: { entries: [] } }

test('meDossier is empty without a profile', () => {
  assert.equal(meDossier(null), '')
  assert.equal(meDossier({ identity: {} }), '')
})

test('meDossier contains who I am, goals, needs, offers and red lines', () => {
  const block = meDossier(me)
  assert.match(block, /【我】石璐/)
  assert.match(block, /跑通 3 个标杆客户/)
  assert.match(block, /Q1 前融完 500 万/)
  assert.match(block, /帮人看 AI 产品技术选型/)
  assert.match(block, /周末不发消息/)
  assert.ok(block.length <= ME_PROMPT_LIMIT, `不得超过 ${ME_PROMPT_LIMIT} 字，实际 ${block.length}`)
})

test('meDossier stays within the limit even with long lists', () => {
  const long = JSON.parse(JSON.stringify(me))
  long.goals = Array.from({ length: 12 }, (_, i) => ({ text: `目标 ${i} `.repeat(20) }))
  long.needs = Array.from({ length: 12 }, (_, i) => ({ kind: 'other', text: `需求 ${i} `.repeat(20) }))
  long.offers = Array.from({ length: 12 }, (_, i) => ({ text: `能给 ${i} `.repeat(20) }))
  assert.ok(meDossier(long).length <= ME_PROMPT_LIMIT)
})

test('chatPrompt injects my profile and the matching rule', () => {
  const withMe = chatPrompt(contact, '这周先联系谁？', 'chat', me)
  assert.match(withMe, /【我】石璐/)
  assert.match(withMe, /我能给对方什么价值/)
  const withoutMe = chatPrompt(contact, '这周先联系谁？', 'chat', null)
  assert.doesNotMatch(withoutMe, /【我】/)
  assert.match(withoutMe, /还没有我的档案/)
})

test('research prompt tells the model to filter by my goals', () => {
  const text = chatPrompt(contact, '最近的公开动态', 'research', me)
  assert.match(text, /我的目标/)
  assert.match(text, /联网检索/)
})
