import type { Product, Agent, Approval, HealthScore, Activity } from '@/lib/types'
import type { ConnectorReport } from '@/lib/connectors/types'

export interface BriefingSection {
  id:      string
  heading: string
  body:    string
  status:  'green' | 'amber' | 'red' | 'neutral'
  detail?: string[]
}

export interface AIBriefing {
  date:            string
  executiveSummary: string
  readTimeSeconds: number
  overallStatus:   'operational' | 'attention-needed' | 'critical'
  sections:        BriefingSection[]
  topAction:       string
}

export function generateBriefing(
  products:    Product[],
  agents:      Agent[],
  approvals:   Approval[],
  health:      HealthScore,
  activities:  Activity[],
  date:        string,
  connectors?: ConnectorReport,
): AIBriefing {
  // Connector status enrichment — use real data when available
  const vercelConnected  = connectors?.vercel.status === 'connected'
  const connectedCount   = connectors?.connectedCount ?? 0
  const totalConnectors  = connectors?.totalCount ?? 4

  const live       = products.filter(p => p.status === 'live')
  const online     = agents.filter(a => a.status === 'operational')
  const p0Open     = approvals.filter(a => a.priority === 'P0' && a.status === 'open')
  const p1Open     = approvals.filter(a => a.priority === 'P1' && a.status === 'open')
  const avgSeo     = live.length ? Math.round(live.reduce((s, p) => s + p.seoScore, 0) / live.length) : 0
  const recentDeploy = activities.filter(a => a.type === 'deploy' && a.status === 'success').slice(0, 1)[0]
  const recentQA     = activities.filter(a => a.type === 'qa'     && a.status === 'success').slice(0, 1)[0]

  const overallStatus: AIBriefing['overallStatus'] =
    p0Open.length > 0      ? 'attention-needed' :
    health.total  < 70     ? 'attention-needed' :
    online.length < agents.length ? 'attention-needed' : 'operational'

  const sections: BriefingSection[] = []

  // 1. Company Health
  sections.push({
    id:      'health',
    heading: 'Company Health',
    body:    health.total >= 80
      ? `Company health is strong at ${health.total}/100. All core systems operational.`
      : health.total >= 65
      ? `Company health is ${health.total}/100. Minor gaps in analytics and revenue tracking. Engineering and deployment pipelines are solid.`
      : `Company health is ${health.total}/100. Notable gaps require attention.`,
    status:  health.total >= 80 ? 'green' : health.total >= 65 ? 'amber' : 'red',
    detail:  health.breakdown.map(b => `${b.label}: ${b.score}/${b.max}`),
  })

  // 2. Product Status
  const productLines = products.map(p => {
    const statusLabel = p.status === 'live' ? '✅ Live' : p.status === 'building' ? '🔧 Building' : '⏸ Planned'
    return `${p.name} — ${statusLabel} · SEO ${p.seoScore}/100`
  })
  sections.push({
    id:      'products',
    heading: 'Product Status',
    body:    `${live.length} of ${products.length} products are live in production. Average SEO score is ${avgSeo}/100.`,
    status:  live.length >= 3 ? 'green' : live.length >= 1 ? 'amber' : 'red',
    detail:  productLines,
  })

  // 3. Deployment Status (enriched with Vercel connector when available)
  const deployments = connectors?.vercel.data.deployments ?? []
  const failedBuilds = connectors?.vercel.data.failedBuilds ?? 0
  const vercelDetail = vercelConnected && deployments.length > 0
    ? deployments.slice(0, 3).map(d => `${d.project} — ${d.status === 'ready' ? '✅' : '⚠️'} ${d.status} · ${d.createdAt}`)
    : live.map(p => `${p.name} — vercel.com (free tier)`)
  sections.push({
    id:      'deployments',
    heading: 'Deployment Status',
    body:    vercelConnected
      ? `${deployments.filter(d => d.status === 'ready').length}/${deployments.length} deployments healthy.${failedBuilds > 0 ? ` ${failedBuilds} failed builds require attention.` : ' No failed builds.'}`
      : recentDeploy
      ? `Most recent successful deployment: ${recentDeploy.product || 'unknown'} on ${recentDeploy.date}. All products are on Vercel with automated CI/CD via the Deploy Agent.`
      : 'No recent deployments recorded. All products were last deployed via manual Vercel push.',
    status:  failedBuilds > 0 ? 'amber' : 'green',
    detail:  vercelDetail,
  })

  // 4. SEO Status
  const seoStatus =
    avgSeo >= 80 ? 'green' :
    avgSeo >= 60 ? 'amber' : 'red'
  const seoNotes = live.map(p =>
    `${p.name}: ${p.seoScore}/100${p.seoScore < 70 ? ' ⚠ below target' : ''}`
  )
  sections.push({
    id:      'seo',
    heading: 'SEO Status',
    body:    avgSeo >= 80
      ? `Portfolio SEO health is strong. Average score ${avgSeo}/100 across all live products.`
      : `Portfolio SEO average is ${avgSeo}/100. Search Console setup and sitemap submission are pending — completing these will accelerate Google indexing.`,
    status:  seoStatus,
    detail:  seoNotes,
  })

  // 5. Build Status
  const lastQALine = recentQA
    ? `Last QA run: ${recentQA.description} (${recentQA.date})`
    : 'No recent QA runs recorded.'
  sections.push({
    id:      'build',
    heading: 'Build Status',
    body:    `${online.length}/${agents.length} agents online and operational. 7-agent pipeline covers: Bootstrap → Developer → QA → Deploy → Growth → Planner → Strategy.`,
    status:  online.length === agents.length ? 'green' : 'amber',
    detail:  [lastQALine, ...online.map(a => `${a.name} v${a.version} — operational`)],
  })

  // 6. Open Alerts
  const allOpen  = approvals.filter(a => a.status === 'open')
  const alertBody = allOpen.length === 0
    ? 'No open decisions. All alerts resolved.'
    : `${allOpen.length} open decisions require attention. ${p0Open.length} are P0 critical (legal blockers on touchcut). ${p1Open.length} are P1 high-priority.`
  sections.push({
    id:      'alerts',
    heading: 'Open Alerts',
    body:    alertBody,
    status:  p0Open.length > 0 ? 'red' : p1Open.length > 0 ? 'amber' : 'green',
    detail:  allOpen.map(a => `[${a.priority}] ${a.title} — ${a.project}`),
  })

  // Connector integration status section
  if (connectors && connectedCount < totalConnectors) {
    const missing = connectors.setupRequired.map(m => `${m.name}: set ${m.envVars[0]}`)
    sections.push({
      id:      'integrations',
      heading: 'Data Connections',
      body:    `${connectedCount}/${totalConnectors} external connections active. ${connectedCount === 0 ? 'All data is mock — activate connectors to see real company metrics.' : 'Partial real data active.'}`,
      status:  connectedCount === 0 ? 'amber' : 'green',
      detail:  missing,
    })
  }

  // 7. Recommended Next Action
  const topAction = p0Open.length
    ? 'Resolve legal blockers on touchcut (P0 — blocks entire product)'
    : connectedCount === 0
    ? 'Connect VERCEL_TOKEN + GITHUB_TOKEN (10 min) to activate live deployment and commit data'
    : 'Connect Google Analytics 4 to all 3 products (2 hours — activates growth measurement)'

  sections.push({
    id:      'action',
    heading: 'Recommended Next Action',
    body:    topAction,
    status:  'neutral',
  })

  // Executive summary (30-second read)
  const dataQuality = connectedCount === totalConnectors ? 'live data' : connectedCount > 0 ? 'partial live data' : 'mock data'
  const executiveSummary =
    `DevOS is ${overallStatus === 'operational' ? 'fully operational' : 'operational with items requiring attention'} — ${live.length} products live, ${online.length}/${agents.length} agents online, company health ${health.total}/100 (${dataQuality}). ` +
    (p0Open.length ? `${p0Open.length} P0 legal blocker${p0Open.length > 1 ? 's' : ''} on touchcut remain unresolved. ` : '') +
    `Average portfolio SEO is ${avgSeo}/100${avgSeo < 80 ? ' — Search Console submission pending' : ''}. ` +
    (connectedCount < totalConnectors ? `${totalConnectors - connectedCount} connector${totalConnectors - connectedCount > 1 ? 's' : ''} need setup to see real data. ` : '') +
    `Priority action: ${topAction.split('(')[0].trim()}.`

  return {
    date,
    executiveSummary,
    readTimeSeconds: 25,
    overallStatus,
    sections,
    topAction,
  }
}
