import type { Initiative } from '@/lib/types'
import { getRoiColor, getRoiBg } from '@/lib/intelligence/decisionEngine'

const CATEGORY_ICONS: Record<string, string> = {
  analytics: '📊', seo: '🔍', launch: '🚀',
  legal: '⚖️', infrastructure: '🏗️', revenue: '💰', growth: '📈',
}

interface Props {
  initiative: Initiative
  showBreakdown?: boolean
}

export default function OpportunityCard({ initiative, showBreakdown = false }: Props) {
  const score = initiative.roiScore ?? 0
  const color = getRoiColor(score)
  const bg    = getRoiBg(score)

  return (
    <div className="flex items-start gap-4 py-4">
      {/* Rank */}
      <div className="flex-shrink-0 w-8 text-center">
        <span className="text-2xl font-bold text-slate-700 leading-none">#{initiative.rank}</span>
      </div>

      {/* ROI bar */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1 w-10">
        <div className={`text-base font-bold tabular-nums ${color}`}>{score}</div>
        <div className="w-full bg-slate-800 rounded-full h-1">
          <div className={`h-1 rounded-full ${bg}`} style={{ width: `${score}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <span className="text-sm flex-shrink-0 mt-0.5">{CATEGORY_ICONS[initiative.category] ?? '•'}</span>
          <div className="font-medium text-white text-sm leading-snug">{initiative.shortTitle}</div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{initiative.description}</p>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
          <span>{initiative.effort}</span>
          {initiative.requiredApproval !== 'None — engineering decision' &&
           initiative.requiredApproval !== 'None — can proceed immediately' &&
           initiative.requiredApproval !== 'None — 10 minute task' && (
            <>
              <span>·</span>
              <span className="text-amber-500">Needs CEO</span>
            </>
          )}
        </div>

        {showBreakdown && (
          <div className="mt-3 space-y-1">
            {initiative.risks.slice(0, 2).map((r, i) => (
              <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="text-amber-600 flex-shrink-0">▲</span>
                {r}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
