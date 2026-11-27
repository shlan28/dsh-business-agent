import test from 'node:test'
import assert from 'node:assert/strict'
import { formatResearchSummary } from '../client/research-format.js'

test('legacy 【事实】/【推测】 records become markdown sections with lists', () => {
  const text = formatResearchSummary('【事实】①职位：锦秋副总裁 ②2026-09 沙龙 ③投资 AI 应用\n【推测】AR 非其主赛道')
  assert.match(text, /^## 事实$/m)
  assert.match(text, /^## 推测$/m)
  assert.match(text, /^- 职位：锦秋副总裁$/m)
  assert.match(text, /^- 投资 AI 应用$/m)
})

test('markdown records are left untouched (idempotent)', () => {
  const md = '## 一句话结论\n值得见。\n\n## 事实（附来源）\n- 2026-09 大会（36kr）\n'
  assert.equal(formatResearchSummary(md), md.trim())
})

test('plain text without sections keeps its paragraphs, blank lines collapsed', () => {
  const text = formatResearchSummary('第一段。\n\n\n\n第二段。')
  assert.equal(text, '第一段。\n\n第二段。')
  assert.equal(formatResearchSummary(''), '')
  assert.equal(formatResearchSummary(null), '')
})

test('only multi-marker enumerations are split, single ① stays as text', () => {
  const single = formatResearchSummary('①只有一个标记，不拆')
  assert.equal(single, '①只有一个标记，不拆')
  const multi = formatResearchSummary('①第一项 ②第二项')
  assert.match(multi, /^- 第一项$/m)
  assert.match(multi, /^- 第二项$/m)
})
