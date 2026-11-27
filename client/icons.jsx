import React from 'react'

export function ArrowIcon({ size = 11, rotate = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

export function SearchIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

export function ChevronLeftIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

export function ChevronDownIcon({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function CopyIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h8" />
    </svg>
  )
}

export function PlusIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function RefreshIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.3 6.3M20 5v6h-6" />
    </svg>
  )
}

export function ThemeIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16" />
    </svg>
  )
}

export function PeopleIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 3.5h16" opacity=".55" />
      <path d="M12 3.5v4" opacity=".55" />
      <rect x="6.5" y="7.5" width="11" height="13" rx="2" fill="none" />
      <circle cx="12" cy="12.4" r="2.1" fill="currentColor" stroke="none" opacity=".8" />
      <path d="M8.6 18.2c.5-2 1.7-3 3.4-3s2.9 1 3.4 3" opacity=".7" />
    </svg>
  )
}
