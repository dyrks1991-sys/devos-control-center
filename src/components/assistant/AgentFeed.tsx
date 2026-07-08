import type { Activity } from '@/lib/types'

const TYPE_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  deploy:   { label: 'Deploy Agent',    color: 'text-blue-400',   dot: 'bg-blue-400' },
  qa:       { label: 'QA Agent',        color: 'text-emerald-400', dot: 'bg-emerald-400' },
  agent:    { label: 'Agent System',    color: 'text-purple-400', dot: 'bg-purple-400' },
  growth:   { label: 'Growth Agent',   color: 'text-teal-400',   dot: 'bg-teal-400' },
  plan:     { label: 'Planner Agent',  color: 'text-amber-400',  dot: 'bg-amber-400' },
  strategy: { label: 'Strategy Agent', color: 'text-indigo-400', dot: 'bg-indigo-400' },
  brief:    { label: 'Brief Agent',    color: 'text-pink-400',   dot: 'bg-pink-400' },
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return dateStr
}

interface Props {
  activities: Activity[]
  limit?: number
  showDate?: boolean
}

export default function AgentFeed({ activities, limit = 10, showDate = true }: Props) {
  const items = activities.slice(0, limit)

  const byDate: Record<string, Activity[]> = {}
  for (const a of items) {
    if (!byDate[a.date]) byDate[a.date] = []
    byDate[a.date].push(a)
  }

  return (
    <div className="space-y-4">
      {Object.entries(byDate)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, events]) => (
        <div key={date}>
          {showDate && (
            <div className="flex items-center gap-3 mb-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {formatDate(date)}
              </div>
              <div className="flex-1 h-px bg-[#1f2937]" />
              <div className="text-xs text-slate-600">{events.length} event{events.length !== 1 ? 's' : ''}</div>
            </div>
          )}
          <div className="space-y-1">
            {events.map(a => {
              const cfg = TYPE_CONFIG[a.type] ?? { label: a.type, color: 'text-slate-400', dot: 'bg-slate-500' }
              return (
                <div key={a.id} className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <div className="flex-shrink-0 mt-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot} ${a.status === 'fail' ? 'ring-1 ring-red-500/50' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-medium ${cfg.color}`}>{cfg.label}</span>
                      {a.product && (
                        <>
                          <span className="text-slate-700">·</span>
                          <span className="text-[11px] text-slate-500">{a.product}</span>
                        </>
                      )}
                      <span className={`ml-auto text-[10px] font-medium ${a.status === 'success' ? 'text-emerald-500' : a.status === 'fail' ? 'text-red-400' : 'text-slate-500'}`}>
                        {a.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
