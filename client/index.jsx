import React from 'react'
import css from './styles.css'
import { App } from './app.jsx'
import { bindT, registerLocale } from './i18n.js'
import { installReloadShortcut } from './reload-shortcut.js'
import { PeopleIcon } from './icons.jsx'

export const inject = ['slots', 'locale']

function Icon({ size = 22 }) {
  return <PeopleIcon size={size} />
}

export function apply(ctx) {
  ctx.effect(() => registerLocale(ctx), 'business-cards: locale')
  const t = bindT(ctx)

  // 打包版 DSH 没有 ⌘/Ctrl+R（菜单里只在开发版注入 reload），这里补一个页面级快捷键。
  ctx.effect(() => installReloadShortcut(typeof window === 'undefined' ? null : window), 'business-cards: reload shortcut')

  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      {
        name: 'sidebar.panellist',
        id: 'business-cards',
        order: 11,
        label: () => t('人脉助手'),
      },
      Icon,
    ),
  )

  ctx.slots.inject('main', () =>
    ctx.slots.register(
      { name: 'main', key: 'business-cards' },
      function BusinessCardsPanel() {
        return <App ctx={ctx} t={t} css={css} />
      },
    ),
  )
}
