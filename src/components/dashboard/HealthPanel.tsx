import { Widget } from '@/components/widgets'
import type { HealthScore } from '@/lib/types'

interface HealthPanelProps {
  health: HealthScore
}

const colorClass: Record<string, string> = {
  emerald: 'bg-emerald-400',
  amber:   'bg-amber-400',
  red:     'bg-red-400',
  blue:    'bg-blue-400',
}
const textClass: Record<string, string> = {
  emerald: 'text-emerald-400',
  amber:   'text-amber-400',
  red:     'text-red-400',
  blue:    'text-blue-400',
}

function healthLabel(score: number): string {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs attention'
}

export default function HealthPanel({ health }: HealthPanelProps) {
  return (
    <Widget title="Company Health" subtitle={healthLabel(health.total)}>
      {/* Score ring (CSS only) */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={health.total >= 70 ? '#10b981' : health.total >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="3"
              strokeDasharray={`${health.total} ${100 - health.total}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{health.total}</span>
          </div>
        </div>
        <div className="space-y-1 flex-1">
          {health.breakdown.slice(0, 3).map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-16 text-xs text-slate-400">{item.label}</div>
              <div className="flex-1 bg-slate-800 rounded-full h-1">
                <div
                  className={`h-1 rounded-full ${colorClass[item.color] ?? 'bg-slate-500'}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <span className={`text-xs font-medium w-6 text-right ${textClass[item.color] ?? 'text-slate-400'}`}>
                {item.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* All breakdown items */}
      <div className="grid grid-cols-5 gap-2 pt-3 border-t border-[#1f2937]">
        {health.breakdown.map(item => (
          <div key={item.label} className="text-center">
            <div className={`text-sm font-bold ${textClass[item.color] ?? 'text-slate-400'}`}>{item.score}</div>
            <div className="text-xs text-slate-600 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
    </Widget>
  )
}
