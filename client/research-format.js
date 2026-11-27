// 研究记录里可能有两种写法：新记录是 Markdown，老记录是「【事实】①②③」式的纯文本。
// 展示前统一整理成 Markdown，让老记录也有小标题和列表，而不是一堵墙。

const SECTION = /^【(事实|推测|结论|研判|建议|下一步|一句话结论)[^】]*】\s*/
const CIRCLED = /[①②③④⑤⑥⑦⑧⑨⑩]/g

function splitCircled(line) {
  if (!line || line.startsWith('#') || line.startsWith('-') || /^\d+[.)]\s/.test(line)) return null
  const marks = line.match(CIRCLED)
  if (!marks || marks.length < 2) return null
  const parts = line.split(/[①②③④⑤⑥⑦⑧⑨⑩]/).map(part => part.trim()).filter(Boolean)
  if (parts.length < 2) return null
  return parts
}

/** 把研究记录正文整理成有结构的 Markdown（幂等：已经是 Markdown 就原样返回）。 */
export function formatResearchSummary(summary) {
  const text = String(summary ?? '').trim()
  if (!text) return ''
  if (/^#{1,6}\s/m.test(text)) return text

  const lines = text.split('\n')
  const out = []
  for (const raw of lines) {
    const line = raw.trimEnd()
    const section = line.match(SECTION)
    if (section) {
      const rest = line.slice(section[0].length).trim()
      out.push(`## ${section[1]}`)
      const items = rest ? splitCircled(rest) : null
      if (items) out.push(...items.map(item => `- ${item}`))
      else if (rest) out.push(rest)
      continue
    }
    const circled = splitCircled(line)
    if (circled) {
      out.push(...circled.map(item => `- ${item}`))
      continue
    }
    out.push(line)
  }

  // 「## 事实」后面紧跟的一段，若还是单行长文，就保留成段落（Markdown 自然换行）。
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}
