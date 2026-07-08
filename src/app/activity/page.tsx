import AgentFeed from '@/components/assistant/AgentFeed'
import { ACTIVITIES } from '@/lib/data'

const TYPE_LEGEND = [
  { label: 'Deploy Agent',   color: 'bg-blue-400' },
  { label: 'QA Agent',       color: 'bg-emerald-400' },
  { label: 'Agent System',   color: 'bg-purple-400' },
  { label: 'Growth Agent',   color: 'bg-teal-400' },
  { label: 'Planner Agent',  color: 'bg-amber-400' },
  { label: 'Strategy Agent', color: 'bg-indigo-400' },
]

export default function ActivityFeedPage() {
  const successCount = ACTIVITIES.filter(a => a.status === 'success').length
  const failCount    = ACTIVITIES.filter(a => a.status === 'fail').length

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Agent Activity</h1>
        <p className="text-slate-400 text-sm mt-1">
          {ACTIVITIES.length} pipeline events · {successCount} success · {failCount} failed
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white tabular-nums">{ACTIVITIES.length}</div>
          <div className="text-xs text-slate-500 mt-1">Total Events</div>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">{successCount}</div>
          <div className="text-xs text-slate-500 mt-1">Successful</div>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400 tabular-nums">{failCount}</div>
          <div className="text-xs text-slate-500 mt-1">Failed</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {TYPE_LEGEND.map(item => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
        <AgentFeed activities={ACTIVITIES} limit={50} showDate={true} />
      </div>
    </div>
  )
}
