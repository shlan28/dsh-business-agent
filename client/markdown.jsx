import React from 'react'
import { parseInline, parseMarkdown } from './markdown-core.js'

function InlineLine({ text }) {
  const tokens = parseInline(text)
  return tokens.map((token, index) => {
    const key = `i${index}`
    if (token.type === 'strong') return <strong key={key}>{token.text}</strong>
    if (token.type === 'em') return <em key={key}>{token.text}</em>
    if (token.type === 'strike') return <del key={key}>{token.text}</del>
    if (token.type === 'code') return <code key={key}>{token.text}</code>
    if (token.type === 'link') {
      return (
        <a key={key} href={token.href} target="_blank" rel="noreferrer">
          {token.text}
        </a>
      )
    }
    return <React.Fragment key={key}>{token.text}</React.Fragment>
  })
}

/** 保留行内换行（会话里的回答常靠单换行断行）。 */
function Lines({ text }) {
  return String(text ?? '')
    .split('\n')
    .map((line, index) => (
      <React.Fragment key={`l${index}`}>
        {index ? <br /> : null}
        <InlineLine text={line} />
      </React.Fragment>
    ))
}

function Block({ block, index }) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level <= 2 ? 'h3' : 'h4'
      const level = block.level <= 2 ? 'high' : 'low'
      return (
        <Tag className={`md-heading ${level}`} key={`b${index}`}>
          <Lines text={block.text} />
        </Tag>
      )
    }
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag className={`md-list ${block.ordered ? 'ordered' : 'bullet'}`} key={`b${index}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`li${itemIndex}`}>
              <Lines text={item} />
            </li>
          ))}
        </Tag>
      )
    }
    case 'quote':
      return (
        <blockquote className="md-quote" key={`b${index}`}>
          <Lines text={block.text} />
        </blockquote>
      )
    case 'code':
      return (
        <pre className="md-code" key={`b${index}`}>
          <code>{block.text}</code>
        </pre>
      )
    case 'hr':
      return <hr className="md-rule" key={`b${index}`} />
    case 'table': {
      const alignOf = column => block.align?.[column] || 'left'
      return (
        <div className="md-table-wrap" key={`b${index}`}>
          <table className="md-table">
            <thead>
              <tr>
                {block.header.map((cell, column) => (
                  <th key={`h${column}`} style={{ textAlign: alignOf(column) }}>
                    <InlineLine text={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`r${rowIndex}`}>
                  {row.map((cell, column) => (
                    <td key={`c${column}`} style={{ textAlign: alignOf(column) }}>
                      <InlineLine text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    case 'paragraph':
    default:
      return (
        <p className="md-para" key={`b${index}`}>
          <Lines text={block.text} />
        </p>
      )
  }
}

/** 会话 / 研究文档里统一的 Markdown 渲染。 */
export function Markdown({ text }) {
  const blocks = parseMarkdown(text)
  if (!blocks.length) return null
  return <div className="bc-body-text bc-md">{blocks.map((block, index) => <Block block={block} index={index} key={index} />)}</div>
}
