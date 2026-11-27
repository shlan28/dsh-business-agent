import React from 'react'
import { ChevronLeftIcon, CopyIcon, RefreshIcon } from './icons.jsx'
import { Chat } from './chat.jsx'
import { ResearchList, ResearchModal } from './research.jsx'
import { Plate, TYPE_LABELS, dateLabel, numberLabel, relativeTime, timeLabel } from './ui.jsx'

const KIND_LABELS = { wechat: '微信', meeting: '线下', call: '电话', email: '邮件', note: '备注' }

function Section({ title, children, aside }) {
  return (
    <div className="section">
      <div className="sec-head">
        <span className="mono">{title}</span>
        <span className="rule" />
        {aside}
      </div>
      {children}
    </div>
  )
}

export function Person({ contact, t, capabilities, onBack, onEdit, onToast, onNote, onResearch, onContactChanged }) {
  const [flipped, setFlipped] = React.useState(false)
  const [noteOpen, setNoteOpen] = React.useState(false)
  const [noteText, setNoteText] = React.useState('')
  const [noteKind, setNoteKind] = React.useState('note')
  const [busy, setBusy] = React.useState(false)
  const [savingNote, setSavingNote] = React.useState(false)
  const [researchDoc, setResearchDoc] = React.useState(null)

  React.useEffect(() => {
    setFlipped(false)
    setNoteOpen(false)
    setNoteText('')
    setNoteKind('note')
    setBusy(false)
    setResearchDoc(null)
  }, [contact.id])

  const copy = async value => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      onToast?.(t('已复制'))
    } catch {
      onToast?.(t('复制失败'))
    }
  }

  const runResearch = async () => {
    if (busy) return
    setBusy(true)
    try {
      await onResearch(contact.id)
    } finally {
      setBusy(false)
    }
  }

  const saveNote = async () => {
    const text = noteText.trim()
    if (!text) {
      onToast?.(t('说点什么再保存'))
      return
    }
    setSavingNote(true)
    try {
      await onNote({ id: contact.id, text, kind: noteKind })
      setNoteText('')
      setNoteOpen(false)
      onToast?.(t('已保存'))
    } finally {
      setSavingNote(false)
    }
  }

  const research = contact.research || { updatedAt: null, entries: [] }
  const researchDocs = Array.isArray(research.entries) ? research.entries : []
  const latestResearch = researchDocs[0] || null
  const researchStale = Boolean(
    latestResearch?.at && Date.now() - Date.parse(latestResearch.at) > 30 * 24 * 60 * 60 * 1000,
  )
  const timeline = contact.timeline || []
  const next = contact.nextStep

  return (
    <div className="bc-detail open" aria-hidden="false">
      <div className="dtop">
        <button className="back" onClick={onBack}>
          <ChevronLeftIcon />
          {t('返回全部')}
        </button>
        <span className="mono dim dcenter">
          {TYPE_LABELS[contact.type] || 'OTHER'} · {numberLabel(contact.no)} · {contact.city || '—'}
        </span>
        <div className="dactions">
          <button className="ghost" onClick={onEdit}>{t('编辑')}</button>
          <button className="ghost solid" onClick={runResearch} disabled={busy}>
            {busy ? t('正在研究') : `${t('研究此人')} ↗`}
          </button>
        </div>
      </div>

      <div className="dbody">
        <aside className="rail">
          <div
            className={`flip ${flipped ? 'flipped' : ''}`}
            role="button"
            tabIndex={0}
            title={flipped ? 'FLIP BACK' : 'FLIP TO DOSSIER'}
            onClick={() => setFlipped(value => !value)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setFlipped(value => !value)
              }
            }}
          >
            <div className="flip-inner">
              <div className="face front">
                <div className="face-top">
                  <span className="mono dim">BUSINESS CARD</span>
                  <span className="mono dim">{numberLabel(contact.no)}</span>
                </div>
                <Plate contact={contact} />
                <div className="face-info">
                  <div className="face-name">{contact.name}</div>
                  <div className="face-role">
                    {[contact.role, contact.company && contact.company !== '—' ? contact.company : ''].filter(Boolean).join(' · ') || '—'}
                  </div>
                  <div className="chips">
                    {(contact.tags || []).map(tag => <span className="chip" key={tag}>{tag}</span>)}
                  </div>
                  <div className="flip-hint">
                    <span className="mono dim">FLIP TO DOSSIER</span>
                    <span className="mono" style={{ color: 'var(--lav)' }}>↻</span>
                  </div>
                </div>
              </div>
              <div className="face back">
                <div className="back-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="mono">DOSSIER · {new Date().getFullYear()}</span>
                    <span className="mono">↗</span>
                  </div>
                  <div className="back-name">{contact.name}</div>
                  <div className="back-role">
                    {[contact.role, contact.company].filter(Boolean).join(' · ') || '—'}
                  </div>
                  <div className="facts">
                    <div className="fact">
                      <div className="k">LABELS</div>
                      <div className="v">{(contact.tags || []).join(' / ') || '—'}</div>
                    </div>
                    <div className="fact">
                      <div className="k">LAST TOUCH</div>
                      <div className="v">
                        {timeline[0] ? `${dateLabel(timeline[0].at)} · ${KIND_LABELS[timeline[0].kind] || '备注'} —— ${timeline[0].text}` : '—'}
                      </div>
                    </div>
                    <div className="fact">
                      <div className="k">NEXT STEP</div>
                      <div className="v">{next?.text ? `${next.at ? dateLabel(next.at) : '待定'} —— ${next.text}` : '—'}</div>
                    </div>
                  </div>
                  <div className="back-foot">
                    <span className="mono">
                      DSH RESEARCHED · {latestResearch?.at ? relativeTime(latestResearch.at) : '—'}
                    </span>
                    <span className="mono">↻ FRONT</span>
                  </div>
                  <div className="back-mark">{contact.name?.[0] || ''}</div>
                </div>
              </div>
            </div>
          </div>

          <Section title="CONTACT">
            <div className="rows">
              {[
                ['EMAIL', contact.contact?.email],
                ['WECHAT', contact.contact?.wechat],
                ['PHONE', contact.contact?.phone],
                ['CITY', contact.city],
              ].map(([key, value]) => (
                <div className="row" key={key} onClick={() => copy(value)} style={{ cursor: value ? 'pointer' : 'default' }}>
                  <span className="k">{key}</span>
                  <span className="v" title={value || ''}>
                    {value || '—'}
                    {value ? <span className="bc-copy"><CopyIcon /></span> : null}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="NEXT STEP">
            {next?.text ? (
              <div className="next-box">
                <span className="mono">{next.at ? `${dateLabel(next.at)} · ${timeLabel(next.at)}` : t('待定')}</span>
                <p>{next.text}</p>
              </div>
            ) : (
              <div className="next-box" style={{ borderLeftColor: 'var(--line)' }}>
                <span className="mono dim">{t('暂无下一步')}</span>
                <p style={{ color: 'var(--muted)' }}>在编辑里补一条，或者让 DSH 根据最近互动给一个。</p>
              </div>
            )}
          </Section>

          <Section
            title="RESEARCH"
            aside={
              <button className="mono bc-mini" onClick={runResearch} disabled={busy} style={{ background: 'none' }}>
                {busy ? t('正在研究') : `+ ${t('研究一轮')}`}
              </button>
            }
          >
            {researchDocs.length ? (
              <>
                <ResearchList docs={researchDocs} t={t} onOpen={setResearchDoc} />
                <div className="stamp">
                  {t('共')} {researchDocs.length} {t('份研究')} · {relativeTime(latestResearch.at)}
                </div>
                {researchStale ? (
                  <div className="stamp" style={{ color: '#9a4a41' }}>{t('资料可能已过期，建议再研究一轮')}</div>
                ) : null}
              </>
            ) : (
              <p className="bc-empty-research">
                {t('还没有研究')}。点右上角「研究此人 ↗」，DSH 会联网检索，并把结论、来源与日期存成一份文档。
              </p>
            )}
          </Section>

          <Section
            title="TIMELINE"
            aside={
              <button className="mono bc-mini" onClick={() => setNoteOpen(value => !value)}>
                {noteOpen ? t('收起') : `+ ${t('记一条')}`}
              </button>
            }
          >
            <div className="timeline">
              {timeline.length ? (
                timeline.map(entry => (
                  <div className="titem" key={entry.id || entry.at}>
                    <div className="when">
                      {dateLabel(entry.at)} · {KIND_LABELS[entry.kind] || '备注'}
                    </div>
                    <div className="what">{entry.text}</div>
                  </div>
                ))
              ) : (
                <div className="what" style={{ color: 'var(--muted)', fontSize: 11 }}>还没有记录。第一次聊天之后，从这里开始积累。</div>
              )}
            </div>

            {noteOpen ? (
              <div className="note-form">
                <textarea
                  value={noteText}
                  onChange={event => setNoteText(event.target.value)}
                  placeholder="今天聊了什么？下一步是什么？"
                  autoFocus
                />
                <div className="row-actions">
                  <select value={noteKind} onChange={event => setNoteKind(event.target.value)}>
                    <option value="note">备注</option>
                    <option value="wechat">微信</option>
                    <option value="meeting">线下</option>
                    <option value="call">电话</option>
                    <option value="email">邮件</option>
                  </select>
                  <span style={{ display: 'flex', gap: 8 }}>
                    <button className="mono" onClick={() => setNoteOpen(false)}>{t('取消')}</button>
                    <button className="mono" style={{ color: 'var(--lav)' }} onClick={saveNote} disabled={savingNote}>
                      {t('保存')}
                    </button>
                  </span>
                </div>
              </div>
            ) : null}
          </Section>
        </aside>

        <Chat
          contact={contact}
          t={t}
          capabilities={capabilities}
          onToast={onToast}
          onContactChanged={onContactChanged}
        />
      </div>

      {researchDoc ? <ResearchModal doc={researchDoc} t={t} onClose={() => setResearchDoc(null)} /> : null}
    </div>
  )
}
