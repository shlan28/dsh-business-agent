import React from 'react'
import { api } from './api.js'
import { Wall } from './wall.jsx'
import { Person } from './person.jsx'
import { Editor } from './editor.jsx'
import { Composer } from './compose.jsx'
import { MeEditor, MeGuide, MyCard } from './me.jsx'

const STORAGE_KEY = 'dsh:business-cards:open'
const ME_SKIP_KEY = 'dsh:business-cards:me-skip'

function readScheme(ctx) {
  try {
    const service = ctx.get?.('theme') || ctx.theme
    const snapshot = service?.getTheme?.()
    if (snapshot?.active?.colorScheme) return snapshot.active.colorScheme
  } catch {
    // 主题服务不可用时退回系统偏好。
  }
  try {
    // DSH 的 presenter 会把解析后的主题写到 body 属性；主题服务尚未就绪时兜底读它。
    if (document.body?.hasAttribute('data-ds-dark-theme')) return 'dark'
    if (document.body?.dataset?.theme === 'dark') return 'dark'
  } catch {
    // 忽略宿主 DOM 结构变化。
  }
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function App({ ctx, t, css }) {
  const [state, setState] = React.useState({
    loaded: false,
    error: '',
    contacts: [],
    me: null,
    hasMe: false,
    revision: 0,
    capabilities: { chat: false },
  })
  const [openId, setOpenId] = React.useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })
  const [editor, setEditor] = React.useState(null)
  const [composer, setComposer] = React.useState(false)
  const [meOpen, setMeOpen] = React.useState(false)
  const [meEditor, setMeEditor] = React.useState(false)
  const [guideDismissed, setGuideDismissed] = React.useState(() => {
    try {
      return localStorage.getItem(ME_SKIP_KEY) === '1'
    } catch {
      return false
    }
  })
  const [toast, setToast] = React.useState(null)
  const [scheme, setScheme] = React.useState(() => readScheme(ctx))
  const toastTimer = React.useRef(null)
  const aliveRef = React.useRef(true)

  const notify = React.useCallback((text, { error = false } = {}) => {
    setToast({ text, error, key: Date.now() })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const refresh = React.useCallback(async () => {
    try {
      const data = await api('/state')
      if (!aliveRef.current) return
      setState({
        loaded: true,
        error: '',
        contacts: Array.isArray(data.contacts) ? data.contacts : [],
        me: data.me || null,
        hasMe: Boolean(data.hasMe),
        revision: data.revision || 0,
        capabilities: data.capabilities || { chat: false },
      })
    } catch (error) {
      if (!aliveRef.current) return
      setState(current => ({ ...current, loaded: true, error: error?.message || String(error) }))
    }
  }, [])

  React.useEffect(() => {
    aliveRef.current = true
    void refresh()
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, 4000)
    return () => {
      aliveRef.current = false
      clearInterval(timer)
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [refresh])

  React.useEffect(() => {
    let observer
    try {
      observer = new MutationObserver(() => setScheme(readScheme(ctx)))
      observer.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme', 'data-theme'] })
    } catch {
      // 没有 body 或不支持 MutationObserver 时只靠主题事件。
    }
    let off
    try {
      const service = ctx.get?.('theme') || ctx.theme
      off = ctx.on?.('theme/change', snapshot => {
        if (snapshot?.active?.colorScheme) setScheme(snapshot.active.colorScheme)
      })
      if (!service) return off
    } catch {
      // 没有主题服务就只看系统偏好。
    }
    return () => {
      off?.()
      observer?.disconnect()
    }
  }, [ctx])

  const open = React.useCallback(id => {
    setOpenId(id)
    try {
      sessionStorage.setItem(STORAGE_KEY, id)
    } catch {
      // 忽略隐私模式下的存储失败。
    }
  }, [])

  const back = React.useCallback(() => {
    setOpenId('')
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // 同上。
    }
  }, [])

  const saveMe = async patch => {
    const data = await api('/op', { method: 'POST', body: { action: 'me', patch } })
    if (data.state) {
      setState(current => ({
        ...current,
        contacts: data.state.contacts,
        revision: data.state.revision,
        me: data.me,
        hasMe: Boolean(data.hasMe),
      }))
    }
    notify(t('已保存'))
    return data
  }

  const clearMe = async () => {
    const data = await api('/op', { method: 'POST', body: { action: 'meReset' } })
    if (data.state) {
      setState(current => ({
        ...current,
        contacts: data.state.contacts,
        revision: data.state.revision,
        me: data.me,
        hasMe: false,
      }))
    }
    notify(t('已清空'))
  }

  const dismissGuide = () => {
    setGuideDismissed(true)
    try {
      localStorage.setItem(ME_SKIP_KEY, '1')
    } catch {
      // 隐私模式下记不住，下次还会问。
    }
  }

  const saveContact = async payload => {
    const data = await api('/op', { method: 'POST', body: { action: 'save', contact: payload } })
    if (data.state) {
      setState(current => ({
        ...current,
        contacts: data.state.contacts,
        revision: data.state.revision,
        loaded: true,
        error: '',
      }))
    }
    setEditor(null)
    if (data.contact?.id) open(data.contact.id)
    notify(t('已保存'))
  }

  const deleteContact = async id => {
    const data = await api('/op', { method: 'POST', body: { action: 'delete', id } })
    if (data.state) {
      setState(current => ({
        ...current,
        contacts: data.state.contacts,
        revision: data.state.revision,
      }))
    }
    setEditor(null)
    back()
    notify(t('已删除'))
  }

  const addNote = async payload => {
    const data = await api('/op', { method: 'POST', body: { action: 'note', ...payload } })
    if (data.state) {
      setState(current => ({ ...current, contacts: data.state.contacts, revision: data.state.revision }))
    }
  }

  const handleComposed = React.useCallback(
    async id => {
      setComposer(false)
      await refresh()
      open(id)
      notify(t('已保存'))
    },
    [refresh, open, notify, t],
  )

  const startResearch = async id => {
    try {
      await api('/research', { method: 'POST', body: { id } })
      notify(t('已开始研究，结果会写回这张卡'))
    } catch (error) {
      notify(error?.message || String(error), { error: true })
      throw error
    }
  }

  const selected = openId ? state.contacts.find(contact => contact.id === openId) : null
  const me = state.me || { identity: {}, needs: [], offers: [], goals: [], preferences: { redLines: [] }, sources: [] }
  const showGuide = state.loaded && !state.hasMe && !guideDismissed && !meOpen && !meEditor
  const editing = editor ? (editor === 'new' ? null : state.contacts.find(contact => contact.id === editor.id) || null) : undefined

  return (
    <div className="bc-root" data-theme={scheme}>
      <style>{css}</style>
      <div className="grain" />
      <div className="edge l" />
      <div className="edge r" />

      {meOpen ? (
        <MyCard
          me={me}
          t={t}
          onBack={() => setMeOpen(false)}
          onEdit={() => setMeEditor(true)}
          onStart={() => setMeEditor(true)}
        />
      ) : selected ? (
        <Person
          contact={selected}
          t={t}
          capabilities={state.capabilities}
          onBack={back}
          onEdit={() => setEditor({ id: selected.id })}
          onToast={notify}
          onNote={addNote}
          onResearch={startResearch}
          onContactChanged={refresh}
        />
      ) : (
        <Wall
          contacts={state.contacts}
          loaded={state.loaded}
          error={state.error}
          t={t}
          onOpen={open}
          onNew={() => (state.capabilities.chat ? setComposer(true) : setEditor('new'))}
          onRetry={refresh}
          onMe={() => setMeOpen(true)}
        />
      )}

      {composer ? (
        <Composer
          t={t}
          onClose={() => setComposer(false)}
          onCreated={handleComposed}
          onFallback={() => {
            setComposer(false)
            setEditor('new')
          }}
        />
      ) : null}

      {meEditor ? (
        <MeEditor
          me={me}
          t={t}
          onSave={saveMe}
          onClear={clearMe}
          onClose={() => setMeEditor(false)}
        />
      ) : null}

      {showGuide ? (
        <MeGuide
          t={t}
          onSave={async patch => {
            await saveMe(patch)
            setGuideDismissed(true)
          }}
          onSkip={dismissGuide}
        />
      ) : null}

      {editor !== null ? (
        <Editor
          contact={editing || null}
          t={t}
          onSave={saveContact}
          onDelete={deleteContact}
          onClose={() => setEditor(null)}
        />
      ) : null}

      {toast ? <div className={`bc-toast ${toast.error ? 'error' : ''}`}>{toast.text}</div> : null}
    </div>
  )
}
