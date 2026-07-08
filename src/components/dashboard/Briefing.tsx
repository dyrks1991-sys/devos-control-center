import type { Product, Agent, Approval } from '@/lib/types'

interface BriefingProps {
  products:    Product[]
  agents:      Agent[]
  approvals:   Approval[]
  healthScore: number
  today:       string
}

function generateBriefing(products: Product[], agents: Agent[], approvals: Approval[], health: number): string {
  const live          = products.filter(p => p.status === 'live')
  const operational   = agents.filter(a => a.status === 'operational')
  const urgent        = approvals.filter(a => (a.priority === 'P0' || a.priority === 'P1') && a.status === 'open')
  const avgSeo        = live.length ? Math.round(live.reduce((s, p) => s + p.seoScore, 0) / live.length) : 0
  const analyticsReady = false // update when GA4 is live

  const lines: string[] = []

  // Opening status
  if (health >= 75) {
    lines.push(`DevOS is operating in good health (${health}/100). All ${operational.length} agents are online and the ${live.length}-product portfolio is live.`)
  } else if (health >= 50) {
    lines.push(`DevOS is operational with some areas needing attention (${health}/100). ${operational.length} of ${agents.length} agents online.`)
  } else {
    lines.push(`DevOS requires CEO attention today (health ${health}/100). Review alerts below.`)
  }

  // Analytics
  if (!analyticsReady) {
    lines.push(`Analytics is not yet connected — the company has no visibility into visitor traffic across any of the ${live.length} live products. Setting up GA4 is the highest-priority action to unblock Q3 growth measurement.`)
  }

  // SEO
  if (avgSeo >= 80) {
    lines.push(`SEO is strong across the portfolio (avg ${avgSeo}/100). Organic search discovery is in good shape.`)
  } else if (avgSeo >= 60) {
    lines.push(`SEO is improving (avg ${avgSeo}/100). QuickQR reached ${live.find(p => p.id === 'quickqr')?.seoScore ?? 'N/A'}/100 after the Sprint 12 optimization.`)
  } else {
    lines.push(`SEO needs attention (avg ${avgSeo}/100). Products may be difficult to find through organic search.`)
  }

  // Approvals
  if (urgent.length > 0) {
    lines.push(`There ${urgent.length === 1 ? 'is' : 'are'} ${urgent.length} urgent CEO decision${urgent.length === 1 ? '' : 's'} blocking progress. Top item: "${urgent[0].title}."`)
  } else {
    lines.push(`No urgent decisions are blocking development today.`)
  }

  // Q3 context
  lines.push(`Q3 target: 100 real users. Revenue: $0. Next sprint priority: connect analytics, then execute Product Hunt launch for OGImageGen.`)

  return lines.join(' ')
}

export default function Briefing({ products, agents, approvals, healthScore, today }: BriefingProps) {
  const text = generateBriefing(products, agents, approvals, healthScore)

  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#111827] border border-[#1f2937] rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h2 className="font-semibold text-white text-sm">Today&apos;s Briefing</h2>
          <p className="text-xs text-slate-500 mt-0.5">{today}</p>
        </div>
        <span className="text-xs text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 rounded-full px-2.5 py-1 shrink-0">
          AI Summary
        </span>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
    </div>
  )
}
