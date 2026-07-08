import { DECISION_ENGINE, LEARNING } from '@/lib/data'
import TopOpportunity   from '@/components/assistant/TopOpportunity'
import OpportunityCard  from '@/components/assistant/OpportunityCard'
import WhatIfSimulator  from '@/components/assistant/WhatIfSimulator'
import { getRoiColor }  from '@/lib/intelligence/decisionEngine'
import { scoreBreakdown } from '@/lib/intelligence/roi'

const { topRecommendation, allRanked, scenarios, learningInsights, avgForecastAccuracy } = DECISION_ENGINE
const completedSprints = LEARNING.filter(l => l.completedDate !== null).length

export default function DecisionsPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">

      <div className="mb-6">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Sprint 15 · Decision Intelligence Engine</div>
        <h1 className="text-2xl font-bold text-white">Opportunity Ranking</h1>
        <p className="text-slate-400 text-sm mt-1">
          {allRanked.length} initiatives scored · ROI engine · {avgForecastAccuracy !== null ? `${Math.round(avgForecastAccuracy * 100)}% historical accuracy` : 'calibrating'}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white tabular-nums">{allRanked.length}</div>
          <div className="text-xs text-slate-500 mt-1">Initiatives Scored</div>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
          <div className={`text-2xl font-bold tabular-nums ${getRoiColor(topRecommendation.roiScore ?? 0)}`}>
            {topRecommendation.roiScore}
          </div>
          <div className="text-xs text-slate-500 mt-1">Top Score</div>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white tabular-nums">
            {avgForecastAccuracy !== null ? `${Math.round(avgForecastAccuracy * 100)}%` : '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1">Forecast Accuracy</div>
        </div>
      </div>

      {/* Top recommendation */}
      <div className="mb-6">
        <TopOpportunity initiative={topRecommendation} />
      </div>

      {/* Full ranking */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden mb-6">
        <div className="px-5 pt-5 pb-4 border-b border-[#1f2937]">
          <h2 className="font-semibold text-white text-sm">All Opportunities — Ranked by ROI</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Weighted score: Users (20%) · Revenue (15%) · Speed (15%) · Safety (10%) · Strategy (10%) · SEO (10%)
          </p>
        </div>
        <div className="px-5 divide-y divide-[#1f2937]">
          {allRanked.map(initiative => (
            <OpportunityCard key={initiative.id} initiative={initiative} showBreakdown={true} />
          ))}
        </div>
      </div>

      {/* ROI breakdown for top initiative */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden mb-6">
        <div className="px-5 pt-5 pb-4 border-b border-[#1f2937]">
          <h2 className="font-semibold text-white text-sm">ROI Score Breakdown — #{topRecommendation.rank} {topRecommendation.shortTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">All 10 factors that produced score {topRecommendation.roiScore}/100</p>
        </div>
        <div className="p-5 space-y-3">
          {scoreBreakdown(topRecommendation.scores)
            .sort((a, b) => b.weighted - a.weighted)
            .map(factor => (
            <div key={factor.label}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-300">{factor.label}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">×{factor.weight} weight</span>
                  <span className={`font-bold tabular-nums ${factor.score >= 7 ? 'text-emerald-400' : factor.score >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                    {factor.score}/10
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${factor.score >= 7 ? 'bg-emerald-500' : factor.score >= 5 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${factor.score * 10}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 tabular-nums w-10 text-right">+{factor.weighted}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What-if Simulator */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="font-semibold text-white text-sm">What-if Simulator</h2>
          <p className="text-xs text-slate-500 mt-0.5">Estimated outcomes for each strategic scenario</p>
        </div>
        <WhatIfSimulator scenarios={scenarios} />
      </div>

      {/* Learning Insights */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden mb-6">
        <div className="px-5 pt-5 pb-4 border-b border-[#1f2937]">
          <h2 className="font-semibold text-white text-sm">Learning Layer</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {completedSprints} completed sprints · patterns improve future ROI forecasts
          </p>
        </div>
        <div className="p-5 space-y-4">
          {learningInsights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-emerald-400 flex-shrink-0 mt-0.5 text-xs">→</span>
              <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sprint history */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-[#1f2937]">
          <h2 className="font-semibold text-white text-sm">Sprint Forecast History</h2>
          <p className="text-xs text-slate-500 mt-0.5">Expected vs actual — improving ROI model calibration</p>
        </div>
        <div className="divide-y divide-[#1f2937]">
          {LEARNING.sort((a, b) => b.sprint - a.sprint).map(record => (
            <div key={record.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Sprint {record.sprint}</div>
                  <div className="text-sm font-medium text-white leading-snug">{record.initiative}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  {record.forecastAccuracy !== null ? (
                    <div className={`text-sm font-bold ${record.forecastAccuracy >= 0.85 ? 'text-emerald-400' : record.forecastAccuracy >= 0.70 ? 'text-amber-400' : 'text-red-400'}`}>
                      {Math.round(record.forecastAccuracy * 100)}%
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">—</div>
                  )}
                  <div className="text-[10px] text-slate-600">accuracy</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-[#0f172a] rounded-lg px-3 py-2">
                  <div className="text-[10px] text-slate-600 mb-0.5">Expected Quality</div>
                  <div className="text-xs text-slate-400">{record.expected.qualityScore}/100</div>
                </div>
                <div className="bg-[#0f172a] rounded-lg px-3 py-2">
                  <div className="text-[10px] text-slate-600 mb-0.5">Actual Quality</div>
                  <div className={`text-xs ${record.actual.qualityScore !== null ? (record.actual.qualityScore >= record.expected.qualityScore ? 'text-emerald-400' : 'text-red-400') : 'text-slate-600'}`}>
                    {record.actual.qualityScore !== null ? `${record.actual.qualityScore}/100` : 'Measuring...'}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{record.learnings}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
