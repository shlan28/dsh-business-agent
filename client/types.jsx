import React from 'react'

/** 分类管理：改名、增删；删掉分类下的人由 Host 并入「其他」。 */
export function TypeManager({ types, t, onSave, onClose }) {
  const [draft, setDraft] = React.useState(() => types.map(item => ({ ...item })))
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')
  const [removed, setRemoved] = React.useState([])

  const update = (index, patch) =>
    setDraft(current => current.map((item, position) => (position === index ? { ...item, ...patch } : item)))

  const add = () => setDraft(current => [...current, { id: '', label: '', draft: true }])

  const remove = index => {
    setDraft(current => {
      const target = current[index]
      if (target?.id === 'other') return current
      const next = current.filter((_, position) => position !== index)
      setRemoved(list => (target?.id ? [...list, target.id] : list))
      return next
    })
  }

  const submit = async () => {
    const cleaned = draft
      .map(item => ({ id: item.id || '', label: String(item.label || '').trim() }))
      .filter(item => item.label)
    if (!cleaned.length) {
      setError(t('至少保留一个分类'))
      return
    }
    setBusy(true)
    setError('')
    try {
      const result = await onSave(cleaned)
      if (result?.moved) {
        // 迁移人数由 Host 返回，调用方负责提示
      }
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
      <div className="bc-editor bc-types" role="dialog" aria-modal="true" aria-label={t('管理分类')}>
        <div className="bc-editor-head">
          <div>
            <div className="mono dim">CATEGORIES</div>
            <div className="bc-editor-title">{t('管理分类')}</div>
          </div>
          <button className="bc-editor-close" onClick={onClose} aria-label={t('收起')}>×</button>
        </div>

        <p className="bc-compose-lead">
          {t('分类决定名片墙上怎么分组和筛选')}。删掉分类时，这个分类下的人会并入「其他」，不会丢。
        </p>

        <div className="bc-type-list">
          {draft.map((item, index) => (
            <div className="bc-type-row" key={`${item.id || 'new'}-${index}`}>
              <span className="mono dim id">{item.id === 'other' ? 'OTHER' : item.id || t('新分类')}</span>
              <input
                className="bc-type-input"
                value={item.label}
                placeholder={t('分类名称，最多 8 个字')}
                maxLength={8}
                onChange={event => update(index, { label: event.target.value })}
                autoFocus={item.draft}
              />
              <button
                className="bc-type-remove"
                onClick={() => remove(index)}
                disabled={item.id === 'other'}
                title={item.id === 'other' ? t('「其他」是兜底分类，不能删') : t('删除')}
                aria-label={t('删除')}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button className="bc-pill" onClick={add} disabled={draft.length >= 24}>
          + {t('新增分类')}
        </button>

        {removed.length ? (
          <div className="bc-editor-hint" style={{ marginTop: 10 }}>
            {t('保存后，被删分类下的人会并入「其他」')}
          </div>
        ) : null}
        {error ? <div className="bc-editor-error">{error}</div> : null}

        <div className="bc-editor-foot">
          <span className="bc-editor-hint">{t('分类只影响分组与筛选，不改名片内容')}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="bc-btn" onClick={onClose}>{t('取消')}</button>
            <button className="bc-btn primary" onClick={submit} disabled={busy}>{busy ? '…' : t('保存')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
