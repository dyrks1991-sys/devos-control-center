type StatusVariant = 'live' | 'building' | 'offline' | 'warning' | 'ok' | 'mock' | 'connected' | 'pending'

const variants: Record<StatusVariant, string> = {
  live:      'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  ok:        'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  connected: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  building:  'bg-blue-400/10 text-blue-400 border-blue-400/30',
  warning:   'bg-amber-400/10 text-amber-400 border-amber-400/30',
  pending:   'bg-amber-400/10 text-amber-400 border-amber-400/30',
  offline:   'bg-red-400/10 text-red-400 border-red-400/30',
  mock:      'bg-slate-400/10 text-slate-400 border-slate-700',
}

const dot: Record<StatusVariant, string> = {
  live:      'bg-emerald-400 animate-pulse',
  ok:        'bg-emerald-400',
  connected: 'bg-emerald-400',
  building:  'bg-blue-400 animate-pulse',
  warning:   'bg-amber-400',
  pending:   'bg-amber-400',
  offline:   'bg-red-400',
  mock:      'bg-slate-500',
}

interface StatusPillProps {
  status:  StatusVariant
  label?:  string
  showDot?: boolean
}

export default function StatusPill({ status, label, showDot = true }: StatusPillProps) {
  const text = label ?? status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-0.5 font-medium ${variants[status]}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />}
      {text}
    </span>
  )
}
