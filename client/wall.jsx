import React from 'react'
import { ArrowIcon, SearchIcon } from './icons.jsx'
import { Plate, TYPES, TYPE_LABELS, numberLabel, relativeTime } from './ui.jsx'

const FILTERS = [['all', 'ALL'], ['investor', 'INVESTORS'], ['partner', 'PARTNERS'], ['client', 'CLIENTS'], ['advisor', 'ADVISORS']]

function countsOf(contacts) {
  const counts = { all: contacts.length }
  for (const contact of contacts) counts[contact.type] = (counts[contact.type] || 0) + 1
  return counts
}

export function Wall({ contacts, loaded, error, t, onOpen, onNew, onRetry }) {
  const [filter, setFilter] = React.useState('all')
  const [query, setQuery] = React.useState('')
  const counts = countsOf(contacts)

  const list = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    return contacts.filter(contact => {
      if (filter !== 'all' && contact.type !== filter) return false
      if (!needle) return true
      return [contact.name, contact.nameEn, contact.company, contact.role, contact.city, ...(contact.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [contacts, filter, query])

  return (
    <div className="bc-wallview">
      <div className="page">
        <div className="brand" aria-label="Achoverse Business Agent">
          <span className="brand-mark" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.6l2.3 7.1 7.1 2.3-7.1 2.3L12 21.4l-2.3-7.1L2.6 12l7.1-2.3z" />
            </svg>
          </span>
          <span className="brand-name">Achoverse</span>
          <span className="brand-sep">/</span>
          <span className="brand-sub">Business Agent</span>
        </div>

        <header className="masthead">
          <h1>
            The people
            <span className="lav">behind the deal.</span>
          </h1>
          <div className="masthead-aside">
            <p>投资人、合伙人、客户、顾问——把每一段关系收进一张名片。点开任何一张，左边是档案，右边是 DSH；它会替你查、替你记、替你想下一步。</p>
          </div>
        </header>

        <div className="toolbar">
          <div className="tabs" role="tablist">
            {FILTERS.map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={filter === id}
                className="tab"
                onClick={() => setFilter(id)}
              >
                {label}
                <b>{counts[id] || 0}</b>
              </button>
            ))}
          </div>
          <div className="tools">
            <label className="search">
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={t('搜索姓名、公司或标签…')}
                autoComplete="off"
              />
            </label>
            <button className="new" onClick={onNew}>
              <span className="plus">+</span>
              {t('新增人脉')}
            </button>
          </div>
        </div>

        <main className="wall">
          {!loaded ? (
            <div className="bc-loading" aria-label={t('加载中')}>
              <div className="bc-skel" style={{ width: '38%' }} />
              <div className="bc-skel" style={{ width: '62%' }} />
              <div className="bc-skel" style={{ width: '24%' }} />
            </div>
          ) : error ? (
            <div className="empty">
              <p>{t('加载失败')}：{error}</p>
              <button className="mono" style={{ marginTop: 10, color: 'var(--lav)' }} onClick={onRetry}>
                {t('重试')}
              </button>
            </div>
          ) : !contacts.length ? (
            <div className="empty">
              <p>{t('还没有人')}。</p>
              <button className="new" style={{ margin: '16px auto 0' }} onClick={onNew}>
                <span className="plus">+</span>
                {t('加第一个')}
              </button>
            </div>
          ) : !list.length ? (
            <div className="empty">
              <p>{t('没有匹配的人')}。</p>
              <div className="mono" style={{ marginTop: 8 }}>{t('换个名字或标签')}</div>
            </div>
          ) : (
            <div className="grid">
              {list.map((contact, index) => (
                <div className="cell" key={contact.id} style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}>
                  <button
                    className="card"
                    style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
                    onClick={() => onOpen(contact.id)}
                    aria-label={`${contact.name} ${contact.role} ${contact.company}`}
                  >
                    <div className="card-top">
                      <span className="cat">{TYPE_LABELS[contact.type] || 'OTHER'}</span>
                      <span className="no">{numberLabel(contact.no)}</span>
                    </div>
                    <Plate contact={contact} />
                    <div className="card-body">
                      <div className="card-name">{contact.name}</div>
                      <div className="card-role">
                        {[contact.role, contact.company && contact.company !== '—' ? contact.company : ''].filter(Boolean).join(' · ') || ' '}
                      </div>
                      <div className="chips">
                        {(contact.tags || []).map(tag => (
                          <span className="chip" key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card-foot">
                      <span className="last">LAST · {relativeTime(contact.lastContactAt)}</span>
                      <span className="go"><ArrowIcon size={11} /></span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
