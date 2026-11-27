import React from 'react'
import { ACCENTS, ACCENT_KEYS, isoFromLocal, localInputValue } from './ui.jsx'

function blankDraft() {
  return {
    name: '',
    nameEn: '',
    type: 'other',
    role: '',
    company: '',
    city: '',
    tags: '',
    email: '',
    wechat: '',
    phone: '',
    notes: '',
    nextText: '',
    nextAt: '',
    accent: 'orchid',
  }
}

function draftOf(contact) {
  if (!contact) return blankDraft()
  return {
    name: contact.name || '',
    nameEn: contact.nameEn || '',
    type: contact.type || 'other',
    role: contact.role || '',
    company: contact.company || '',
    city: contact.city || '',
    tags: (contact.tags || []).join(', '),
    email: contact.contact?.email || '',
    wechat: contact.contact?.wechat || '',
    phone: contact.contact?.phone || '',
    notes: contact.notes || '',
    nextText: contact.nextStep?.text || '',
    nextAt: localInputValue(contact.nextStep?.at),
    accent: contact.accent || 'orchid',
  }
}

export function Editor({ contact, types = [], t, onSave, onDelete, onClose, onManageTypes }) {
  const [draft, setDraft] = React.useState(() => draftOf(contact))
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  const update = patch => setDraft(current => ({ ...current, ...patch }))

  const submit = async () => {
    if (busy) return
    if (!draft.name.trim()) {
      setError(`${t('姓名')}${t('不能为空')}`)
      return
    }
    setBusy(true)
    setError('')
    try {
      await onSave({
        id: contact?.id,
        name: draft.name,
        nameEn: draft.nameEn,
        type: draft.type,
        role: draft.role,
        company: draft.company,
        city: draft.city,
        accent: draft.accent,
        tags: draft.tags
          .split(/[,，、]/)
          .map(value => value.trim())
          .filter(Boolean),
        contact: { email: draft.email, wechat: draft.wechat, phone: draft.phone },
        notes: draft.notes,
        nextStep: draft.nextText.trim() ? { text: draft.nextText, at: isoFromLocal(draft.nextAt) } : null,
      })
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  React.useEffect(() => {
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
  }) // 每次渲染都能拿到最新 draft

  const remove = async () => {
    if (!contact || busy) return
    if (!window.confirm(t('删除确认'))) return
    setBusy(true)
    try {
      await onDelete(contact.id)
    } catch (err) {
      setError(err?.message || String(err))
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
      <div className="bc-editor" role="dialog" aria-modal="true" aria-label={contact ? t('编辑') : t('新增人脉')}>
        <div className="bc-editor-head">
          <div>
            <div className="mono dim">BUSINESS CARD</div>
            <div className="bc-editor-title">{contact ? t('编辑') : t('新增人脉')}</div>
          </div>
          <button className="bc-editor-close" onClick={onClose} aria-label={t('收起')}>×</button>
        </div>

        <div className="bc-form">
          <label className="bc-field">
            <span>{t('姓名')} *</span>
            <input value={draft.name} onChange={event => update({ name: event.target.value })} autoFocus />
          </label>
          <label className="bc-field">
            <span>{t('英文名')}</span>
            <input value={draft.nameEn} onChange={event => update({ nameEn: event.target.value })} />
          </label>
          <label className="bc-field">
            <span>{t('角色')}</span>
            <input value={draft.role} onChange={event => update({ role: event.target.value })} />
          </label>
          <label className="bc-field">
            <span>{t('公司')}</span>
            <input value={draft.company} onChange={event => update({ company: event.target.value })} />
          </label>
          <label className="bc-field">
            <span>
              {t('分类')}
              {onManageTypes ? (
                <button type="button" className="bc-field-link" onClick={onManageTypes}>{t('管理分类')}</button>
              ) : null}
            </span>
            <select value={draft.type} onChange={event => update({ type: event.target.value })}>
              {types.map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="bc-field">
            <span>{t('城市')}</span>
            <input value={draft.city} onChange={event => update({ city: event.target.value })} />
          </label>
          <label className="bc-field wide">
            <span>{t('标签')} · {t('最多 4 个')}</span>
            <input value={draft.tags} onChange={event => update({ tags: event.target.value })} placeholder="AI 应用, B 轮" />
          </label>
          <label className="bc-field">
            <span>{t('邮箱')}</span>
            <input value={draft.email} onChange={event => update({ email: event.target.value })} />
          </label>
          <label className="bc-field">
            <span>{t('微信')}</span>
            <input value={draft.wechat} onChange={event => update({ wechat: event.target.value })} />
          </label>
          <label className="bc-field">
            <span>{t('电话')}</span>
            <input value={draft.phone} onChange={event => update({ phone: event.target.value })} />
          </label>
          <label className="bc-field">
            <span>{t('下一步时间')}</span>
            <input type="datetime-local" value={draft.nextAt} onChange={event => update({ nextAt: event.target.value })} />
          </label>
          <label className="bc-field wide">
            <span>{t('下一步')}</span>
            <input value={draft.nextText} onChange={event => update({ nextText: event.target.value })} placeholder="约 45 分钟电话，对齐 B 轮节奏" />
          </label>
          <label className="bc-field wide">
            <span>{t('备注')}</span>
            <textarea value={draft.notes} onChange={event => update({ notes: event.target.value })} />
          </label>
          <div className="bc-field wide">
            <span>{t('卡片颜色')}</span>
            <div className="bc-accent-row">
              {ACCENT_KEYS.map(key => (
                <button
                  key={key}
                  type="button"
                  className="bc-accent"
                  aria-pressed={draft.accent === key}
                  style={{ background: ACCENTS[key] }}
                  title={key}
                  onClick={() => update({ accent: key })}
                />
              ))}
            </div>
          </div>
        </div>

        {error ? <div className="bc-editor-error">{error}</div> : null}

        <div className="bc-editor-foot">
          <div>
            {contact ? (
              <button className="bc-btn danger" onClick={remove} disabled={busy}>{t('删除')}</button>
            ) : (
              <span className="bc-editor-hint">{t('只保存在本机')}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="bc-editor-hint">⌘ / Ctrl + Enter</span>
            <button className="bc-btn" onClick={onClose}>{t('取消')}</button>
            <button className="bc-btn primary" onClick={submit} disabled={busy}>{busy ? '…' : t('保存')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
