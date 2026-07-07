import ActivityItem from '@/components/ActivityItem'
import { ACTIVITIES } from '@/lib/data'
import type { ActivityType } from '@/lib/types'

export default function ActivityFeed() {
  // Group by date
  const byDate: Record<string, typeof ACTIVITIES> = {}
  for (const a of ACTIVITIES) {
    if (!byDate[a.date]) byDate[a.date] = []
    byDate[a.date].push(a)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
        <p className="text-slate-400 text-sm mt-1">{ACTIVITIES.length} events recorded</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {([
          { type: 'deploy' as ActivityType, label: 'Deploy',  color: 'bg-blue-400' },
          { type: 'qa'     as ActivityType, label: 'QA',      color: 'bg-emerald-400' },
          { type: 'agent'  as ActivityType, label: 'Agent',   color: 'bg-purple-400' },
          { type: 'growth' as ActivityType, label: 'Growth',  color: 'bg-teal-400' },
          { type: 'plan'   as ActivityType, label: 'Plan',    color: 'bg-amber-400' },
        ]).map(item => (
          <div key={item.type} className="flex items-center gap-2 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Timeline grouped by date */}
      {Object.entries(byDate).sort((a, b) => b[0].localeCompare(a[0])).map(([date, events]) => (
        <div key={date} className="mb-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 sticky top-0 bg-[#0a0a0a] py-1">
            {date}
          </div>
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
            {events.map((a) => (
              <ActivityItem key={a.id} activity={a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
