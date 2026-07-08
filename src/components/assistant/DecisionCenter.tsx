import type { Recommendation } from '@/lib/types'

const PRIORITY_COLORS: Record<string, string> = {
  P0: 'bg-red-500/10 text-red-400 border-red-500/30',
  P1: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  P2: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  P3: 'bg-slate-700/50 text-slate-400 border-slate-600',
}

const CATEGORY_ICONS: Record<string, string> = {
  analytics:      '📊',
  seo:            '🔍',
  launch:         '🚀',
  legal:          '⚖️',
  infrastructure: '🏗️',
  revenue:        '💰',
  growth:         '📈',
}

interface Props {
  recommendations: Recommendation[]
}

export default function DecisionCenter({ recommendations }: Props) {
  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-[#1f2937]">
        <h2 className="font-semibold text-white text-sm">AI Recommendations</h2>
        <p className="text-xs text-slate-500 mt-0.5">Generated from live company state · {recommendations.length} active</p>
      </div>

      <div className="divide-y divide-[#1f2937]">
        {recommendations.map(rec => (
          <div key={rec.id} className="px-5 py-4">
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0 mt-0.5">{CATEGORY_ICONS[rec.category] ?? '•'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`text-[10px] font-bold border rounded px-1.5 py-0.5 ${PRIORITY_COLORS[rec.priority]}`}>
                    {rec.priority}
                  </span>
                  <span className="text-sm font-medium text-white leading-snug">{rec.title}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {rec.reasoning}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-[#0f172a] rounded-lg px-3 py-2">
                    <div className="text-[10px] text-slate-600 uppercase tracking-wide mb-0.5">Expected Impact</div>
                    <div className="text-xs text-slate-300">{rec.impact}</div>
                  </div>
                  <div className="bg-[#0f172a] rounded-lg px-3 py-2">
                    <div className="text-[10px] text-slate-600 uppercase tracking-wide mb-0.5">Estimated Time</div>
                    <div className="text-xs text-slate-300">{rec.estimatedTime}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled
                    className="flex-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg py-1.5 cursor-not-allowed opacity-60"
                    title="Approve (coming in Sprint 15)"
                  >
                    ✓ Approve
                  </button>
                  <button
                    disabled
                    className="text-xs font-medium bg-slate-800 text-slate-500 border border-slate-700 rounded-lg py-1.5 px-3 cursor-not-allowed opacity-60"
                    title="Defer (coming in Sprint 15)"
                  >
                    Defer
                  </button>
                  <button
                    disabled
                    className="text-xs font-medium bg-slate-800 text-slate-500 border border-slate-700 rounded-lg py-1.5 px-3 cursor-not-allowed opacity-60"
                    title="Reject (coming in Sprint 15)"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
