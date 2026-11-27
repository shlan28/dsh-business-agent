import React from 'react'
import { Body } from './chat.jsx'
import { dateLabel, siteOf, timeLabel } from './ui.jsx'

/** 左栏的研究文档列表：一行 = 一次检索。 */
export function ResearchList({ docs, t, onOpen }) {
  return (
    <div className="bc-docs">
      {docs.map(doc => (
        <button className="bc-doc-row" key={doc.id} onClick={() => onOpen(doc)} title={doc.title}>
          <span className="when mono">{dateLabel(doc.at)}</span>
          <span className="tt">{doc.title}</span>
          <span className="meta mono">
            {doc.sources?.length || 0} {t('来源')}
          </span>
        </button>
      ))}
    </div>
  )
}

/** 点开一份研究文档：全文 + 来源 + 检索日期。 */
export function ResearchModal({ doc, t, onClose }) {
  const [copied, setCopied] = React.useState(false)
  const sources = doc.sources || []

  React.useEffect(() => {
    const onKey = event => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const copy = async () => {
    try {
      const lines = [doc.title, '', doc.summary]
      if (sources.length) {
        lines.push('', '来源：')
        for (const source of sources) lines.push(`- ${source.title || source.site}: ${source.url}`)
      }
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // 剪贴板不可用时保持按钮原状。
    }
  }

  return (
    <div
      className="bc-editor-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="bc-editor bc-doc" role="dialog" aria-modal="true" aria-label={doc.title}>
        <div className="bc-editor-head">
          <div>
            <div className="mono dim">
              RESEARCH · {dateLabel(doc.at)} {timeLabel(doc.at)}
            </div>
            <div className="bc-editor-title">{doc.title}</div>
          </div>
          <button className="bc-editor-close" onClick={onClose} aria-label={t('收起')}>×</button>
        </div>

        {doc.focus ? <div className="bc-doc-focus mono">FOCUS · {doc.focus}</div> : null}

        <div className="bc-doc-body">
          <Body text={doc.summary} />
        </div>

        <div className="bc-doc-sources">
          <div className="bc-doc-src-head mono dim">SOURCES · {sources.length}</div>
          {sources.length ? (
            <div className="srclist">
              {sources.map(source => (
                <a className="srccard" key={source.url} href={source.url} target="_blank" rel="noreferrer" title={source.title}>
                  <span className="dom">{source.site || siteOf(source.url)}</span>
                  <span className="tt">{source.title}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="bc-empty-research">{t('这份记录没有来源')}</p>
          )}
        </div>

        <div className="bc-editor-foot">
          <span className="bc-editor-hint">
            {t('检索于')} {dateLabel(doc.at)} {timeLabel(doc.at)}
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="bc-btn" onClick={copy}>{copied ? t('已复制') : t('复制正文')}</button>
            <button className="bc-btn primary" onClick={onClose}>{t('关闭')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
