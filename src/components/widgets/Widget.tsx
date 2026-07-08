import Link from 'next/link'
import type { ReactNode } from 'react'

interface WidgetProps {
  title:     string
  subtitle?: string
  href?:     string
  action?:   string
  children:  ReactNode
  className?: string
  accent?:   'default' | 'amber' | 'red' | 'emerald' | 'blue'
}

const accentBorder: Record<string, string> = {
  default: 'border-[#1f2937]',
  amber:   'border-amber-400/30',
  red:     'border-red-400/30',
  emerald: 'border-emerald-400/30',
  blue:    'border-blue-400/30',
}

export default function Widget({ title, subtitle, href, action = 'View all →', children, className = '', accent = 'default' }: WidgetProps) {
  return (
    <div className={`bg-[#111827] border ${accentBorder[accent]} rounded-2xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <h2 className="font-semibold text-white text-sm leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {href && (
          <Link href={href} className="text-xs text-slate-400 hover:text-slate-200 transition-colors shrink-0">
            {action}
          </Link>
        )}
      </div>
      <div className="px-5 pb-5">
        {children}
      </div>
    </div>
  )
}
