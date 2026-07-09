'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APPROVALS, PRODUCTS } from '@/lib/data'

const urgentApprovals = APPROVALS.filter(
  a => (a.priority === 'P0' || a.priority === 'P1') && a.status === 'open'
).length

function Icon({ d, d2 }: { d: string; d2?: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
      {d2 && <path d={d2} />}
    </svg>
  )
}

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      {
        href: '/',
        label: 'Home',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        ),
      },
      {
        href: '/company',
        label: 'Company',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Products',
    items: [
      {
        href: '/portfolio',
        label: 'Portfolio',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        ),
      },
      ...PRODUCTS.map(p => ({
        href:  `/product/${p.slug}`,
        label: p.name,
        icon:  (
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.status === 'live' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
        ),
        indent: true,
      })),
    ],
  },
  {
    label: 'Analytics',
    items: [
      {
        href: '/analytics',
        label: 'Analytics',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
          </svg>
        ),
      },
      {
        href: '/growth',
        label: 'Growth',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
        ),
      },
      {
        href: '/finance',
        label: 'Finance',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      {
        href: '/brief',
        label: 'AI Brief',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        ),
      },
      {
        href: '/decisions',
        label: 'Decisions',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        ),
      },
      {
        href: '/approvals',
        label: 'Approvals',
        badge: urgentApprovals,
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Pipeline',
    items: [
      {
        href: '/agents',
        label: 'Agents',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
            <line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/>
            <line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/>
            <line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="14" x2="22" y2="14"/>
            <line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="14" x2="4" y2="14"/>
          </svg>
        ),
      },
      {
        href: '/activity',
        label: 'Activity',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        ),
      },
      {
        href: '/timeline',
        label: 'Timeline',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/>
          </svg>
        ),
      },
      {
        href: '/integrations',
        label: 'Integrations',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        ),
      },
    ],
  },
]

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
  indent?: boolean
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors
        ${item.indent ? 'ml-3 py-1.5' : ''}
        ${isActive
          ? 'bg-slate-800 text-white border-l-2 border-emerald-400 pl-2.5'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
    >
      <span className={`flex-shrink-0 ${isActive ? 'text-emerald-400' : ''}`}>{item.icon}</span>
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? (
        <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {item.badge}
        </span>
      ) : null}
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#0f172a] border-r border-slate-800 flex flex-col z-50 hidden md:flex">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="text-white font-bold text-sm tracking-tight">DevOS</div>
        <div className="text-slate-500 text-[10px] mt-0.5 tracking-widest uppercase">CEO Operating System</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {section.label && (
              <div className="px-3 mb-1 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink key={item.href} item={item as NavItem} isActive={isActive(item.href)} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-800">
        <div className="text-[10px] text-slate-700">DevOS Control Center</div>
        <div className="text-[10px] text-slate-700 mt-0.5">Sprint 17 · Internal</div>
      </div>
    </aside>
  )
}
