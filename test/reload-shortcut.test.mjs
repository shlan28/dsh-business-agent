import test from 'node:test'
import assert from 'node:assert/strict'
import { installReloadShortcut } from '../client/reload-shortcut.js'

function fakeWindow() {
  const listeners = new Map()
  const win = {
    reloads: 0,
    location: { reload() { win.reloads += 1 } },
    addEventListener(type, fn, capture) { listeners.set(fn, { type, capture }) },
    removeEventListener(type, fn) { listeners.delete(fn) },
    dispatch(event) {
      for (const [fn, meta] of listeners) if (meta.type === 'keydown') fn(event)
    },
    get size() { return listeners.size },
  }
  return win
}

const key = (over = {}) => ({ key: 'r', metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, repeat: false, prevented: false, preventDefault() { this.prevented = true }, ...over })

test('cmd+R and ctrl+R reload the page and prevent the default', () => {
  const win = fakeWindow()
  const dispose = installReloadShortcut(win)
  const meta = key({ metaKey: true })
  win.dispatch(meta)
  assert.equal(meta.prevented, true)
  assert.equal(win.reloads, 1)
  win.dispatch(key({ ctrlKey: true }))
  assert.equal(win.reloads, 2)
  dispose()
})

test('other combos and plain keys are ignored', () => {
  const win = fakeWindow()
  installReloadShortcut(win)
  for (const event of [
    key(),
    key({ key: 'R' }),
    key({ metaKey: true, shiftKey: true }),
    key({ metaKey: true, altKey: true }),
    key({ key: 'e', metaKey: true }),
  ]) win.dispatch(event)
  assert.equal(win.reloads, 0, '没有 ⌘/Ctrl 的组合或其它按键都不拦截')
})

test('cleanup removes the listener and missing window is safe', () => {
  const win = fakeWindow()
  const dispose = installReloadShortcut(win)
  assert.equal(win.size, 1)
  dispose()
  assert.equal(win.size, 0)
  assert.doesNotThrow(() => installReloadShortcut(null)())
})
