'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APPROVALS } from '@/lib/data'

const urgentCount = APPROVALS.filter(a =>
  (a.priority === 'P0' || a.priority === 'P1') && a.status === 'open'
).length

const NAV = [
  {
    href:  '/',
    label: 'Home',
    icon:  (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href:  '/company',
    label: 'Company',
    icon:  (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/>
        <rect x="8" y="2" width="8" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href:  '/portfolio',
    label: 'Products',
    icon:  (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    href:   '/brief',
    label:  'Brief',
    icon:   (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    href:  '/approvals',
    label: 'Alerts',
    badge: urgentCount,
    icon:  (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#1f2937]"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-1 pt-2 pb-2">
        {NAV.map(item => {
          const active = item.href === '/'
            ? path === '/'
            : path.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-150 min-w-[52px]
                          active:scale-90 active:opacity-80
                          ${active ? 'text-white' : 'text-slate-500'}`}
            >
              {active && (
                <span className="absolute inset-0 rounded-xl bg-white/8" />
              )}
              <span className={`transition-colors ${active ? 'text-white' : 'text-slate-500'}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium leading-none relative z-10">{item.label}</span>
              {item.badge ? (
                <span className="absolute top-0.5 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
              {active && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
