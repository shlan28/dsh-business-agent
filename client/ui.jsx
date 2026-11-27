import React from 'react'
import { ArrowIcon } from './icons.jsx'

export const FALLBACK_TYPE = 'other'

/** 按用户配置的分类取标签；找不到就退回兜底文案。 */
export function labelOfType(types, id) {
  if (!Array.isArray(types)) return 'OTHER'
  const found = types.find(item => item.id === id)
  return found?.label || '其他'
}

export const ACCENTS = {
  orchid: 'linear-gradient(150deg,#EFC9F6 0%,#D9B0F0 48%,#C6A0E9 100%)',
  peach: 'linear-gradient(150deg,#FAD9B4 0%,#F3C193 55%,#EBA875 100%)',
  butter: 'linear-gradient(150deg,#F8E7A9 0%,#EFD483 55%,#E4C266 100%)',
  rose: 'linear-gradient(150deg,#F8D2CE 0%,#EDB6B1 55%,#E3A09B 100%)',
  sage: 'linear-gradient(150deg,#DCE9CC 0%,#C4D9AE 55%,#AEC994 100%)',
  sky: 'linear-gradient(150deg,#D6E5F4 0%,#B9D1E9 55%,#A2C0DE 100%)',
  blue: 'linear-gradient(150deg,#DCD8F5 0%,#BFBAEA 55%,#A9A2DE 100%)',
}
export const ACCENT_KEYS = Object.keys(ACCENTS)

export function accentOf(contact) {
  return ACCENTS[contact?.accent] || ACCENTS.orchid
}

export function numberLabel(no) {
  const value = Number.isFinite(no) && no > 0 ? no : 1
  return String(value).padStart(3, '0')
}

export function initialOf(name) {
  const value = typeof name === 'string' ? name.trim() : ''
  if (!value) return '?'
  return [...value][0]
}

export function initialsOf(name) {
  const value = typeof name === 'string' ? name.trim() : ''
  if (!value) return '?'
  if (/^[\x00-\x7F\s]+$/.test(value)) {
    return value
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('')
  }
  return [...value][0]
}

const RELATIVE = [
  [60, '秒前', 1],
  [3600, '分钟前', 60],
  [86_400, '小时前', 3600],
  [604_800, '天前', 86_400],
  [2_592_000, '周前', 604_800],
  [31_536_000, '个月前', 2_592_000],
]

export function relativeTime(value) {
  if (!value) return '—'
  const stamp = Date.parse(value)
  if (!Number.isFinite(stamp)) return '—'
  const diff = Math.max(0, Date.now() - stamp) / 1000
  if (diff < 60) return '刚刚'
  for (const [limit, label, unit] of RELATIVE) {
    if (diff < limit) {
      const amount = Math.max(1, Math.floor(diff / unit))
      return `${amount} ${label}`
    }
  }
  return dateLabel(value)
}

export function dateLabel(value) {
  if (!value) return ''
  const stamp = Date.parse(value)
  if (!Number.isFinite(stamp)) return ''
  const d = new Date(stamp)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function timeLabel(value) {
  if (!value) return ''
  const stamp = Date.parse(value)
  if (!Number.isFinite(stamp)) return ''
  return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date(stamp))
}

export function shortDate(value) {
  if (!value) return ''
  const stamp = Date.parse(value)
  if (!Number.isFinite(stamp)) return ''
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(new Date(stamp))
}

export function isoFromLocal(value) {
  if (!value) return null
  const stamp = Date.parse(value)
  return Number.isFinite(stamp) ? new Date(stamp).toISOString() : null
}

export function localInputValue(value) {
  if (!value) return ''
  const stamp = Date.parse(value)
  if (!Number.isFinite(stamp)) return ''
  const d = new Date(stamp)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function siteOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function Plate({ contact, types = [], className = '', seal = false }) {
  return (
    <div className={`plate ${className}`.trim()} style={{ background: accentOf(contact) }}>
      <span className="seal" style={{ borderColor: 'rgba(20,20,20,.22)' }}>
        <span>{initialsOf(contact?.name)}</span>
        <em>{contact?.nameEn ? contact.nameEn.toUpperCase() : ''}</em>
      </span>
      <span className="where">
        {[contact?.city, labelOfType(types, contact?.type)].filter(Boolean).join(' · ')}
      </span>
    </div>
  )
}

export function Go({ size = 11 }) {
  return (
    <span className="go">
      <ArrowIcon size={size} />
    </span>
  )
}

export function TypingDots() {
  return (
    <span className="bc-typing" aria-label="thinking">
      <i />
      <i />
      <i />
    </span>
  )
}
