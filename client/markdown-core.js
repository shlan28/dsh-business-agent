// 轻量 Markdown 解析：只做会话里真正会出现的那一档语法，输出纯 token 树，方便单测。
// 支持：标题 #/##/###、无序/有序列表、引用、代码块 ```、行内代码、粗体、斜体、删除线、
//       链接 [文字](url)、裸链接、分隔线 ---、GFM 表格（含对齐）。嵌套列表不处理（当平铺列表）。

const FENCE = /^```\s*([\w-]*)\s*$/
const HEADING = /^(#{1,6})\s+(.+?)\s*#*\s*$/
const QUOTE = /^>\s?(.*)$/
const ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/
const RULE = /^([-*_])\1{2,}\s*$/
const TABLE_SEPARATOR = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/

const INLINE = /(`[^`\n]+`|\*\*[^*\n]+\*\*|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|!\[[^\]]*\]\([^)]*\)|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s<>()（）]+)/g

/** 把 `| a | b |` 拆成单元格；支持 \| 转义，太短的表格行自动用空串补齐。 */
export function splitTableRow(line, columns = 0) {
  const source = String(line ?? '').trim().replace(/^\|/, '').replace(/\|$/, '')
  const cells = []
  let buffer = ''
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    if (char === '\\' && source[index + 1] === '|') {
      buffer += '|'
      index += 1
      continue
    }
    if (char === '|') {
      cells.push(buffer.trim())
      buffer = ''
      continue
    }
    buffer += char
  }
  cells.push(buffer.trim())
  while (columns && cells.length < columns) cells.push('')
  return columns ? cells.slice(0, columns) : cells
}

/** 分隔行 → 每列的对齐方式（left / center / right / null）。 */
function tableAlignments(line) {
  return splitTableRow(line).map(cell => {
    const value = cell.trim()
    const left = value.startsWith(':')
    const right = value.endsWith(':')
    if (left && right) return 'center'
    if (right) return 'right'
    return 'left'
  })
}

/** 行内 token：文本 / 粗体 / 斜体 / 行内代码 / 删除线 / 链接。 */
export function parseInline(text) {
  const source = String(text ?? '')
  const tokens = []
  let last = 0
  let match
  while ((match = INLINE.exec(source))) {
    if (match.index > last) tokens.push({ type: 'text', text: source.slice(last, match.index) })
    const raw = match[0]
    if (raw.startsWith('`')) tokens.push({ type: 'code', text: raw.slice(1, -1) })
    else if (raw.startsWith('**')) tokens.push({ type: 'strong', text: raw.slice(2, -2) })
    else if (raw.startsWith('~~')) tokens.push({ type: 'strike', text: raw.slice(2, -2) })
    else if (raw.startsWith('![')) tokens.push({ type: 'text', text: raw })
    else if (raw.startsWith('[')) {
      const link = raw.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
      tokens.push(link ? { type: 'link', text: link[1], href: link[2] } : { type: 'text', text: raw })
    } else if (raw.startsWith('*')) tokens.push({ type: 'em', text: raw.slice(1, -1) })
    else if (raw.startsWith('_')) tokens.push({ type: 'em', text: raw.slice(1, -1) })
    else if (raw.startsWith('http')) tokens.push({ type: 'link', text: raw, href: raw })
    else tokens.push({ type: 'text', text: raw })
    last = match.index + raw.length
  }
  if (last < source.length) tokens.push({ type: 'text', text: source.slice(last) })
  return tokens
}

/** 块级解析：段落 / 标题 / 列表 / 引用 / 代码块 / 分隔线。 */
export function parseMarkdown(text) {
  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n')
  const blocks = []
  let paragraph = []
  const flush = () => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', text: paragraph.join('\n') })
      paragraph = []
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    const fence = line.match(FENCE)
    if (fence) {
      flush()
      const body = []
      index += 1
      while (index < lines.length && !FENCE.test(lines[index])) {
        body.push(lines[index])
        index += 1
      }
      blocks.push({ type: 'code', lang: fence[1] || '', text: body.join('\n') })
      continue
    }

    if (!line.trim()) {
      flush()
      continue
    }

    const heading = line.match(HEADING)
    if (heading) {
      flush()
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] })
      continue
    }

    if (RULE.test(line.trim())) {
      flush()
      blocks.push({ type: 'hr' })
      continue
    }

    const quote = line.match(QUOTE)
    if (quote) {
      flush()
      const body = [quote[1]]
      while (index + 1 < lines.length) {
        const next = lines[index + 1].match(QUOTE)
        if (!next) break
        body.push(next[1])
        index += 1
      }
      blocks.push({ type: 'quote', text: body.join('\n') })
      continue
    }

    const tableHead = line.includes('|') && index + 1 < lines.length && TABLE_SEPARATOR.test(lines[index + 1])
    if (tableHead) {
      flush()
      const header = splitTableRow(line)
      const align = tableAlignments(lines[index + 1])
      index += 2
      const rows = []
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(splitTableRow(lines[index], header.length))
        index += 1
      }
      blocks.push({ type: 'table', header, align, rows })
      continue
    }

    const item = line.match(ITEM)
    if (item) {
      flush()
      const ordered = /\d/.test(item[2])
      const items = [item[3]]
      while (index + 1 < lines.length) {
        const next = lines[index + 1]
        if (!next.trim()) break
        const nextItem = next.match(ITEM)
        if (nextItem) {
          if (/\d/.test(nextItem[2]) !== ordered) break
          items.push(nextItem[3])
          index += 1
          continue
        }
        if (/^\s{2,}\S/.test(next)) {
          items[items.length - 1] += `\n${next.trim()}`
          index += 1
          continue
        }
        break
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }

    paragraph.push(line)
  }
  flush()
  return blocks
}
