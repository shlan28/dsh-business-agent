import React from 'react'
import { api } from './api.js'
import { Body } from './chat.jsx'
import { humanizeError } from './errors.js'
import { ArrowIcon, ChevronLeftIcon } from './icons.jsx'
import { ACCENTS, dateLabel, initialOf, relativeTime, timeLabel } from './ui.jsx'

export const NEED_LABELS = {
  funding: '资金',
  clients: '客户',
  partners: '伙伴',
  hiring: '招人',
  info: '信息',
  other: '其他',
}

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

function MePlate({ me }) {
  const identity = me.identity || {}
  return (
    <div className="plate" style={{ background: ACCENTS.blue }}>
      <span className="seal" style={{ borderColor: 'rgba(20,20,20,.22)' }}>
        <span>{initialOf(identity.name)}</span>
        <em>{identity.nameEn ? identity.nameEn.toUpperCase() : ''}</em>
      </span>
      <span className="where">{[identity.stage, identity.city].filter(Boolean).join(' · ')}</span>
    </div>
  )
}

/** 我的名片：左边是卡与档案，右边是一段专门用来「让 DSH 问我」的会话。 */
export function MyCard({ me, questions, t, onBack, onToast, onMeChanged, onRefresh }) {
  const [flipped, setFlipped] = React.useState(false)
  const identity = me.identity || {}
  const needs = me.needs || []
  const offers = me.offers || []
  const goals = me.goals || []
  const prefs = me.preferences || {}
  const redLines = prefs.redLines || []
  const sources = me.sources || []
  const pending = questions || []

  const clear = async () => {
    if (!window.confirm(t('清空我的档案确认'))) return
    try {
      await api('/op', { method: 'POST', body: { action: 'meReset' } })
      onToast?.(t('已清空'))
      onMeChanged?.()
    } catch (error) {
      onToast?.(error?.message || String(error), { error: true })
    }
  }

  return (
    <div className="bc-detail open" aria-hidden="false">
      <div className="dtop">
        <button className="back" onClick={onBack}>
          <ChevronLeftIcon />
          {t('返回全部')}
        </button>
        <span className="mono dim dcenter">
          MY CARD · {identity.stage || t('待定')} · {identity.city || '—'}
        </span>
        <div className="dactions">
          <span className="mono dim">{pending.length ? `${pending.length} ${t('个问题还没答')}` : t('档案已齐')}</span>
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
                  <span className="mono dim">ME</span>
                </div>
                <MePlate me={me} />
                <div className="face-info">
                  <div className="face-name">{identity.name || t('还没有档案')}</div>
                  <div className="face-role">
                    {[identity.title, identity.company].filter(Boolean).join(' · ') || identity.oneLiner || '—'}
                  </div>
                  <div className="chips">
                    {[identity.stage, identity.city].filter(Boolean).map(tag => <span className="chip" key={tag}>{tag}</span>)}
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
                    <span className="mono">DOSSIER · ME</span>
                    <span className="mono">↗</span>
                  </div>
                  <div className="back-name">{identity.name || '—'}</div>
                  <div className="back-role">{identity.oneLiner || '—'}</div>
                  <div className="facts">
                    <div className="fact">
                      <div className="k">GOALS</div>
                      <div className="v">{goals[0]?.text || '—'}</div>
                    </div>
                    <div className="fact">
                      <div className="k">I NEED</div>
                      <div className="v">{needs[0] ? `${NEED_LABELS[needs[0].kind] || '其他'} · ${needs[0].text}` : '—'}</div>
                    </div>
                    <div className="fact">
                      <div className="k">I OFFER</div>
                      <div className="v">{offers[0]?.text || '—'}</div>
                    </div>
                  </div>
                  <div className="back-foot">
                    <span className="mono">UPDATED · {me.updatedAt ? relativeTime(me.updatedAt) : '—'}</span>
                    <span className="mono">↻ FRONT</span>
                  </div>
                  <div className="back-mark">{identity.name?.[0] || '我'}</div>
                </div>
              </div>
            </div>
          </div>

          <Section title="WHO I AM">
            <div className="rows">
              {[
                ['NAME', identity.name],
                ['EN', identity.nameEn],
                ['ROLE', identity.title],
                ['COMPANY', identity.company],
                ['STAGE', identity.stage],
                ['CITY', identity.city],
                ['ONE LINE', identity.oneLiner],
              ].map(([key, value]) => (
                <div className="row" key={key}>
                  <span className="k">{key}</span>
                  <span className={`v ${key === 'ONE LINE' ? 'wide' : ''}`} title={value || ''}>{value || '—'}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="WHAT I NEED" aside={<span className="mono dim">{needs.length}</span>}>
            {needs.length ? (
              <div className="timeline">
                {needs.map(item => (
                  <div className="titem" key={item.id}>
                    <div className="when">
                      {NEED_LABELS[item.kind] || '其他'}
                      {item.dueAt ? ` · ${dateLabel(item.dueAt)}` : ''}
                    </div>
                    <div className="what">{item.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="bc-empty-research">{t('还没有写现在最需要什么')}</p>
            )}
          </Section>

          <Section title="WHAT I OFFER" aside={<span className="mono dim">{offers.length}</span>}>
            {offers.length ? (
              <div className="timeline">
                {offers.map(item => (
                  <div className="titem" key={item.id}>
                    <div className="what">{item.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="bc-empty-research">{t('还没有写能给别人的价值')}</p>
            )}
          </Section>

          <Section title="GOALS" aside={<span className="mono dim">{goals.length}</span>}>
            {goals.length ? (
              <div className="timeline">
                {goals.map(item => (
                  <div className="titem" key={item.id}>
                    <div className="what">{item.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="bc-empty-research">{t('还没有写今年的目标')}</p>
            )}
          </Section>

          <Section title="HOW TO TALK TO ME">
            <div className="rows">
              {[
                ['TONE', prefs.tone],
                ['CHANNEL', prefs.channel],
                ['CADENCE', prefs.cadence],
                ['RED LINES', redLines.join(' / ')],
              ].map(([key, value]) => (
                <div className="row" key={key}>
                  <span className="k">{key}</span>
                  <span className="v wide" title={value || ''}>{value || '—'}</span>
                </div>
              ))}
            </div>
            <div className="me-src-foot">
              <span className="mono dim">
                {t('更新于')} {me.updatedAt ? relativeTime(me.updatedAt) : '—'} · {sources.length} {t('条来源')}
              </span>
              <button className="mono dim me-clear" onClick={clear}>{t('清空我的档案')}</button>
            </div>
          </Section>
        </aside>

        <MeChat
          me={me}
          questions={pending}
          t={t}
          onToast={onToast}
          onMeChanged={onMeChanged}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  )
}

function MeChat({ me, questions, t, onToast, onMeChanged, onRefresh }) {
  const [entries, setEntries] = React.useState([])
  const [running, setRunning] = React.useState(false)
  const [error, setError] = React.useState('')
  const [input, setInput] = React.useState('')
  const [sending, setSending] = React.useState(false)
  const [pendingQuestion, setPendingQuestion] = React.useState(null)
  const boxRef = React.useRef(null)
  const textRef = React.useRef(null)
  const aliveRef = React.useRef(true)
  const startedRef = React.useRef(false)
  const revisionRef = React.useRef(null)
  const questionsRef = React.useRef(questions)
  questionsRef.current = questions

  const load = React.useCallback(async () => {
    try {
      const data = await api('/me/chat/state?after=0')
      if (!aliveRef.current) return
      setEntries(Array.isArray(data.entries) ? data.entries : [])
      setRunning(Boolean(data.running))
      setError(data.error || '')
      if (revisionRef.current !== null && data.revision !== revisionRef.current) {
        onRefresh?.()
      }
      if (data.revision !== undefined) revisionRef.current = data.revision
    } catch (err) {
      if (!aliveRef.current) return
      setError(err?.message || String(err))
    }
  }, [onRefresh])

  React.useEffect(() => {
    aliveRef.current = true
    void load()
    return () => {
      aliveRef.current = false
    }
  }, [load])

  React.useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') void load()
    }
    const timer = setInterval(tick, running ? 1200 : 4000)
    return () => clearInterval(timer)
  }, [load, running])

  // 第一次进来且还没答过：让 DSH 主动开口问第一个问题。
  React.useEffect(() => {
    if (startedRef.current) return
    if (entries.length || !questionsRef.current.length) return
    startedRef.current = true
    void (async () => {
      try {
        await api('/me/chat/start', { method: 'POST' })
        await load()
      } catch (err) {
        setError(err?.message || String(err))
      }
    })()
  }, [entries.length, load])

  React.useEffect(() => {
    const box = boxRef.current
    if (!box) return
    box.scrollTop = box.scrollHeight
  }, [entries.length, running])

  React.useEffect(() => {
    if (pendingQuestion) textRef.current?.focus()
  }, [pendingQuestion])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setError('')
    const payload = pendingQuestion ? `关于「${pendingQuestion.question}」：${text}` : text
    try {
      await api('/me/chat/send', { method: 'POST', body: { text: payload } })
      setInput('')
      setPendingQuestion(null)
      await load()
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setSending(false)
    }
  }

  const pickQuestion = question => {
    setPendingQuestion(question)
    onToast?.(t('直接说答案就行'))
  }

  const status = running ? t('正在问我') : entries.length ? t('已连接') : t('准备开始')

  return (
    <section className="chat me-chat">
      <div className="chat-head">
        <div className="l">
          <span className="chat-title">{t('补全我的档案')}</span>
          <span className="live">
            <i className={running ? 'pulse' : ''} />
            {status}
          </span>
        </div>
        <span className="mono dim">DSH</span>
      </div>

      <div className="msgs" ref={boxRef}>
        {!entries.length && !running ? (
          <div className="empty-chat">
            <div className="big">
              Before the people, <em>you</em>.
            </div>
            <p>{t('DSH 会一个问题一个问题地问你')}，答案只存本机；答过的不会再问，跳过也没关系。</p>
          </div>
        ) : null}

        {entries.map(entry => {
          if (entry.role === 'user') {
            return (
              <div className="msg me" key={entry.seq}>
                {entry.text}
              </div>
            )
          }
          if (entry.role === 'assistant') {
            return (
              <div className="msg" key={entry.seq}>
                <div className="who">
                  <span className="mark">DSH</span>
                  <b>DEEPSEEK HARNESS</b>
                  <time>{timeLabel(entry.at)}</time>
                </div>
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
                  <span>{entry.text}</span>
                  {entry.name ? <span className="dim"> · {entry.name}</span> : null}
                </div>
              </div>
            )
          }
          if (entry.role === 'error') {
            const failure = humanizeError(entry.text)
            return (
              <div className="msg error" key={entry.seq}>
                {failure.message}
                {failure.detail ? <div className="bc-err-detail mono">{failure.detail}</div> : null}
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

        {error ? (() => {
          const failure = humanizeError(error)
          return (
            <div className="msg error">
              {failure.message}
              {failure.detail ? <div className="bc-err-detail mono">{failure.detail}</div> : null}
            </div>
          )
        })() : null}
      </div>

      <div className="composer">
        {questions.length ? (
          <div className="me-questions">
            <span className="mono dim">{t('还没答的问题')}</span>
            <div className="me-qs">
              {questions.map(question => (
                <button
                  key={question.key}
                  className={`me-q ${pendingQuestion?.key === question.key ? 'active' : ''}`}
                  onClick={() => pickQuestion(question)}
                >
                  {question.question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="me-questions">
            <span className="mono dim">{t('清单已经答完')} · {t('想到什么随时补一句')}</span>
          </div>
        )}

        <div className="box">
          {pendingQuestion ? (
            <div className="me-pending mono">
              {t('正在回答')}：{pendingQuestion.question}
              <button className="mono dim" onClick={() => setPendingQuestion(null)}>{t('取消')}</button>
            </div>
          ) : null}
          <textarea
            ref={textRef}
            rows={2}
            value={input}
            onChange={event => setInput(event.target.value)}
            placeholder={pendingQuestion ? t('直接说答案，DSH 会记进档案') : t('说点什么，或点上面的问题回答…')}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent?.isComposing) {
                event.preventDefault()
                void send()
              }
            }}
          />
          <div className="box-foot">
            <span className="hint">ENTER 发送 · SHIFT + ENTER 换行</span>
            <button className="send" onClick={send} disabled={sending || !input.trim()} aria-label={t('发送')}>
              <ArrowIcon size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
