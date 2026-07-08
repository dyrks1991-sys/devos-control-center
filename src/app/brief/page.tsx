import { PRODUCTS, AGENTS, APPROVALS, HEALTH_SCORE, ACTIVITIES, CONNECTORS } from '@/lib/data'
import { generateBriefing } from '@/lib/intelligence/briefing'

const TODAY = new Date().toISOString().slice(0, 10)

const STATUS_STYLES = {
  green:   { bar: 'bg-emerald-500', badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' },
  amber:   { bar: 'bg-amber-500',   badge: 'bg-amber-400/10 text-amber-400 border-amber-400/30' },
  red:     { bar: 'bg-red-500',     badge: 'bg-red-400/10 text-red-400 border-red-400/30' },
  neutral: { bar: 'bg-slate-600',   badge: 'bg-slate-700 text-slate-300 border-slate-600' },
}

const OVERALL_LABELS: Record<string, string> = {
  'operational':       'All Systems Operational',
  'attention-needed':  'Attention Required',
  'critical':          'Critical Issues',
}

export default function AIBriefPage() {
  const briefing     = generateBriefing(PRODUCTS, AGENTS, APPROVALS, HEALTH_SCORE, ACTIVITIES, TODAY, CONNECTORS)
  const overallStyle =
    briefing.overallStatus === 'operational'      ? STATUS_STYLES.green  :
    briefing.overallStatus === 'attention-needed' ? STATUS_STYLES.amber  : STATUS_STYLES.red

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">AI CEO Briefing · Confidential</div>
          <h1 className="text-2xl font-bold text-white">Today&apos;s Brief</h1>
          <p className="text-slate-400 text-sm mt-1">{TODAY} · ~{briefing.readTimeSeconds}s read</p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className={`text-3xl font-bold ${HEALTH_SCORE.total >= 80 ? 'text-emerald-400' : HEALTH_SCORE.total >= 65 ? 'text-amber-400' : 'text-red-400'}`}>
            {HEALTH_SCORE.total}
          </div>
          <div className="text-xs text-slate-500">Health Score</div>
        </div>
      </div>

      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 mb-6 ${overallStyle.badge}`}>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${overallStyle.bar} ${briefing.overallStatus !== 'operational' ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-medium">{OVERALL_LABELS[briefing.overallStatus]}</span>
      </div>

      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 mb-5">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Executive Summary</div>
        <p className="text-slate-200 leading-relaxed">{briefing.executiveSummary}</p>
      </div>

      <div className="space-y-4">
        {briefing.sections.map(section => {
          if (section.id === 'action') {
            return (
              <div key={section.id} className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <div className="text-xs text-emerald-400 uppercase tracking-widest font-medium">{section.heading}</div>
                </div>
                <p className="text-slate-200 leading-relaxed">{section.body}</p>
              </div>
            )
          }

          const styles = STATUS_STYLES[section.status]
          return (
            <div key={section.id} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">{section.heading}</div>
                <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${styles.badge}`}>
                  {section.status === 'green' ? 'OK' : section.status === 'amber' ? 'WARN' : section.status === 'red' ? 'ALERT' : 'INFO'}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{section.body}</p>
              {section.detail && section.detail.length > 0 && (
                <div className="border-t border-[#1f2937] pt-3 mt-3 space-y-1">
                  {section.detail.map((line, i) => (
                    <div key={i} className="text-xs text-slate-500 flex items-start gap-2">
                      <span className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${styles.bar}`} />
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 mt-4">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">Health Score Breakdown</div>
        <div className="space-y-3">
          {HEALTH_SCORE.breakdown.map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{item.label}</span>
                <span className={`font-medium tabular-nums ${item.color === 'emerald' ? 'text-emerald-400' : item.color === 'amber' ? 'text-amber-400' : 'text-red-400'}`}>
                  {item.score}/{item.max}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${item.color === 'emerald' ? 'bg-emerald-500' : item.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-700 text-center pb-4">
        Generated from live company data · Updates automatically on deploy
      </div>
    </div>
  )
}
