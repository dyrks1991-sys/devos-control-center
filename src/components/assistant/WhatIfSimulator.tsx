import type { Scenario } from '@/lib/types'

interface Props {
  scenarios: Scenario[]
}

export default function WhatIfSimulator({ scenarios }: Props) {
  return (
    <div className="space-y-4">
      {scenarios.map(scenario => (
        <div key={scenario.id} className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-[#1f2937]">
            <h3 className="font-semibold text-white text-sm">{scenario.title}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{scenario.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <span>Confidence: <span className={`font-medium ${scenario.confidence >= 70 ? 'text-emerald-400' : scenario.confidence >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{scenario.confidence}%</span></span>
              <span>·</span>
              <span>{scenario.timeHorizon}</span>
            </div>
          </div>

          {/* Outcomes table */}
          <div className="divide-y divide-[#1f2937]">
            {scenario.outcomes.map((o, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                <div className="w-36 text-xs text-slate-500 flex-shrink-0">{o.metric}</div>
                <div className="text-xs text-slate-400 w-16 flex-shrink-0 tabular-nums">{o.before}</div>
                <div className="text-slate-600 flex-shrink-0">→</div>
                <div className="text-xs font-medium text-slate-200 flex-shrink-0">{o.after}</div>
                <div className={`ml-auto text-[11px] font-medium flex-shrink-0 ${o.positive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {o.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Opportunity cost */}
          <div className="px-5 py-3 bg-amber-400/5 border-t border-amber-400/10">
            <div className="text-[10px] text-amber-400 uppercase tracking-wide mb-1">Opportunity Cost</div>
            <p className="text-xs text-slate-400 leading-relaxed">{scenario.opportunityCost}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
