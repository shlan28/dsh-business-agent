import React from 'react'
import { api } from './api.js'

const EXAMPLES = [
  { label: '周牧 · 观夏', text: '周牧，观夏创始人，客户，标签 品牌 / DTC' },
  { label: '林晚 · 高瓴', text: '林晚，高瓴创投投资总监，投资人，关注消费和出海' },
  { label: '陈可为 · Notion', text: '陈可为，Notion 中国增长 VP，合作伙伴，微信 chenkw' },
]

export function Composer({ t, onClose, onCreated, onFallback }) {
  const [text, setText] = React.useState('')
  const [composeId, setComposeId] = React.useState('')
  const [status, setStatus] = React.useState('idle')
  const [reply, setReply] = React.useState('')
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const inputRef = React.useRef(null)
  const doneRef = React.useRef(false)

  React.useEffect(() => {
    inputRef.current?.focus()
    const onKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        void submit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const finish = React.useCallback(
    id => {
      if (!id || doneRef.current) return
      doneRef.current = true
      onCreated(id)
    },
    [onCreated],
  )

  React.useEffect(() => {
    if (!composeId || doneRef.current) return undefined
    let alive = true
    const tick = async () => {
      try {
        const data = await api(`/compose/state?id=${encodeURIComponent(composeId)}`)
        if (!alive) return
        setStatus(data.status || 'pending')
        setReply(data.reply || '')
        if (data.error) setError(data.error)
        if (data.status === 'done') finish(data.contactId)
      } catch (err) {
        if (alive) setError(err?.message || String(err))
      }
    }
    void tick()
    const timer = setInterval(tick, 700)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [composeId, finish])

  const submit = async () => {
    const value = text.trim()
    if (!value || busy) return
    setBusy(true)
    setError('')
    try {
      const data = await api('/compose', {
        method: 'POST',
        body: { id: composeId || undefined, text: value },
      })
      setComposeId(data.id)
      setStatus(data.status || 'pending')
      setReply(data.reply || '')
      setText('')
      if (data.status === 'done') finish(data.contactId)
      inputRef.current?.focus()
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  const pending = status === 'pending'
  const done = status === 'done'

  return (
    <div
      className="bc-editor-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="bc-editor bc-compose" role="dialog" aria-modal="true" aria-label={t('新增人脉')}>
        <div className="bc-editor-head">
          <div>
            <div className="mono dim">NEW PERSON</div>
            <div className="bc-editor-title">{t('一句话新建人脉')}</div>
          </div>
          <button className="bc-editor-close" onClick={onClose} aria-label={t('收起')}>×</button>
        </div>

        <p className="bc-compose-lead">{t('用一句话说清这个人是谁，DSH 会把它整理成一张名片。')}</p>

        <textarea
          ref={inputRef}
          className="bc-compose-input"
          rows={3}
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder={t('例如：周牧，观夏创始人，客户，标签 品牌 / DTC')}
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent?.isComposing) {
              event.preventDefault()
              void submit()
            }
          }}
        />

        <div className="bc-compose-examples">
          {EXAMPLES.map(example => (
            <button key={example.label} onClick={() => setText(example.text)}>{example.label}</button>
          ))}
        </div>

        {reply || pending || error ? (
          <div className={`bc-compose-status ${error ? 'error' : ''}`}>
            {pending && !reply && !error ? (
              <span className="bc-spinner" aria-hidden="true"><i /><i /><i /></span>
            ) : null}
            {error ? <span>{error}</span> : reply ? <span className="bc-compose-reply"><b>DSH</b>{reply}</span> : <span>{t('DSH 正在建档…')}</span>}
          </div>
        ) : null}

        {done ? <div className="bc-compose-status">✓ {t('建好了，正在打开…')}</div> : null}

        <div className="bc-editor-foot">
          <div>
            <button className="bc-editor-hint bc-link" type="button" onClick={onFallback}>
              {t('改用表单')}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="bc-editor-hint">Enter 发送 · Esc 关闭</span>
            <button className="bc-btn" onClick={onClose}>{t('取消')}</button>
            <button className="bc-btn primary" onClick={submit} disabled={busy || !text.trim()}>
              {pending ? t('继续补充') : t('交给 DSH')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
