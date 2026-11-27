// 打包版 DSH 的桌面菜单里没有 reload 项（只有开发版注入），所以 ⌘/Ctrl+R 是空的。
// 插件在自己的客户端模块里补一个页面级快捷键，只拦截「⌘R / Ctrl+R」，其余组合键不动。
export function installReloadShortcut(win) {
  if (!win || typeof win.addEventListener !== 'function') return () => {}
  const onKeyDown = event => {
    if (!(event.metaKey || event.ctrlKey) || event.shiftKey || event.altKey) return
    if (String(event.key || '').toLowerCase() !== 'r') return
    if (event.repeat) return
    if (typeof event.preventDefault === 'function') event.preventDefault()
    if (win.location && typeof win.location.reload === 'function') win.location.reload()
  }
  win.addEventListener('keydown', onKeyDown, true)
  return () => win.removeEventListener('keydown', onKeyDown, true)
}
