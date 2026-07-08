import { Widget, Metric } from '@/components/widgets'
import type { FinanceLine } from '@/lib/types'

interface RevenuePanelProps {
  finance: FinanceLine[]
}

const Q3_REVENUE_TARGET = 500

export default function RevenuePanel({ finance }: RevenuePanelProps) {
  const totalBurn = finance.reduce((s, f) => s + f.monthly, 0)
  const revenue   = 0   // Phase 2: connect Stripe

  const FUTURE_SOURCES = [
    { label: 'Stripe (subscriptions)', note: 'Connect after first paid tier launch' },
    { label: 'Stripe (one-time)',       note: 'Premium feature purchases' },
    { label: 'Affiliate revenue',       note: 'DevOS tool cross-promotions' },
  ]

  return (
    <Widget title="Revenue" subtitle="Pre-revenue · Q3 target $500/mo" href="/finance">
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Metric value={`$${revenue}`} label="Monthly revenue" sublabel="Pre-revenue stage" color="slate" />
        <Metric value={`$${totalBurn}`} label="Monthly burn" sublabel="Vercel free tier" color="emerald" />
      </div>

      {/* Q3 progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Q3 Revenue Target</span>
          <span>${revenue} / ${Q3_REVENUE_TARGET}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-slate-600" style={{ width: `${(revenue / Q3_REVENUE_TARGET) * 100}%` }} />
        </div>
      </div>

      {/* Future sources */}
      <div className="pt-3 border-t border-[#1f2937]">
        <div className="text-xs text-slate-500 mb-2">Planned revenue sources</div>
        <div className="space-y-1.5">
          {FUTURE_SOURCES.map(s => (
            <div key={s.label} className="flex items-start gap-2 text-xs">
              <span className="text-slate-700 mt-0.5">○</span>
              <div>
                <span className="text-slate-400">{s.label}</span>
                <span className="text-slate-600"> · {s.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}
