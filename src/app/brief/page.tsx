import { PRODUCTS, AGENTS, APPROVALS, HEALTH_SCORE, LAST_UPDATED } from '@/lib/data'

const PRIORITIES = [
  {
    rank: 1,
    title: 'Configure analytics on all products',
    detail: 'Zero analytics on 3 live products. Cannot measure growth or make data-driven decisions. GA4 or Plausible setup takes ~2 hours. Required before Reddit, HN, or Product Hunt launches.',
    effort: '2 hours',
    priority: 'P1',
  },
  {
    rank: 2,
    title: 'Upgrade QuickQR SEO from 34/100',
    detail: 'QuickQR SEO score is the weakest in the portfolio at 34/100. ImageCompress was upgraded from the same score to 92/100 in Sprint 6 (robots.txt, sitemap, JSON-LD, OG tags, UI redesign). Same treatment for QuickQR would drive organic search traffic.',
    effort: '1 sprint (~0.5 day)',
    priority: 'P2',
  },
  {
    rank: 3,
    title: 'Launch on Reddit r/SideProject and r/webdev',
    detail: 'Social media launch drafts are written and ready in each product\'s growth/SOCIAL_MEDIA_PLAN.md. OGImageGen and ImageCompress are the strongest candidates for developer communities. No account required, no coordination needed.',
    effort: '1–2 hours',
    priority: 'P2',
  },
]

const RISKS = [
  { id: 'R1', title: 'touchcut blocked on 3 legal/CEO decisions', impact: 'High',   status: 'Active' },
  { id: 'R2', title: 'Zero analytics = no data for any decision',  impact: 'High',   status: 'Active' },
  { id: 'R3', title: 'No external validation (Reddit, HN, PH)',    impact: 'Medium', status: 'Active' },
  { id: 'R4', title: 'All products on Vercel free tier',           impact: 'Low',    status: 'Acceptable' },
]

const healthColor = (c: string) =>
  c === 'emerald' ? 'bg-emerald-500' : c === 'amber' ? 'bg-amber-500' : 'bg-red-500'

export default function CEOBrief() {
  const liveProd = PRODUCTS.filter(p => p.status === 'live').length
  const onlineAgents = AGENTS.filter(a => a.status === 'operational').length
  const urgentApprovals = APPROVALS.filter(a => a.priority === 'P0' || a.priority === 'P1').length

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Confidential — Internal</div>
          <h1 className="text-2xl font-bold text-white">CEO Brief</h1>
          <p className="text-slate-400 text-sm mt-1">{LAST_UPDATED}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${HEALTH_SCORE.total >= 80 ? 'text-emerald-400' : HEALTH_SCORE.total >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
            {HEALTH_SCORE.total}
          </div>
          <div className="text-xs text-slate-500">Health Score</div>
        </div>
      </div>

      {/* Situation */}
      <section className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-slate-300 uppercase text-xs tracking-widest mb-4">Situation</h2>
        <p className="text-slate-200 leading-relaxed">
          DevOS has {liveProd} products live in production — QuickQR, ImageCompress, and OGImageGen — all deployed within 3 days using a fully automated 7-agent pipeline. All {onlineAgents} agents are operational. The company is pre-revenue with zero monthly burn and an infinite runway. The critical next step is generating external validation and configuring analytics to move from building to growing.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-800">
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-400">{liveProd}</div>
            <div className="text-xs text-slate-500 mt-0.5">Live Products</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-400">{onlineAgents}/7</div>
            <div className="text-xs text-slate-500 mt-0.5">Agents Online</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-400">{urgentApprovals}</div>
            <div className="text-xs text-slate-500 mt-0.5">Urgent Decisions</div>
          </div>
        </div>
      </section>

      {/* Priorities */}
      <section className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-slate-300 uppercase text-xs tracking-widest mb-4">Today{"'"}s Priorities</h2>
        <div className="space-y-4">
          {PRIORITIES.map(p => (
            <div key={p.rank} className="flex gap-4">
              <div className="text-2xl font-bold text-slate-700 flex-shrink-0 w-6">{p.rank}</div>
              <div>
                <div className="font-medium text-white">{p.title}</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">{p.detail}</p>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-slate-500">Effort: <span className="text-slate-300">{p.effort}</span></span>
                  <span className="text-slate-500">Priority: <span className="text-slate-300">{p.priority}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Risks */}
      <section className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-slate-300 uppercase text-xs tracking-widest mb-4">Risks & Blockers</h2>
        <div className="space-y-3">
          {RISKS.map(r => (
            <div key={r.id} className="flex items-start gap-3 text-sm">
              <span className={`text-xs font-bold border rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5 ${r.impact === 'High' ? 'text-red-400 border-red-400/40' : r.impact === 'Medium' ? 'text-amber-400 border-amber-400/40' : 'text-slate-500 border-slate-700'}`}>
                {r.impact}
              </span>
              <span className="text-slate-300">{r.title}</span>
              <span className={`text-xs ml-auto flex-shrink-0 ${r.status === 'Active' ? 'text-red-400' : 'text-slate-500'}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Health breakdown */}
      <section className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
        <h2 className="font-semibold text-slate-300 uppercase text-xs tracking-widest mb-4">Health Score Breakdown</h2>
        <div className="space-y-3">
          {HEALTH_SCORE.breakdown.map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{item.label}</span>
                <span className={`font-medium ${item.color === 'emerald' ? 'text-emerald-400' : item.color === 'amber' ? 'text-amber-400' : 'text-red-400'}`}>{item.score}/100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${healthColor(item.color)}`} style={{ width: `${item.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
