import { PRODUCTS, AGENTS, ACTIVITIES, APPROVALS, HEALTH_SCORE, FINANCE, RECOMMENDATIONS, DECISION_ENGINE } from '@/lib/data'
import { getTrafficData } from '@/lib/datasources/ga4'
import { getVercelData }  from '@/lib/datasources/vercel'

import Briefing        from '@/components/dashboard/Briefing'
import TrafficPanel    from '@/components/dashboard/TrafficPanel'
import ProductsPanel   from '@/components/dashboard/ProductsPanel'
import AgentPanel      from '@/components/dashboard/AgentPanel'
import DeployPanel     from '@/components/dashboard/DeployPanel'
import SeoPanel        from '@/components/dashboard/SeoPanel'
import AlertsPanel     from '@/components/dashboard/AlertsPanel'
import RevenuePanel    from '@/components/dashboard/RevenuePanel'
import HealthPanel     from '@/components/dashboard/HealthPanel'
import DecisionCenter  from '@/components/assistant/DecisionCenter'
import AgentFeed       from '@/components/assistant/AgentFeed'
import TopOpportunity  from '@/components/assistant/TopOpportunity'
import { StatusPill }  from '@/components/widgets'
import Link from 'next/link'

const TODAY = new Date().toISOString().slice(0, 10)

export default function Dashboard() {
  const traffic = getTrafficData()
  const vercel  = getVercelData()
  const live    = PRODUCTS.filter(p => p.status === 'live')
  const online  = AGENTS.filter(a => a.status === 'operational').length
  const urgent  = APPROVALS.filter(a => (a.priority === 'P0' || a.priority === 'P1') && a.status === 'open').length
  const avgSeo  = live.length ? Math.round(live.reduce((s, p) => s + p.seoScore, 0) / live.length) : 0

  type StatColor = 'emerald' | 'amber' | 'red' | 'white'
  const statColorClass: Record<StatColor, string> = {
    emerald: 'text-emerald-400',
    amber:   'text-amber-400',
    red:     'text-red-400',
    white:   'text-white',
  }

  const QUICK_STATS: Array<{ value: string | number; label: string; sublabel: string; color: StatColor }> = [
    { value: live.length,   label: 'Products', sublabel: 'Live',      color: 'emerald' },
    { value: traffic.connected && traffic.visitors !== null ? traffic.visitors.toLocaleString() : '—', label: 'Visitors', sublabel: '/month', color: 'white' },
    { value: `${avgSeo}/100`, label: 'Avg SEO', sublabel: 'Portfolio', color: avgSeo >= 75 ? 'emerald' : avgSeo >= 55 ? 'amber' : 'red' },
    { value: `${online}/${AGENTS.length}`, label: 'Agents', sublabel: 'Online', color: online === AGENTS.length ? 'emerald' : 'amber' },
  ]

  return (
    <div className="min-h-screen">

      {/* Mobile sticky header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1f2937] px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500">DevOS</div>
          <h1 className="text-sm font-bold text-white">CEO Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          {urgent > 0 && (
            <Link href="/approvals"
              className="flex items-center gap-1.5 bg-red-400/10 border border-red-400/30 rounded-full px-2.5 py-1 text-xs text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              {urgent} urgent
            </Link>
          )}
          <StatusPill status="ok" label="Live" />
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <div>
            <div className="text-2xl font-bold text-white">CEO Dashboard</div>
            <p className="text-slate-400 text-sm mt-1">{TODAY}</p>
          </div>
          <StatusPill status="ok" label="All Systems Operational" />
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {QUICK_STATS.map(stat => (
            <div key={stat.label} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 text-center">
              <div className={`text-xl md:text-2xl font-bold tabular-nums ${statColorClass[stat.color]}`}>
                {stat.value}
              </div>
              <div className="text-xs text-white font-medium mt-1">{stat.label}</div>
              <div className="text-xs text-slate-600">{stat.sublabel}</div>
            </div>
          ))}
        </div>

        {/* #1 Recommendation — AI Decision Engine */}
        <div className="mb-5">
          <TopOpportunity initiative={DECISION_ENGINE.topRecommendation} />
        </div>

        {/* Today's Briefing */}
        <div className="mb-5">
          <Briefing
            products={PRODUCTS}
            agents={AGENTS}
            approvals={APPROVALS}
            healthScore={HEALTH_SCORE.total}
            today={TODAY}
          />
        </div>

        {/* Main grid — mobile: 1 col, tablet: 2 col, desktop: 3 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">

          <div className="md:col-span-2">
            <TrafficPanel data={traffic} />
          </div>

          <div>
            <HealthPanel health={HEALTH_SCORE} />
          </div>

          <div>
            <AlertsPanel approvals={APPROVALS} />
          </div>

          <div>
            <RevenuePanel finance={FINANCE} />
          </div>

          <div>
            <SeoPanel products={PRODUCTS} />
          </div>

          <div className="md:col-span-2 xl:col-span-1">
            <ProductsPanel products={PRODUCTS} />
          </div>

          <div className="md:col-span-2 xl:col-span-1">
            <DeployPanel data={vercel} />
          </div>

          {/* AI Recommendations — full width */}
          <div className="md:col-span-2 xl:col-span-3">
            <DecisionCenter recommendations={RECOMMENDATIONS.slice(0, 4)} />
          </div>

          {/* Agent pipeline — full width */}
          <div className="md:col-span-2 xl:col-span-3">
            <AgentPanel agents={AGENTS} />
          </div>

          {/* Agent Activity Feed — full width */}
          <div className="md:col-span-2 xl:col-span-3">
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div>
                  <h2 className="font-semibold text-white text-sm">Agent Activity</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Pipeline events · auto-logged by SDK</p>
                </div>
                <Link href="/activity" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                  View all →
                </Link>
              </div>
              <div className="px-5 pb-5">
                <AgentFeed activities={ACTIVITIES} limit={8} showDate={false} />
              </div>
            </div>
          </div>

        </div>

        {/* Data source status footer */}
        <div className="mt-6 pt-4 border-t border-[#1f2937]">
          <div className="text-xs text-slate-600 mb-2">Data sources · connect to replace mock data</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Internal (company/*.json)', connected: true },
              { label: 'Google Analytics 4',        connected: false },
              { label: 'Search Console',            connected: false },
              { label: 'Vercel API',                connected: false },
              { label: 'GitHub API',                connected: false },
              { label: 'Stripe',                    connected: false },
            ].map(s => (
              <span key={s.label}
                className={`text-xs border rounded-full px-2.5 py-0.5 ${
                  s.connected
                    ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                    : 'text-slate-600 border-slate-800'
                }`}>
                {s.connected ? '●' : '○'} {s.label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
