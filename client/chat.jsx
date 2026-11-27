import React from 'react'
import { api } from './api.js'
import { ArrowIcon, SearchIcon } from './icons.jsx'
import { timeLabel } from './ui.jsx'

const SUGGESTIONS = ['写一条跟进微信', '查一下最近的动态', '整理成会前 brief']

function Inline({ text }) {
  const nodes = []
  const pattern = /\*\*([^*]+)\*\*|(https?:\/\/[^\s)）]+)/g
  let last = 0
  let match
  let index = 0
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    if (match[1]) {
      nodes.push(<strong key={`b${index}`}>{match[1]}</strong>)
    } else if (match[2]) {
      nodes.push(
        <a key={`a${index}`} href={match[2]} target="_blank" rel="noreferrer">
          {match[2]}
        </a>,
      )
    }
    last = match.index + match[0].length
    index += 1
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function Body({ text }) {
  return <div className="bc-body-text">{text.split('\n').map((line, i) => <React.Fragment key={i}>{i ? <br /> : null}{<Inline text={line} />}</React.Fragment>)}</div>
}

function Live({ running, hasSession, t }) {
  return (
    <span className="live">
      <i className={running ? 'pulse' : ''} />
      {running ? t('正在回复') : hasSession ? t('已连接') : t('就绪')}
    </span>
  )
}

export function Chat({ contact, t, capabilities, onToast, onContactChanged }) {
  const [entries, setEntries] = React.useState([])
  const [running, setRunning] = React.useState(false)
  const [sessionId, setSessionId] = React.useState(contact.sessionId || null)
  const [error, setError] = React.useState('')
  const [input, setInput] = React.useState('')
  const [sending, setSending] = React.useState(false)
  const afterRef = React.useRef(0)
  const boxRef = React.useRef(null)
  const aliveRef = React.useRef(true)
  const busyRef = React.useRef(false)
  const revisionRef = React.useRef(null)

  const load = React.useCallback(
    async (cursor = afterRef.current) => {
      if (busyRef.current) return
      busyRef.current = true
      try {
        const data = await api(`/chat/state?id=${encodeURIComponent(contact.id)}&after=${cursor}`)
        if (!aliveRef.current) return
        if (Array.isArray(data.entries) && data.entries.length) {
          setEntries(previous => {
            const seen = new Set(previous.map(entry => entry.seq))
            return [...previous, ...data.entries.filter(entry => !seen.has(entry.seq))]
          })
        }
        afterRef.current = Math.max(cursor, data.lastSeq || 0)
        setRunning(Boolean(data.running))
        setSessionId(data.sessionId || null)
        setError(data.error || '')
        if (revisionRef.current !== null && data.revision !== undefined && data.revision !== revisionRef.current) {
          onContactChanged?.()
        }
        if (data.revision !== undefined) revisionRef.current = data.revision
      } catch (err) {
        if (aliveRef.current) setError(err?.message || String(err))
      } finally {
        busyRef.current = false
      }
    },
    [contact.id, onContactChanged],
  )

  React.useEffect(() => {
    aliveRef.current = true
    afterRef.current = 0
    revisionRef.current = null
    setEntries([])
    setRunning(false)
    setError('')
    setInput('')
    setSending(false)
    setSessionId(contact.sessionId || null)
    void load(0)
    return () => {
      aliveRef.current = false
    }
  }, [contact.id]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') void load()
    }
    const timer = setInterval(tick, running ? 700 : 1500)
    return () => clearInterval(timer)
  }, [load, running])

  React.useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 220
    if (nearBottom) box.scrollTop = box.scrollHeight
  }, [entries.length, running])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    if (running) {
      onToast?.(t('DSH 正在回复，先等一下或点停止'))
      return
    }
    setSending(true)
    setError('')
    try {
      await api('/chat/send', { method: 'POST', body: { id: contact.id, text } })
      setInput('')
      await load()
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setSending(false)
    }
  }

  const stop = async () => {
    try {
      await api('/chat/stop', { method: 'POST', body: { id: contact.id } })
      setRunning(false)
      await load()
    } catch (err) {
      setError(err?.message || String(err))
    }
  }

  const pickSuggestion = value => {
    setInput(value)
    boxRef.current?.querySelector('textarea')?.focus()
  }

  const chatDisabled = !capabilities.chat

  return (
    <section className="chat">
      <div className="chat-head">
        <div className="l">
          <span className="chat-title">与 {contact.name} 的会话</span>
          <Live running={running} hasSession={Boolean(sessionId)} t={t} />
        </div>
        <span className="mono dim">DSH</span>
      </div>

      <div className="msgs" ref={boxRef}>
        {!entries.length && !running && !error ? (
          <div className="empty-chat">
            <div className="big">
              Ask DSH about <em>{contact.name}</em>.
            </div>
            <p>它会去查公开信息、记住你们的每一次互动，再把结论写回左边的档案。</p>
          </div>
        ) : null}

        {entries.map((entry, index) => {
          if (entry.role === 'user') {
            return (
              <div className="msg me" key={entry.seq}>
                {entry.text}
              </div>
            )
          }
          if (entry.role === 'assistant') {
            const showWho = index === 0 || entries[index - 1]?.role !== 'assistant'
            return (
              <div className="msg" key={entry.seq}>
                {showWho ? (
                  <div className="who">
                    <span className="mark">DSH</span>
                    <b>DEEPSEEK HARNESS</b>
                    <time>{timeLabel(entry.at)}</time>
                  </div>
                ) : null}
                <div className="body">
                  <Body text={entry.text} />
                </div>
              </div>
            )
          }
          if (entry.role === 'tool') {
            return (
              <div className="msg" key={entry.seq} style={{ maxWidth: 660 }}>
                <div className="tool">
                  <SearchIcon size={10} />
                  {entry.text}
                  {entry.name ? <span className="dim"> · {entry.name}</span> : null}
                </div>
              </div>
            )
          }
          if (entry.role === 'error') {
            return (
              <div className="msg error" key={entry.seq}>
                {entry.text}
              </div>
            )
          }
          return (
            <div className="msg system" key={entry.seq}>
              {entry.text}
            </div>
          )
        })}

        {running ? (
          <div className="msg">
            <div className="tool">
              <span className="bc-typing" aria-hidden="true"><i /><i /><i /></span>
              {t('正在回复')}…
            </div>
          </div>
        ) : null}

        {error ? <div className="msg error">{error}</div> : null}
      </div>

      <div className="composer">
        <div className="sugg">
          {SUGGESTIONS.map(value => (
            <button key={value} onClick={() => pickSuggestion(value)}>{t(value)}</button>
          ))}
        </div>
        {chatDisabled ? (
          <div className="box">
            <p className="bc-empty-research">{t('当前环境没有会话服务，暂时只能查看档案')}</p>
          </div>
        ) : (
          <div className="box">
            <textarea
              rows={2}
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder={`${t('问 DSH 关于')} ${contact.name} ${t('的事——它会去查，然后把结果写回这张卡…')}`}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent?.isComposing) {
                  event.preventDefault()
                  void send()
                }
              }}
            />
            <div className="box-foot">
              <span className="hint">ENTER 发送 · SHIFT + ENTER 换行</span>
              {running ? (
                <button className="send bc-stop" onClick={stop} aria-label={t('停止')}>
                  <span className="bc-square" />
                </button>
              ) : (
                <button className="send" onClick={send} disabled={sending || !input.trim()} aria-label={t('发送')}>
                  <ArrowIcon size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
