import { PRODUCTS, GROWTH_DATA, PRODUCT_KPIS, Q3_TARGETS } from '@/lib/data'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'not-started': 'text-slate-400 bg-slate-400/10 border-slate-700',
    'on-track':    'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    'at-risk':     'text-amber-400 bg-amber-400/10 border-amber-400/30',
    'growing':     'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    'stable':      'text-blue-400 bg-blue-400/10 border-blue-400/30',
  }
  const label: Record<string, string> = {
    'not-started': 'Not Started',
    'on-track':    'On Track',
    'at-risk':     'At Risk',
    'growing':     'Growing',
    'stable':      'Stable',
  }
  return (
    <span className={`text-xs border rounded px-2 py-0.5 ${map[status] ?? map['not-started']}`}>
      {label[status] ?? status}
    </span>
  )
}

function SeoBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-800 rounded-full h-1.5 max-w-[80px]">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-bold tabular-nums ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
        {score}
      </span>
    </div>
  )
}

function Q3ProgressBar({ percent, status }: { percent: number; status: string }) {
  const color = status === 'on-track' ? 'bg-emerald-400' : status === 'at-risk' ? 'bg-amber-400' : 'bg-slate-600'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-800 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <span className="text-xs text-slate-400 tabular-nums w-8 text-right">{percent}%</span>
    </div>
  )
}

export default function GrowthDashboard() {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Growth Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Q3 targets · SEO · KPI tracking · Launch readiness</p>
      </div>

      {/* Q3 Targets */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white">Q3 Targets</h2>
            <p className="text-xs text-slate-400 mt-0.5">Quarter 3 · {today}</p>
          </div>
          <span className="text-xs text-slate-500 border border-slate-700 rounded px-2 py-1">Target: 100 real users</span>
        </div>
        <div className="space-y-4">
          {Q3_TARGETS.map(t => (
            <div key={t.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white font-medium">{t.label}</span>
                  <StatusBadge status={t.status} />
                </div>
                <span className="text-xs text-slate-400 tabular-nums">
                  {String(t.current)}{t.unit} / {String(t.target)}{t.unit}
                </span>
              </div>
              <Q3ProgressBar percent={t.percent} status={t.status} />
              <p className="text-xs text-slate-500 mt-1">{t.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-product KPI table */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[#1f2937]">
          <h2 className="font-semibold text-white">Product KPIs</h2>
          <p className="text-xs text-slate-400 mt-0.5">Visitors and sessions update once GA4 is connected</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f2937]">
                {['Product', 'Visitors / mo', 'Sessions / mo', 'SEO Score', 'Launch Date', 'Analytics', 'Growth Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUCT_KPIS.map((kpi, i) => {
                const product = PRODUCTS.find(p => p.id === kpi.productId)
                return (
                  <tr key={kpi.productId} className={i < PRODUCT_KPIS.length - 1 ? 'border-b border-[#1f2937]' : ''}>
                    <td className="px-5 py-4 font-medium text-white">{product?.name}</td>
                    <td className="px-5 py-4 text-slate-400 tabular-nums">{typeof kpi.visitors === 'number' ? kpi.visitors.toLocaleString() : <span className="text-slate-600">N/A</span>}</td>
                    <td className="px-5 py-4 text-slate-400 tabular-nums">{typeof kpi.sessions === 'number' ? kpi.sessions.toLocaleString() : <span className="text-slate-600">N/A</span>}</td>
                    <td className="px-5 py-4"><SeoBar score={kpi.seoScore} /></td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{kpi.launchDate}</td>
                    <td className="px-5 py-4">
                      {kpi.analyticsConnected
                        ? <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded px-2 py-0.5">Connected</span>
                        : <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/30 rounded px-2 py-0.5">Not set up</span>
                      }
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={kpi.growthStatus} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO + Launch readiness row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* SEO Audit */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1f2937]">
            <h2 className="font-semibold text-white">SEO Audit</h2>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {GROWTH_DATA.map(g => {
              const product = PRODUCTS.find(p => p.id === g.productId)
              return (
                <div key={g.productId} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{product?.name}</span>
                    <SeoBar score={g.seoScore} />
                  </div>
                  <div className="flex gap-3 text-xs text-slate-400">
                    <span className={g.hasRobots ? 'text-emerald-400' : 'text-red-400'}>robots.txt {g.hasRobots ? '✓' : '✗'}</span>
                    <span className={g.hasSitemap ? 'text-emerald-400' : 'text-red-400'}>sitemap.xml {g.hasSitemap ? '✓' : '✗'}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{g.topGap}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Launch readiness */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1f2937]">
            <h2 className="font-semibold text-white">Launch Readiness</h2>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {GROWTH_DATA.map(g => {
              const product = PRODUCTS.find(p => p.id === g.productId)
              const channels = [
                { label: 'Reddit',       done: g.launchStatus.reddit },
                { label: 'Hacker News',  done: g.launchStatus.hackerNews },
                { label: 'Product Hunt', done: g.launchStatus.productHunt },
                { label: 'Dev.to',       done: g.launchStatus.devTo },
                { label: 'Analytics',    done: g.analyticsConfigured },
              ]
              const done  = channels.filter(c => c.done).length
              const total = channels.length
              return (
                <div key={g.productId} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{product?.name}</span>
                    <span className="text-xs text-slate-400">{done}/{total} ready</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {channels.map(c => (
                      <span key={c.label} className={`text-xs border rounded px-2 py-0.5 ${c.done ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5' : 'text-slate-500 border-slate-700'}`}>
                        {c.done ? '✓' : '○'} {c.label}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Traffic sources placeholder */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white">Traffic Sources</h2>
            <p className="text-xs text-slate-400 mt-0.5">Populated once GA4 is connected</p>
          </div>
          <span className="text-xs text-amber-400 border border-amber-400/30 bg-amber-400/5 rounded px-2 py-1">Awaiting Analytics</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Organic Search', icon: '🔍', value: '—', note: 'Primary Q3 channel' },
            { label: 'Direct',         icon: '🔗', value: '—', note: '' },
            { label: 'Referral',       icon: '↗',  value: '—', note: '' },
            { label: 'Social',         icon: '📣', value: '—', note: 'Product Hunt target' },
          ].map(s => (
            <div key={s.label} className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
              <div className="text-xl mb-2">{s.icon}</div>
              <div className="text-xs text-slate-400 font-medium mb-1">{s.label}</div>
              <div className="text-2xl font-bold text-slate-600">{s.value}</div>
              {s.note && <div className="text-xs text-slate-600 mt-1">{s.note}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
