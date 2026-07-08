import type { Initiative } from '@/lib/types'
import { getRoiColor, getRoiBg, formatROIScore } from '@/lib/intelligence/decisionEngine'
import { scoreBreakdown } from '@/lib/intelligence/roi'
import Link from 'next/link'

interface Props {
  initiative: Initiative
}

const CATEGORY_ICONS: Record<string, string> = {
  analytics: '📊', seo: '🔍', launch: '🚀',
  legal: '⚖️', infrastructure: '🏗️', revenue: '💰', growth: '📈',
}

export default function TopOpportunity({ initiative }: Props) {
  const score     = initiative.roiScore ?? 0
  const color     = getRoiColor(score)
  const bg        = getRoiBg(score)
  const label     = formatROIScore(score)
  const breakdown = scoreBreakdown(initiative.scores)
  const topFactors = breakdown.sort((a, b) => b.weighted - a.weighted).slice(0, 3)

  return (
    <div className="bg-[#111827] border border-emerald-400/20 rounded-2xl overflow-hidden">
      {/* Header strip */}
      <div className="bg-emerald-400/5 border-b border-emerald-400/20 px-5 py-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">
          #1 Recommendation · AI Decision Engine
        </span>
        <Link href="/decisions" className="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors">
          View all →
        </Link>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* ROI Score Ring */}
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#0f172a] border border-[#1f2937] flex flex-col items-center justify-center">
            <div className={`text-xl font-bold tabular-nums ${color}`}>{score}</div>
            <div className="text-[9px] text-slate-600 uppercase tracking-wide">ROI</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-base">{CATEGORY_ICONS[initiative.category] ?? '•'}</span>
              <h2 className="font-semibold text-white leading-snug">{initiative.title}</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <span className={`font-medium ${color}`}>{label}</span>
              <span>·</span>
              <span>{initiative.effort}</span>
              <span>·</span>
              <span className="capitalize">{initiative.category}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{initiative.description}</p>
          </div>
        </div>

        {/* Key factors */}
        <div className="mt-4 pt-4 border-t border-[#1f2937]">
          <div className="text-xs text-slate-600 uppercase tracking-wide mb-2">Why this ranks #1</div>
          <div className="grid grid-cols-3 gap-2">
            {topFactors.map(f => (
              <div key={f.label} className="bg-[#0f172a] rounded-xl p-2.5 text-center">
                <div className="text-sm font-bold text-white tabular-nums">{f.score}/10</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Risks + approval */}
        {initiative.risks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#1f2937]">
            <div className="text-xs text-slate-600 mb-1.5">Risks</div>
            <div className="space-y-0.5">
              {initiative.risks.map((r, i) => (
                <div key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                  <span className="text-amber-500 flex-shrink-0 mt-0.5">▲</span>
                  {r}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="mt-4 flex gap-2">
          <button
            disabled
            className="flex-1 text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl py-2.5 cursor-not-allowed opacity-70"
            title="Approve (execution engine in Sprint 16)"
          >
            ✓ Approve — {initiative.requiredApproval.split(' (')[0]}
          </button>
          <Link
            href="/decisions"
            className="text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 rounded-xl py-2.5 px-4 hover:bg-slate-700 transition-colors"
          >
            See all
          </Link>
        </div>
      </div>
    </div>
  )
}
