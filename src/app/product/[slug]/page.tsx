import { notFound } from 'next/navigation'
import { PRODUCTS, RECOMMENDATIONS, HEALTH_SCORE } from '@/lib/data'
import { getVercelData } from '@/lib/datasources/vercel'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = PRODUCTS.find(p => p.slug === params.slug)
  if (!product) return { title: 'Not Found — DevOS' }
  return { title: `${product.name} — DevOS` }
}

// Hardcoded health scores until GA4 provides real data (same values as portfolio/page.tsx)
function productHealthScore(id: string): number {
  if (id === 'imagecompress') return 92
  if (id === 'ogimagegen')    return 72
  return 58
}

function seoColor(s: number) {
  if (s >= 80) return 'text-emerald-400'
  if (s >= 60) return 'text-amber-400'
  return 'text-red-400'
}
function seoBar(s: number) {
  if (s >= 80) return 'bg-emerald-500'
  if (s >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}
function healthColor(s: number) {
  if (s >= 80) return 'text-emerald-400'
  if (s >= 60) return 'text-amber-400'
  return 'text-red-400'
}

export default function ProductDetailPage({ params }: Props) {
  const product = PRODUCTS.find(p => p.slug === params.slug)
  if (!product) notFound()

  const vercel  = getVercelData()
  const deploy  = vercel.deployments.find(d =>
    d.projectId === product.id ||
    d.projectName.toLowerCase() === product.name.toLowerCase()
  )
  const health     = productHealthScore(product.id)
  const nextAction = RECOMMENDATIONS.find(r => r.status === 'pending')

  return (
    <div className="min-h-screen">
      {/* Mobile sticky header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1f2937] px-4 py-3 flex items-center gap-3">
        <Link href="/company#products" className="text-slate-500 active:text-slate-300 p-1 -m-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Product</div>
          <h1 className="text-sm font-bold text-white truncate">{product.name}</h1>
        </div>
        {product.status === 'live' && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2.5 py-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
          </span>
        )}
      </div>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Desktop breadcrumb */}
        <nav className="hidden md:flex items-center gap-2 mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/company#products" className="hover:text-slate-300 transition-colors">Company</Link>
          <span>›</span>
          <span className="text-white">{product.name}</span>
        </nav>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#0f172a] to-[#111827] border border-[#1f2937] rounded-2xl p-6 mb-5">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-3">
                {product.status === 'live' && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400
                                   bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                )}
                <span className="text-xs text-slate-600">Sprint {product.sprint}</span>
                <span className="text-xs text-slate-600">·</span>
                <span className="text-xs text-slate-600">{product.launchDate}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{product.name}</h1>
              <p className="text-slate-400 mt-1.5 text-sm md:text-base">{product.tagline}</p>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mt-4 md:mt-5">{product.description}</p>

          {product.elevatorPitch && (
            <blockquote className="mt-4 pl-4 border-l-2 border-indigo-400/40 text-sm text-indigo-300 italic leading-relaxed">
              &ldquo;{product.elevatorPitch}&rdquo;
            </blockquote>
          )}

          <div className="flex flex-wrap gap-3 mt-5">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/30
                         text-emerald-400 rounded-xl px-4 py-2.5 text-sm font-medium
                         hover:bg-emerald-400/20 transition-colors active:scale-95 duration-100"
            >
              ↗ Live URL
            </a>
            <a
              href={product.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-800 border border-[#1f2937]
                         text-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium
                         hover:bg-slate-700 transition-colors active:scale-95 duration-100"
            >
              GitHub →
            </a>
          </div>
        </div>

        {/* ── METRICS ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { value: `${product.seoScore}`, label: 'SEO Score', sub: '/100', colorClass: seoColor(product.seoScore) },
            { value: String(health),         label: 'Health',     sub: 'Score', colorClass: healthColor(health) },
            { value: '—',                    label: 'Traffic',    sub: 'Connect GA4', colorClass: 'text-slate-600' },
            { value: deploy?.status === 'ready' ? '✓' : '—', label: 'Deploy', sub: deploy?.status === 'ready' ? 'Live' : 'Unknown',
              colorClass: deploy?.status === 'ready' ? 'text-emerald-400' : 'text-slate-600' },
          ].map(m => (
            <div key={m.label} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 text-center">
              <div className={`text-2xl font-bold tabular-nums ${m.colorClass}`}>{m.value}</div>
              <div className="text-xs text-white font-medium mt-1">{m.label}</div>
              <div className="text-xs text-slate-600">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* SEO score bar */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-500 uppercase tracking-widest">SEO Score</div>
            <span className={`text-sm font-bold ${seoColor(product.seoScore)}`}>{product.seoScore}/100</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${seoBar(product.seoScore)}`} style={{ width: `${product.seoScore}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-700 mt-1">
            <span>0</span>
            <span>Target: 85</span>
            <span>100</span>
          </div>
        </div>

        {/* ── NEXT RECOMMENDED ACTION ───────────────────────────────── */}
        {nextAction && (
          <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">
                Next Recommended Action
              </span>
              <span className="text-xs text-slate-600 ml-auto">{nextAction.priority}</span>
            </div>
            <h3 className="text-white font-semibold mb-1 text-sm">{nextAction.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{nextAction.reasoning}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
              <span>Impact: <span className="text-slate-400">{nextAction.impact}</span></span>
              <span>Time: <span className="text-slate-400">{nextAction.estimatedTime}</span></span>
              <span>Category: <span className="text-slate-400">{nextAction.category}</span></span>
            </div>
          </div>
        )}

        {/* ── DEPLOY HISTORY ────────────────────────────────────────── */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden mb-5">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2937]">
            <div>
              <h2 className="font-semibold text-white text-sm">Deploy History</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {vercel.connected ? 'Vercel · live data' : 'Vercel · mock data'}
              </p>
            </div>
            {deploy?.status === 'ready' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live
              </span>
            )}
          </div>

          {deploy ? (
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-white font-medium">{deploy.commit}</div>
                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                    <div>Branch: <span className="font-mono">{deploy.branch}</span></div>
                    <div>Region: <span className="font-mono">{deploy.region}</span></div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs font-bold ${deploy.status === 'ready' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {deploy.status === 'ready' ? 'LIVE' : deploy.status.toUpperCase()}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{deploy.deployedAt}</div>
                  {deploy.duration > 0 && (
                    <div className="text-xs text-slate-700">{deploy.duration}s build</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-5 py-4 text-xs text-slate-600">
              No deployment record. Connect <code className="font-mono">VERCEL_TOKEN</code> for live history.
            </div>
          )}

          {!vercel.connected && (
            <div className="px-5 py-3 bg-amber-400/5 border-t border-amber-400/10">
              <p className="text-xs text-amber-400/80">
                Set <code className="font-mono bg-amber-900/20 px-1 rounded">VERCEL_TOKEN</code> in
                Vercel env vars for full deploy history.{' '}
                <Link href="/integrations" className="underline">Setup guide →</Link>
              </p>
            </div>
          )}
        </div>

        {/* ── PRODUCT DETAILS ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">Product Details</div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Tech Stack</div>
                <div className="font-mono text-xs text-slate-300 leading-relaxed">{product.techStack}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Launch Date</div>
                <div className="text-sm text-white">{product.launchDate}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">QA Score</div>
                <div className="text-sm text-emerald-400 font-bold">{product.qaScore}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">GitHub</div>
                <a href={product.github} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-indigo-400 hover:text-indigo-300 font-mono truncate block">
                  {product.github}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">Audience &amp; Features</div>
            <div className="mb-4">
              <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Target Audience</div>
              <div className="flex flex-wrap gap-1.5">
                {product.audience.map(a => (
                  <span key={a} className="text-xs bg-slate-800 text-slate-400 rounded-full px-2.5 py-1">{a}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Key Features</div>
              <ul className="space-y-1.5">
                {product.features.map(f => (
                  <li key={f} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-emerald-500 mt-px flex-shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── SEO KEYWORDS ──────────────────────────────────────────── */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 mb-5">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Target Keywords</div>
          <div className="flex flex-wrap gap-1.5">
            {product.keywords.map(k => (
              <span key={k} className="text-xs bg-indigo-400/10 text-indigo-300 border border-indigo-400/20 rounded-full px-2.5 py-1">
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* ── COMPETITION ───────────────────────────────────────────── */}
        {product.competitors.length > 0 && (
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Competitors</div>
            <div className="flex flex-wrap gap-1.5">
              {product.competitors.map(c => (
                <span key={c} className="text-xs bg-slate-800 text-slate-500 border border-slate-700 rounded-full px-2.5 py-1">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
