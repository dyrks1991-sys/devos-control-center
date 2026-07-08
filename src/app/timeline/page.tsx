import { TIMELINE } from '@/lib/data'
import TimelineView from '@/components/assistant/TimelineView'

const TYPE_LEGEND = [
  { type: 'sprint',       label: 'Sprint',         color: 'bg-emerald-400' },
  { type: 'launch',       label: 'Product Launch', color: 'bg-amber-400' },
  { type: 'architecture', label: 'Architecture',   color: 'bg-purple-400' },
  { type: 'growth',       label: 'Growth',         color: 'bg-teal-400' },
  { type: 'milestone',    label: 'Milestone',      color: 'bg-white' },
  { type: 'agent',        label: 'Agent',          color: 'bg-indigo-400' },
  { type: 'deploy',       label: 'Deploy',         color: 'bg-blue-400' },
]

export default function TimelinePage() {
  const sprints    = TIMELINE.filter(e => e.type === 'sprint').length
  const launches   = TIMELINE.filter(e => e.type === 'launch').length
  const milestones = TIMELINE.filter(e => e.type === 'milestone').length
  const inProgress = TIMELINE.filter(e => e.status === 'in-progress').length

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Company Timeline</h1>
        <p className="text-slate-400 text-sm mt-1">
          {TIMELINE.length} events · {sprints} sprints · {launches} product launches
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { value: TIMELINE.length, label: 'Total Events',    color: 'text-white' },
          { value: sprints,         label: 'Sprints',         color: 'text-emerald-400' },
          { value: launches,        label: 'Launches',        color: 'text-amber-400' },
          { value: inProgress,      label: 'In Progress',     color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {TYPE_LEGEND.map(item => (
          <div key={item.type} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
        <TimelineView events={TIMELINE} />
      </div>
    </div>
  )
}
