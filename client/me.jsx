import React from 'react'
import { ChevronLeftIcon } from './icons.jsx'
import { ACCENTS, dateLabel, initialOf, relativeTime, timeLabel } from './ui.jsx'

export const NEED_LABELS = {
  funding: '资金',
  clients: '客户',
  partners: '伙伴',
  hiring: '招人',
  info: '信息',
  other: '其他',
}

const NEED_PREFIX = { 资金: 'funding', 客户: 'clients', 伙伴: 'partners', 招人: 'hiring', 信息: 'info' }

const linesOf = list => (Array.isArray(list) ? list : []).map(item => item.text || '').filter(Boolean).join('\n')

const splitLines = value =>
  String(value || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

function parseNeeds(value) {
  return splitLines(value).map(line => {
    const match = line.match(/^(资金|客户|伙伴|招人|信息)[:：]\s*(.+)$/)
    return match ? { kind: NEED_PREFIX[match[1]], text: match[2] } : { kind: 'other', text: line }
  })
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

/** 我的名片：和联系人详情同构——左边是卡与档案，右边说明它怎么被用、以及信息来源。 */
export function MyCard({ me, t, onBack, onEdit, onStart }) {
  const [flipped, setFlipped] = React.useState(false)
  const identity = me.identity || {}
  const needs = me.needs || []
  const offers = me.offers || []
  const goals = me.goals || []
  const prefs = me.preferences || {}
  const redLines = prefs.redLines || []
  const sources = me.sources || []
  const hasAny = Boolean(identity.name || identity.oneLiner || needs.length || goals.length || offers.length)

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
          <button className="ghost solid" onClick={onEdit}>{t('编辑我的名片')}</button>
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
          </Section>
        </aside>

        <section className="chat me-side">
          <div className="chat-head">
            <div className="l">
              <span className="chat-title">{t('我的档案')}</span>
              <span className="live">
                <i />
                {t('仅本机')}
              </span>
            </div>
            <span className="mono dim">DSH</span>
          </div>

          <div className="me-panel">
            {hasAny ? (
              <>
                <p className="me-lead">
                  {t('这段档案会拼在每次建议前面')} —— DSH 先看「我是谁、要什么、能给什么」，再看对方是谁，然后才给结论。
                </p>
                <div className="me-tips">
                  <div className="me-tip"><b>1</b><span>{t('研究从我的目标出发')}：只留下和我的需求相关的信息。</span></div>
                  <div className="me-tip"><b>2</b><span>{t('建议要落到三块')}：我能给对方什么 / 对方能帮我什么 / 下一步做什么。</span></div>
                  <div className="me-tip"><b>3</b><span>{t('信息不全时先问')}：DSH 会先问我，而不是替我编。</span></div>
                </div>

                <div className="section" style={{ marginTop: 28 }}>
                  <div className="sec-head">
                    <span className="mono">HOW THIS GOT HERE</span>
                    <span className="rule" />
                    <span className="mono dim">{sources.length}</span>
                  </div>
                  {sources.length ? (
                    <div className="timeline">
                      {sources.slice(0, 8).map((source, index) => (
                        <div className="titem" key={`${source.at}-${index}`}>
                          <div className="when">
                            {dateLabel(source.at)} {timeLabel(source.at)} · {source.kind === 'chat' ? t('来自对话') : source.kind === 'form' ? t('手填') : source.kind}
                          </div>
                          <div className="what">{source.note}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="bc-empty-research">{t('还没有记录来源')}</p>
                  )}
                </div>
              </>
            ) : (
              <div className="me-empty">
                <div className="big">Before the people, <em>you</em>.</div>
                <p>{t('先说说你自己，建议才有依据')}：你在做什么、今年要什么、现在缺什么、能给别人什么、说话上有哪些忌讳。</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="bc-btn primary" onClick={onStart}>{t('开始填写')}</button>
                  <button className="bc-btn" onClick={onEdit}>{t('直接编辑')}</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

const EMPTY_DRAFT = {
  name: '',
  nameEn: '',
  title: '',
  company: '',
  city: '',
  stage: '',
  oneLiner: '',
  goals: '',
  needs: '',
  offers: '',
  tone: '',
  channel: '',
  cadence: '',
  redLines: '',
}

function draftOf(me) {
  const identity = me?.identity || {}
  const prefs = me?.preferences || {}
  return {
    name: identity.name || '',
    nameEn: identity.nameEn || '',
    title: identity.title || '',
    company: identity.company || '',
    city: identity.city || '',
    stage: identity.stage || '',
    oneLiner: identity.oneLiner || '',
    goals: linesOf(me?.goals),
    needs: (me?.needs || []).map(item => `${NEED_LABELS[item.kind] || '其他'}：${item.text}`).join('\n'),
    offers: linesOf(me?.offers),
    tone: prefs.tone || '',
    channel: prefs.channel || '',
    cadence: prefs.cadence || '',
    redLines: (prefs.redLines || []).join('\n'),
  }
}

export function mePatchFromDraft(draft) {
  return {
    identity: {
      name: draft.name,
      nameEn: draft.nameEn,
      title: draft.title,
      company: draft.company,
      city: draft.city,
      stage: draft.stage,
      oneLiner: draft.oneLiner,
    },
    goals: splitLines(draft.goals).map(text => ({ text })),
    needs: parseNeeds(draft.needs),
    offers: splitLines(draft.offers).map(text => ({ text })),
    preferences: {
      tone: draft.tone,
      channel: draft.channel,
      cadence: draft.cadence,
      redLines: splitLines(draft.redLines),
    },
  }
}

/** 编辑弹层：与名片编辑器同一套外壳。 */
export function MeEditor({ me, t, onSave, onClear, onClose }) {
  const [draft, setDraft] = React.useState(() => draftOf(me))
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')
  const update = patch => setDraft(current => ({ ...current, ...patch }))

  const submit = async () => {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await onSave(mePatchFromDraft(draft))
      onClose()
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  const clear = async () => {
    if (!window.confirm(t('清空我的档案确认'))) return
    setBusy(true)
    try {
      await onClear()
      onClose()
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="bc-editor-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="bc-editor" role="dialog" aria-modal="true" aria-label={t('编辑我的名片')}>
        <div className="bc-editor-head">
          <div>
            <div className="mono dim">MY CARD</div>
            <div className="bc-editor-title">{t('编辑我的名片')}</div>
          </div>
          <button className="bc-editor-close" onClick={onClose} aria-label={t('收起')}>×</button>
        </div>

        <div className="bc-form">
          <label className="bc-field">
            <span>{t('姓名')}</span>
            <input value={draft.name} onChange={event => update({ name: event.target.value })} autoFocus />
          </label>
          <label className="bc-field">
            <span>{t('英文名')}</span>
            <input value={draft.nameEn} onChange={event => update({ nameEn: event.target.value })} />
          </label>
          <label className="bc-field">
            <span>{t('角色')}</span>
            <input value={draft.title} onChange={event => update({ title: event.target.value })} />
          </label>
          <label className="bc-field">
            <span>{t('公司')}</span>
            <input value={draft.company} onChange={event => update({ company: event.target.value })} />
          </label>
          <label className="bc-field">
            <span>{t('阶段')}</span>
            <input value={draft.stage} onChange={event => update({ stage: event.target.value })} placeholder="种子轮 / A 轮 / 已盈利" />
          </label>
          <label className="bc-field">
            <span>{t('城市')}</span>
            <input value={draft.city} onChange={event => update({ city: event.target.value })} />
          </label>
          <label className="bc-field wide">
            <span>{t('一句话说清你在做什么')}</span>
            <input value={draft.oneLiner} onChange={event => update({ oneLiner: event.target.value })} placeholder="做 AI 原生的社区与开发工具" />
          </label>
          <label className="bc-field wide">
            <span>{t('今年目标')} · {t('每行一条')}</span>
            <textarea value={draft.goals} onChange={event => update({ goals: event.target.value })} placeholder={'跑通 3 个标杆客户的付费'} />
          </label>
          <label className="bc-field wide">
            <span>{t('现在最需要什么')} · {t('每行一条，可用「资金：」「客户：」「伙伴：」「招人：」「信息：」开头')}</span>
            <textarea value={draft.needs} onChange={event => update({ needs: event.target.value })} placeholder={'资金：Q1 前融完 500 万种子轮\n招人：懂社区运营的合伙人'} />
          </label>
          <label className="bc-field wide">
            <span>{t('我能给别人的价值')} · {t('每行一条')}</span>
            <textarea value={draft.offers} onChange={event => update({ offers: event.target.value })} placeholder={'帮人看 AI 产品的技术选型'} />
          </label>
          <label className="bc-field">
            <span>{t('沟通风格')}</span>
            <input value={draft.tone} onChange={event => update({ tone: event.target.value })} placeholder="直接、少寒暄" />
          </label>
          <label className="bc-field">
            <span>{t('首选渠道')}</span>
            <input value={draft.channel} onChange={event => update({ channel: event.target.value })} placeholder="微信优先" />
          </label>
          <label className="bc-field">
            <span>{t('维护节奏')}</span>
            <input value={draft.cadence} onChange={event => update({ cadence: event.target.value })} placeholder="重要的人 3 周一次" />
          </label>
          <label className="bc-field wide">
            <span>{t('忌讳')} · {t('每行一条')}</span>
            <textarea value={draft.redLines} onChange={event => update({ redLines: event.target.value })} placeholder={'周末不发工作消息'} />
          </label>
        </div>

        {error ? <div className="bc-editor-error">{error}</div> : null}

        <div className="bc-editor-foot">
          <div>
            <button className="bc-btn danger" onClick={clear} disabled={busy}>{t('清空我的档案')}</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="bc-editor-hint">{t('只保存在本机')}</span>
            <button className="bc-btn" onClick={onClose}>{t('取消')}</button>
            <button className="bc-btn primary" onClick={submit} disabled={busy}>{busy ? '…' : t('保存')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const GUIDE_FIELDS = [
  ['name', '你叫什么'],
  ['oneLiner', '一句话：你在做什么'],
  ['goals', '今年最重要的一件事'],
  ['needs', '现在最需要什么（资金 / 客户 / 伙伴 / 招人 / 信息）'],
  ['offers', '你能给别人什么价值'],
  ['redLines', '沟通上有什么忌讳（可空）'],
]

/** 首次引导：6 个问题一次填完，直接生成可用的最小档案。 */
export function MeGuide({ t, onSave, onSkip }) {
  const [draft, setDraft] = React.useState({ name: '', oneLiner: '', goals: '', needs: '', offers: '', redLines: '' })
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')

  const submit = async () => {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await onSave(
        mePatchFromDraft({
          ...EMPTY_DRAFT,
          name: draft.name,
          oneLiner: draft.oneLiner,
          goals: draft.goals,
          needs: draft.needs,
          offers: draft.offers,
          redLines: draft.redLines,
        }),
      )
    } catch (err) {
      setError(err?.message || String(err))
      setBusy(false)
    }
  }

  return (
    <div
      className="bc-editor-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onSkip()
      }}
    >
      <div className="bc-editor bc-guide" role="dialog" aria-modal="true" aria-label={t('说说你自己')}>
        <div className="bc-editor-head">
          <div>
            <div className="mono dim">BEFORE THE PEOPLE</div>
            <div className="bc-editor-title">{t('先说说你自己')}</div>
          </div>
          <button className="bc-editor-close" onClick={onSkip} aria-label={t('稍后再说')}>×</button>
        </div>
        <p className="bc-compose-lead">
          {t('建议质量取决于我对你的了解')}。这 6 个问题大概 30 秒，答案只存在本机；以后可以随时在「我的名片」里改。
        </p>
        <div className="bc-form">
          {GUIDE_FIELDS.map(([key, label]) => (
            <label className={`bc-field ${key === 'name' ? '' : 'wide'}`} key={key}>
              <span>{label}</span>
              {key === 'name' ? (
                <input value={draft[key]} onChange={event => setDraft({ ...draft, [key]: event.target.value })} autoFocus />
              ) : (
                <input
                  value={draft[key]}
                  onChange={event => setDraft({ ...draft, [key]: event.target.value })}
                  placeholder={
                    key === 'oneLiner' ? '做 AI 原生的社区与开发工具'
                      : key === 'goals' ? '跑通 3 个标杆客户的付费'
                        : key === 'needs' ? '资金：Q1 前融完 500 万种子轮'
                          : key === 'offers' ? '帮人看 AI 产品的技术选型'
                            : '周末不发工作消息'
                  }
                />
              )}
            </label>
          ))}
        </div>
        {error ? <div className="bc-editor-error">{error}</div> : null}
        <div className="bc-editor-foot">
          <button className="bc-btn" onClick={onSkip}>{t('稍后再说')}</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="bc-editor-hint">{t('只保存在本机')}</span>
            <button className="bc-btn primary" onClick={submit} disabled={busy}>{busy ? '…' : t('保存')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
