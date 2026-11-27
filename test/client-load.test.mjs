import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const code = await readFile(new URL('../dist/client.js', import.meta.url), 'utf8')

function loadModule() {
  let spec
  const window = {
    __ModuleLoader__: {
      load(value) {
        spec = value
      },
    },
  }
  globalThis.window = window
  // 客户端产物在顶层调用 window.__ModuleLoader__.load，工厂内部才 require('react')。
  new Function('window', code)(window)
  assert.ok(spec, 'module loader was called')
  const React = {
    createElement: () => null,
    Fragment: {},
    useState: value => [value, () => {}],
    useEffect: () => {},
    useRef: value => ({ current: value }),
    useMemo: fn => fn(),
    useCallback: fn => fn,
    useSyncExternalStore: () => null,
  }
  return spec.factory(name => {
    if (name === 'react') return React
    throw new Error(`unexpected require: ${name}`)
  })
}

test('client bundle registers sidebar entry and main panel under the package id', () => {
  const mod = loadModule()
  assert.equal(typeof mod.apply, 'function')
  assert.deepEqual(mod.inject, ['slots', 'locale'])

  const registrations = []
  const ctx = {
    effect(fn) {
      const dispose = fn()
      return () => dispose?.()
    },
    locale: {
      register: () => () => {},
      bind: () => key => key,
    },
    slots: {
      inject(_owner, fn) {
        fn()
      },
      register(options, component) {
        registrations.push({ options, component })
      },
    },
  }
  mod.apply(ctx)
  assert.equal(registrations.length, 2)
  const sidebar = registrations.find(entry => entry.options.name === 'sidebar.panellist')
  const main = registrations.find(entry => entry.options.name === 'main')
  assert.ok(sidebar, 'sidebar.panellist registered')
  assert.ok(main, 'main registered')
  assert.equal(sidebar.options.id, 'business-cards')
  assert.equal(main.options.key, 'business-cards')
  assert.equal(sidebar.options.order, 11)
  assert.equal(sidebar.options.label(), '人脉助手')
  assert.equal(typeof sidebar.component, 'function')
})
