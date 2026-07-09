import { PRODUCTS, AGENTS, HEALTH_SCORE, TIMELINE, RECOMMENDATIONS } from '@/lib/data'
import { getVercelData } from '@/lib/datasources/vercel'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Company — DevOS' }

const TODAY = new Date().toISOString().slice(0, 10)

function seoColor(s: number) {
  if (s >= 80) return 'text-emerald-400'
  if (s >= 60) return 'text-amber-400'
  return 'text-red-400'
}
function seoBarColor(s: number) {
  if (s >= 80) return 'bg-emerald-500'
  if (s >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}
function agentStatusColor(status: string) {
  if (status === 'operational') return 'bg-emerald-400/10 text-emerald-400'
  if (status === 'degraded')    return 'bg-amber-400/10 text-amber-400'
  if (status === 'building')    return 'bg-blue-400/10 text-blue-400'
  return 'bg-slate-800 text-slate-500'
}
function timelineTypeColor(type: string) {
  const m: Record<string, string> = {
    sprint: 'text-indigo-400', deploy: 'text-emerald-400', launch: 'text-amber-400',
    milestone: 'text-yellow-400', architecture: 'text-blue-400', agent: 'text-purple-400', growth: 'text-pink-400',
  }
  return m[type] ?? 'text-slate-500'
}
function timelineDotColor(status?: string) {
  if (status === 'success')     return 'bg-emerald-400'
  if (status === 'in-progress') return 'bg-blue-400 animate-pulse'
  if (status === 'planned')     return 'bg-slate-600'
  return 'bg-emerald-400'
}

export default function CompanyPage() {
  const vercel = getVercelData()
  const live = PRODUCTS.filter(p => p.status === 'live')
  const operational = AGENTS.filter(a => a.status === 'operational')
  const avgSeo = live.length ? Math.round(live.reduce((s, p) => s + p.seoScore, 0) / live.length) : 0
  const topAction = RECOMMENDATIONS.find(r => r.status === 'pending')

  return (
    <div className="min-h-screen">
      {/* Mobile sticky header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1f2937] px-4 py-3">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest">DevOS</div>
        <h1 className="text-sm font-bold text-white">Company</h1>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Company</h1>
            <p className="text-slate-400 text-sm mt-1">{TODAY}</p>
          </div>
        </div>

        {/* Company vitals */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { value: live.length,  label: 'Products',  sub: 'Live',       color: 'text-emerald-400' },
            { value: HEALTH_SCORE.total, label: 'Health',  sub: 'Score', color: HEALTH_SCORE.total >= 75 ? 'text-emerald-400' : HEALTH_SCORE.total >= 55 ? 'text-amber-400' : 'text-red-400' },
            { value: `${operational.length}/${AGENTS.length}`, label: 'Agents', sub: 'Online', color: operational.length === AGENTS.length ? 'text-emerald-400' : 'text-amber-400' },
            { value: avgSeo,       label: 'Avg SEO',   sub: '/100',       color: avgSeo >= 80 ? 'text-emerald-400' : avgSeo >= 60 ? 'text-amber-400' : 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 text-center">
              <div className={`text-xl md:text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white font-medium mt-1">{s.label}</div>
              <div className="text-xs text-slate-600">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Sticky section nav */}
        <div className="sticky top-14 md:top-0 z-30 -mx-4 md:mx-0 px-4 md:px-0 py-3 mb-6
                        bg-[#0d1117]/95 backdrop-blur-md border-b border-[#1f2937] md:border-0">
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {['Products', 'Growth', 'Architecture', 'Team', 'Timeline'].map(s => (
              <a
                key={s}
                href={`#${s.toLowerCase()}`}
                className="shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full
                           bg-[#1f2937] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* ── PRODUCTS ──────────────────────────────────────────────── */}
        <section id="products" className="mb-12 scroll-mt-32">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Products</h2>
            <Link href="/portfolio" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Portfolio view →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {PRODUCTS.map(p => {
              const dep = vercel.deployments.find(d =>
                d.projectId === p.id || d.projectName.toLowerCase() === p.name.toLowerCase()
              )
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 flex flex-col gap-3
                             hover:border-slate-600 transition-all duration-150 active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {p.status === 'live' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                        )}
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{p.status}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{p.tagline}</p>
                    </div>
                    <span className="text-xs text-slate-700 ml-2 shrink-0">S{p.sprint}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className={`font-bold ${seoColor(p.seoScore)}`}>SEO {p.seoScore}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-emerald-400/70">QA {p.qaScore}</span>
                    {dep && (
                      <>
                        <span className="text-slate-700">·</span>
                        <span className={dep.status === 'ready' ? 'text-emerald-400' : 'text-amber-400'}>
                          {dep.status === 'ready' ? 'Live' : dep.status}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-700 truncate">{p.url}</div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1f2937]">
                    <span className="text-[10px] text-slate-700">Launched {p.launchDate}</span>
                    <span className="text-xs text-indigo-400">Details →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── GROWTH ────────────────────────────────────────────────── */}
        <section id="growth" className="mb-12 scroll-mt-32">
          <h2 className="text-base font-bold text-white mb-4">Growth</h2>

          {/* SEO scores */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 mb-4">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">SEO Portfolio</div>
            <div className="space-y-4">
              {live.map(p => (
                <div key={p.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <Link href={`/product/${p.slug}`} className="text-slate-300 hover:text-white transition-colors">
                      {p.name}
                    </Link>
                    <span className={`font-bold tabular-nums ${seoColor(p.seoScore)}`}>{p.seoScore}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${seoBarColor(p.seoScore)}`} style={{ width: `${p.seoScore}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Q3 targets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Real Users (Q3)', cur: '0', tgt: '100', unit: 'users', pct: 0, status: 'not-started', note: 'Configure GA4 to start measuring' },
              { label: 'Avg SEO Score',   cur: String(avgSeo), tgt: '85', unit: '/100', pct: Math.round(avgSeo / 85 * 100), status: avgSeo >= 70 ? 'on-track' : 'at-risk', note: `${avgSeo}/85 target — ${live.length} products measured` },
              { label: 'Products Live',   cur: String(live.length), tgt: '5', unit: '', pct: Math.round(live.length / 5 * 100), status: 'on-track', note: `${live.length}/5 launched` },
              { label: 'Monthly Revenue', cur: '$0', tgt: '$500', unit: '', pct: 0, status: 'not-started', note: 'Monetization sprint planned' },
            ].map(t => (
              <div key={t.label} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-300">{t.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === 'on-track'    ? 'bg-emerald-400/10 text-emerald-400' :
                    t.status === 'at-risk'     ? 'bg-amber-400/10 text-amber-400' :
                    'bg-slate-800 text-slate-500'
                  }`}>
                    {t.status === 'on-track' ? 'On Track' : t.status === 'at-risk' ? 'At Risk' : 'Not Started'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white tabular-nums mb-1">
                  {t.cur}
                  <span className="text-sm text-slate-600 font-normal ml-1">/ {t.tgt}{t.unit}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${t.pct > 0 ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    style={{ width: `${Math.min(100, t.pct)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600">{t.note}</p>
              </div>
            ))}
          </div>

          {/* Top action */}
          {topAction && (
            <div className="mt-4 bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Top Growth Action</span>
                <span className="text-xs text-slate-600 ml-auto">{topAction.priority}</span>
              </div>
              <div className="text-sm font-semibold text-white mt-1">{topAction.title}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{topAction.reasoning}</div>
            </div>
          )}
        </section>

        {/* ── ARCHITECTURE ──────────────────────────────────────────── */}
        <section id="architecture" className="mb-12 scroll-mt-32">
          <h2 className="text-base font-bold text-white mb-4">Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">Tech Stack per Product</div>
              <div className="space-y-4">
                {PRODUCTS.map(p => (
                  <div key={p.id}>
                    <div className="text-sm font-medium text-white mb-1">{p.name}</div>
                    <div className="text-xs text-slate-500 font-mono leading-relaxed">{p.techStack}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">Agent Pipeline</div>
              <div className="space-y-2">
                {AGENTS.map(a => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-[#1f2937] last:border-0">
                    <div>
                      <div className="text-sm text-white">{a.name}</div>
                      <div className="text-xs text-slate-600 font-mono">{a.file}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${agentStatusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 md:col-span-2">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">Data Architecture</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Data Layer',
                    items: ['company/*.json — canonical source', 'src/data/*.json — sync from company', 'src/lib/db.ts — typed access layer'],
                  },
                  {
                    title: 'Connector Layer',
                    items: ['GA4 — not connected', 'Search Console — not connected', 'GitHub — not connected', 'Vercel — not connected'],
                  },
                  {
                    title: 'Intelligence Layer',
                    items: ['Decision Engine', 'ROI Ranking', 'AI Briefing', 'Learning Layer', 'What-If Simulation'],
                  },
                ].map(col => (
                  <div key={col.title}>
                    <div className="text-xs font-semibold text-slate-300 mb-2">{col.title}</div>
                    <div className="space-y-1">
                      {col.items.map(item => (
                        <div key={item} className="text-xs font-mono text-slate-600">{item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TEAM / AGENTS ─────────────────────────────────────────── */}
        <section id="team" className="mb-12 scroll-mt-32">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Team / Agents</h2>
            <Link href="/agents" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Full view →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {AGENTS.map(a => (
              <div key={a.id} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{a.name}</h3>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">{a.file}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${agentStatusColor(a.status)}`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{a.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>v{a.version}</span>
                  <span>Sprint {a.sprint}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ──────────────────────────────────────────────── */}
        <section id="timeline" className="mb-12 scroll-mt-32">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Timeline</h2>
            <Link href="/timeline" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Full view →
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-[#1f2937]" />
            <div className="space-y-2">
              {TIMELINE.slice(0, 15).map(ev => (
                <div key={ev.id} className="relative pl-12 pb-1">
                  <div className={`absolute left-[17px] top-3 w-2 h-2 rounded-full border-2 border-[#0d1117] ${timelineDotColor(ev.status)}`} />
                  <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${timelineTypeColor(ev.type)}`}>
                        {ev.type}
                      </span>
                      <span className="text-xs text-slate-700">{ev.date}</span>
                    </div>
                    <div className="text-sm font-medium text-white">{ev.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{ev.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
