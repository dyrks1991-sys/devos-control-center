import Link from 'next/link'
import { Widget } from '@/components/widgets'
import type { Approval } from '@/lib/types'

interface AlertsPanelProps {
  approvals: Approval[]
}

const priorityStyle: Record<string, string> = {
  P0: 'text-red-400 border-red-400/30 bg-red-400/5',
  P1: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  P2: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  P3: 'text-slate-400 border-slate-700 bg-slate-800/50',
}

export default function AlertsPanel({ approvals }: AlertsPanelProps) {
  const open  = approvals.filter(a => a.status === 'open')
  const p0p1  = open.filter(a => a.priority === 'P0' || a.priority === 'P1')

  return (
    <Widget
      title="Alerts & Decisions"
      subtitle={`${open.length} open · ${p0p1.length} urgent`}
      href="/approvals"
      action="All decisions →"
      accent={p0p1.length > 0 ? 'red' : 'default'}
    >
      {open.length === 0 ? (
        <div className="text-sm text-slate-500 py-2">No open decisions — all clear.</div>
      ) : (
        <div className="space-y-2">
          {open.slice(0, 4).map(a => (
            <div key={a.id} className={`flex items-start gap-3 p-3 border rounded-xl ${priorityStyle[a.priority]}`}>
              <span className={`text-xs font-bold mt-0.5 shrink-0 ${a.priority === 'P0' ? 'text-red-400' : a.priority === 'P1' ? 'text-amber-400' : 'text-blue-400'}`}>
                {a.priority}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white leading-tight">{a.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{a.project}</div>
              </div>
            </div>
          ))}
          {open.length > 4 && (
            <Link href="/approvals" className="block text-xs text-slate-500 text-center hover:text-slate-300 pt-1">
              +{open.length - 4} more decisions →
            </Link>
          )}
        </div>
      )}
    </Widget>
  )
}
