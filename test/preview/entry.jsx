import React from 'react'
import { createRoot } from 'react-dom/client'
import css from '../../client/styles.css'
import { App } from '../../client/app.jsx'
import { installMockApi } from './mock.js'

const params = new URLSearchParams(location.search)
const dark = params.get('theme') === 'dark'
installMockApi({ dark, emptyProfile: params.has('noprofile') })

const openId = params.get('open') || ''
try {
  if (openId) sessionStorage.setItem('dsh:business-cards:open', openId)
  else sessionStorage.removeItem('dsh:business-cards:open')
} catch {
  // 预览页允许没有 sessionStorage。
}

const theme = {
  getTheme: () => ({ active: { colorScheme: dark ? 'dark' : 'light' } }),
}
const ctx = {
  get: name => (name === 'theme' ? theme : undefined),
  on: () => () => {},
  theme,
}
const t = key => key

createRoot(document.getElementById('root')).render(<App ctx={ctx} t={t} css={css} />)

setTimeout(() => {
  if (params.has('flip')) document.querySelector('.flip')?.click()
  if (params.has('compose') || params.has('editor')) {
    const button = [...document.querySelectorAll('button')].find(node => node.textContent?.includes('新增人脉'))
    button?.click()
  }
  if (params.has('autocompose')) {
    setTimeout(() => {
      const textarea = document.querySelector('.bc-compose-input')
      if (textarea) {
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set
        setter.call(textarea, '周牧，观夏创始人，客户，标签 品牌 / DTC')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
        setTimeout(() => document.querySelector('.bc-compose .bc-btn.primary')?.click(), 120)
      }
    }, 300)
  }
  if (params.has('edit')) {
    const button = [...document.querySelectorAll('.dactions button')][0]
    button?.click()
  }
  if (params.has('types')) {
    document.querySelector('.tab-manage')?.click()
  }
  if (params.has('me')) {
    const button = [...document.querySelectorAll('button')].find(node => node.textContent?.includes('我的名片'))
    button?.click()
  }
  if (params.has('mecard')) {
    const button = [...document.querySelectorAll('button')].find(node => node.textContent?.includes('我的名片'))
    button?.click()
    setTimeout(() => {
      const edit = [...document.querySelectorAll('.dactions button')][0]
      edit?.click()
    }, 500)
  }
  if (params.has('research')) {
    const buttons = [...document.querySelectorAll('.dactions button')]
    buttons[buttons.length - 1]?.click()
  }
  if (params.has('send')) {
    const textarea = document.querySelector('.composer textarea')
    if (textarea) {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set
      setter.call(textarea, '帮我草拟一条下周电话后的跟进微信')
      textarea.dispatchEvent(new Event('input', { bubbles: true }))
      setTimeout(() => document.querySelector('.composer .send')?.click(), 120)
    }
  }
}, 900)
