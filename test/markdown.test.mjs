import test from 'node:test'
import assert from 'node:assert/strict'
import { parseInline, parseMarkdown } from '../client/markdown-core.js'

test('headings, lists, quotes, rules and code fences become blocks', () => {
  const blocks = parseMarkdown(
    [
      '## 两点研判（推测）',
      '- **决策权**边界比头衔小',
      '- 不宜押在个人身上',
      '',
      '1. 先给留存',
      '2. 再讲出海',
      '',
      '> 引用一句公开原话',
      '',
      '```js',
      'const x = 1',
      '```',
      '---',
      '结束段落',
    ].join('\n'),
  )
  assert.equal(blocks[0].type, 'heading')
  assert.equal(blocks[0].level, 2)
  assert.equal(blocks[0].text, '两点研判（推测）')
  assert.equal(blocks[1].type, 'list')
  assert.equal(blocks[1].ordered, false)
  assert.equal(blocks[1].items.length, 2)
  assert.equal(blocks[2].type, 'list')
  assert.equal(blocks[2].ordered, true)
  assert.equal(blocks[3].type, 'quote')
  assert.equal(blocks[4].type, 'code')
  assert.equal(blocks[4].lang, 'js')
  assert.equal(blocks[4].text, 'const x = 1')
  assert.equal(blocks[5].type, 'hr')
  assert.equal(blocks[6].type, 'paragraph')
})

test('inline: bold, italic, code, strike, links and bare urls', () => {
  const tokens = parseInline('**粗** 和 *斜* 和 `code` 和 ~~删~~ 和 [文档](https://a.com/x) 和 https://b.com/y')
  const kinds = tokens.map(token => token.type)
  assert.deepEqual(kinds, ['strong', 'text', 'em', 'text', 'code', 'text', 'strike', 'text', 'link', 'text', 'link'])
  assert.equal(tokens.find(token => token.type === 'link').href, 'https://a.com/x')
  assert.equal(tokens.filter(token => token.type === 'link').length, 2)
})

test('plain text passes through untouched and html stays text', () => {
  const tokens = parseInline('<script>alert(1)</script> **粗**')
  assert.equal(tokens[0].text, '<script>alert(1)</script> ')
  assert.equal(tokens[1].type, 'strong')
  const blocks = parseMarkdown('纯文本\n第二行')
  assert.equal(blocks.length, 1)
  assert.equal(blocks[0].type, 'paragraph')
  assert.equal(blocks[0].text, '纯文本\n第二行')
})

test('unordered markers *, + and - all work; indented lines append to the item', () => {
  const list = parseMarkdown('* 第一条\n+ 第二条')
  assert.equal(list[0].type, 'list')
  assert.deepEqual(list[0].items, ['第一条', '第二条'])
  // 缩进但不以列表符开头的行，算作上一条的续行
  const joined = parseMarkdown('* 第一条\n  接着说明')
  assert.deepEqual(joined[0].items, ['第一条\n接着说明'])
})

test('empty input yields no blocks', () => {
  assert.deepEqual(parseMarkdown(''), [])
  assert.deepEqual(parseMarkdown(null), [])
})

test('gfm tables: header, alignment, rows and escaped pipes', () => {
  const blocks = parseMarkdown(
    [
      '| 页面 | 用途 | 备注 |',
      '|:---|:---:|---:|',
      '| 首页 | 看优先联系的人 | **重点** |',
      '| 档案 | 互动与建议 | a \\| b |',
      '',
      '普通段落',
    ].join('\n'),
  )
  assert.equal(blocks[0].type, 'table')
  assert.deepEqual(blocks[0].header, ['页面', '用途', '备注'])
  assert.deepEqual(blocks[0].align, ['left', 'center', 'right'])
  assert.equal(blocks[0].rows.length, 2)
  assert.deepEqual(blocks[0].rows[1], ['档案', '互动与建议', 'a | b'])
  assert.equal(blocks[1].type, 'paragraph')

  const short = parseMarkdown('| a | b |\n|---|---|\n| 只有一格 |')
  assert.deepEqual(short[0].rows[0], ['只有一格', ''])
})

test('a line with pipes but no separator stays a paragraph', () => {
  const blocks = parseMarkdown('a | b 不是表格\n下一行')
  assert.equal(blocks.length, 1)
  assert.equal(blocks[0].type, 'paragraph')
})
