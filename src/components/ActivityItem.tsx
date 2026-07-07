import type { Activity, ActivityType } from '@/lib/types'

const dotColors: Record<ActivityType, string> = {
  deploy : 'bg-blue-400',
  qa     : 'bg-emerald-400',
  agent  : 'bg-purple-400',
  growth : 'bg-teal-400',
  plan   : 'bg-amber-400',
}

const labelColors: Record<ActivityType, string> = {
  deploy : 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  qa     : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  agent  : 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  growth : 'text-teal-400 bg-teal-400/10 border-teal-400/30',
  plan   : 'text-amber-400 bg-amber-400/10 border-amber-400/30',
}

export default function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${dotColors[activity.type]}`} />
        <div className="w-px flex-1 bg-slate-800 mt-1" />
      </div>
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={`text-xs font-medium border rounded px-1.5 py-0.5 uppercase tracking-wide ${labelColors[activity.type]}`}>
            {activity.type}
          </span>
          {activity.product && (
            <span className="text-xs text-slate-500">{activity.product}</span>
          )}
          <span className="text-xs text-slate-600 ml-auto">{activity.date}</span>
        </div>
        <p className="text-sm text-slate-300">{activity.description}</p>
      </div>
    </div>
  )
}
