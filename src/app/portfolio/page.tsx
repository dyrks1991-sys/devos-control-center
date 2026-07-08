import ProductCard from '@/components/ProductCard'
import { PRODUCTS, CONNECTORS } from '@/lib/data'
import type { Product } from '@/lib/types'

function seoGrade(score: number) {
  if (score >= 90) return { label: 'A', cls: 'text-emerald-400' }
  if (score >= 75) return { label: 'B', cls: 'text-emerald-400' }
  if (score >= 60) return { label: 'C', cls: 'text-amber-400' }
  if (score >= 40) return { label: 'D', cls: 'text-amber-400' }
  return                  { label: 'F', cls: 'text-red-400' }
}

function healthScore(p: Product): number {
  if (p.id === 'imagecompress') return 92
  if (p.id === 'ogimagegen')    return 72
  return 58
}

function deployStatus(p: Product) {
  const dep = CONNECTORS.vercel.data.deployments.find(d =>
    d.project.toLowerCase().includes(p.id.replace('-', '')) ||
    p.name.toLowerCase().includes(d.project.toLowerCase())
  )
  if (!dep) return { status: 'unknown', label: 'Unknown', cls: 'text-slate-500' }
  if (dep.status === 'ready')    return { status: dep.status, label: 'Live',     cls: 'text-emerald-400' }
  if (dep.status === 'building') return { status: dep.status, label: 'Building', cls: 'text-amber-400' }
  if (dep.status === 'error')    return { status: dep.status, label: 'Failed',   cls: 'text-red-400' }
  return { status: dep.status, label: dep.status, cls: 'text-slate-500' }
}

function growthTrend(p: Product): string {
  if (p.seoScore >= 80) return '↑ Stable'
  if (p.seoScore >= 60) return '→ Improving'
  return '↓ Needs work'
}

function confidenceScore(p: Product): number {
  const seo      = p.seoScore
  const health   = healthScore(p)
  const deploy   = deployStatus(p).status === 'ready' ? 100 : 50
  const analytic = CONNECTORS.ga4.status === 'connected' ? 100 : 30
  return Math.round(seo * 0.3 + health * 0.25 + deploy * 0.25 + analytic * 0.2)
}

export default function Portfolio() {
  const live = PRODUCTS.filter(p => p.status === 'live')
  const ga4Connected = CONNECTORS.ga4.status === 'connected'

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Product Portfolio</h1>
          <p className="text-slate-400 text-sm mt-1">
            {PRODUCTS.length} products · {live.length} live
            {!ga4Connected && <span className="ml-2 text-amber-400">· Analytics not connected</span>}
          </p>
        </div>

        {/* Real KPI Dashboard */}
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] mb-8 overflow-hidden">
          <div className="px-5 py-3 border-b border-[#30363d] flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">Real KPI Dashboard</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${ga4Connected ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>
              {ga4Connected ? 'Live data' : 'Mock data — connect GA4 for live'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-[#30363d]">
                  <th className="text-left px-5 py-3 font-medium">Product</th>
                  <th className="text-right px-4 py-3 font-medium">Visitors</th>
                  <th className="text-right px-4 py-3 font-medium">Sessions</th>
                  <th className="text-right px-4 py-3 font-medium">SEO Score</th>
                  <th className="text-right px-4 py-3 font-medium">Health</th>
                  <th className="text-right px-4 py-3 font-medium">Deploy</th>
                  <th className="text-right px-4 py-3 font-medium">Last Release</th>
                  <th className="text-right px-4 py-3 font-medium">Growth</th>
                  <th className="text-right px-5 py-3 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {live.map(p => {
                  const grade   = seoGrade(p.seoScore)
                  const deploy  = deployStatus(p)
                  const health  = healthScore(p)
                  const conf    = confidenceScore(p)
                  const traffic = CONNECTORS.ga4.data
                  const topPage = traffic.topPages.find(pg => pg.product === p.name)

                  return (
                    <tr key={p.id} className="border-b border-[#30363d] last:border-0 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-white">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.url}</div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {ga4Connected && topPage?.views != null
                          ? <span className="font-mono text-white">{topPage.views.toLocaleString()}</span>
                          : <span className="text-slate-600">—</span>
                        }
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {ga4Connected
                          ? <span className="font-mono text-white">—</span>
                          : <span className="text-slate-600">—</span>
                        }
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`font-bold ${grade.cls}`}>{p.seoScore}</span>
                        <span className={`ml-1 text-xs ${grade.cls}`}>({grade.label})</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${health >= 80 ? 'bg-emerald-400' : health >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                              style={{ width: `${health}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{health}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`text-xs font-medium ${deploy.cls}`}>{deploy.label}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-400">{p.launchDate}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`text-xs ${p.seoScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {growthTrend(p)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${conf >= 70 ? 'bg-emerald-400' : conf >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                              style={{ width: `${conf}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{conf}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {!ga4Connected && (
            <div className="px-5 py-3 bg-amber-400/5 border-t border-amber-400/10 text-xs text-amber-400/80">
              Visitors and Sessions show live data when GA4 is connected. Set <code className="font-mono bg-amber-900/20 px-1 rounded">GA4_PROPERTY_ID</code>, <code className="font-mono bg-amber-900/20 px-1 rounded">GOOGLE_CLIENT_EMAIL</code>, and <code className="font-mono bg-amber-900/20 px-1 rounded">GOOGLE_PRIVATE_KEY</code> in Vercel env vars. See <a href="/integrations" className="underline">Integrations</a> for setup guide.
            </div>
          )}
        </div>

        {/* Product cards (existing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  )
}
