/**
 * db.ts — DevOS Control Center data access layer
 *
 * Reads from src/data/*.json (committed, synced from company/*.json by prebuild).
 *
 * Migration guide: when a backend is available, replace each function body with
 * a fetch() call to the corresponding API endpoint. The function signatures and
 * return types do not change — only the data source does.
 *
 *   Phase 1 (now):    import from src/data/*.json (static, baked at build time)
 *   Phase 2 (Sprint): import from Vercel KV (live, refreshed per-request)
 *   Phase 3 (Scale):  fetch('/api/products') (full backend, auth, caching)
 */

import type { Product, Agent, Activity, Approval, GrowthMetric, FinanceLine, HealthScore, KPI, ProductKPI, TimelineEvent, Recommendation, Initiative, LearningRecord, DecisionEngineOutput } from './types'
import { generateRecommendations }  from './intelligence/recommendations'
import { runDecisionEngine }        from './intelligence/decisionEngine'
import { getConnectorReport as _getConnectorReport } from './connectors/connectorManager'

import productsRaw    from '../data/products.json'
import agentsRaw      from '../data/agents.json'
import decisionsRaw   from '../data/decisions.json'
import eventsRaw      from '../data/events.json'
import timelineRaw    from '../data/timeline.json'
import initiativesRaw from '../data/initiatives.json'
import learningRaw    from '../data/learning.json'

// ─── Products ─────────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  return productsRaw as Product[]
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find(p => p.id === id)
}

export function getLiveProducts(): Product[] {
  return getProducts().filter(p => p.status === 'live')
}

// ─── Agents ───────────────────────────────────────────────────────────────────

export function getAgents(): Agent[] {
  return agentsRaw as Agent[]
}

export function getAgent(id: string): Agent | undefined {
  return getAgents().find(a => a.id === id)
}

export function getOperationalAgents(): Agent[] {
  return getAgents().filter(a => a.status === 'operational')
}

// ─── Events (Activity Feed) ───────────────────────────────────────────────────

export function getEvents(limit?: number): Activity[] {
  const events = eventsRaw as Activity[]
  return limit ? events.slice(0, limit) : events
}

// ─── Decisions (CEO Approvals) ────────────────────────────────────────────────

export function getDecisions(): Approval[] {
  return decisionsRaw as Approval[]
}

export function getOpenDecisions(): Approval[] {
  return getDecisions().filter(d => d.status === 'open')
}

export function getUrgentDecisions(): Approval[] {
  return getOpenDecisions().filter(d => d.priority === 'P0' || d.priority === 'P1')
}

// ─── Growth Metrics ───────────────────────────────────────────────────────────
// Derived from products.json — no separate file needed.
// Phase 2: replaced by Growth Agent writing to devos-state.json.

function seoGrade(score: number): GrowthMetric['grade'] {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

export function getGrowthMetrics(): GrowthMetric[] {
  return getLiveProducts().map(p => ({
    productId:            p.id,
    seoScore:             p.seoScore,
    grade:                seoGrade(p.seoScore),
    hasRobots:            p.id === 'imagecompress' || p.id === 'quickqr',
    hasSitemap:           p.id === 'imagecompress' || p.id === 'quickqr',
    analyticsConfigured:  false,
    topGap:               p.id === 'quickqr'       ? 'SEO sprint complete — connect GA4 + submit to Search Console'
                        : p.id === 'imagecompress' ? 'Analytics not configured — add GA4 Measurement ID to Vercel env'
                        : 'SEO 57/100 — missing FAQ content, OG image needed, submit to Search Console',
    launchStatus: { reddit: false, hackerNews: false, productHunt: false, devTo: false },
  }))
}

// ─── Finance ──────────────────────────────────────────────────────────────────
// Static for now — placeholder for future Stripe / accounting integration.

export function getFinance(): FinanceLine[] {
  return [
    { category: 'Vercel Hosting', monthly: 0, notes: 'Free tier — 4 projects deployed' },
    { category: 'GitHub',         monthly: 0, notes: 'Free tier — public repos' },
    { category: 'Domain Names',   monthly: 0, notes: 'Using .vercel.app subdomains' },
    { category: 'Design Tools',   monthly: 0, notes: 'No paid design tools used' },
    { category: 'Analytics',      monthly: 0, notes: 'Not yet configured' },
  ]
}

// ─── Health Score ─────────────────────────────────────────────────────────────
// Computed from live data. Scores update automatically as products.json changes.

export function getHealthScore(): HealthScore {
  const products       = getLiveProducts()
  const agents         = getOperationalAgents()
  const allAgents      = getAgents()
  const urgentOpen     = getUrgentDecisions().length
  const avgSeo         = products.length > 0
    ? Math.round(products.reduce((s, p) => s + p.seoScore, 0) / products.length)
    : 0

  const pipelineScore  = allAgents.length > 0
    ? Math.round((agents.length / allAgents.length) * 100)
    : 0
  const productsScore  = Math.min(90, 60 + products.length * 10)
  const growthScore    = Math.round(avgSeo * 0.5)
  const analyticsScore = 0   // Sprint 13: replace with actual GA4 check
  const financeScore   = 90  // Zero burn = high score; update when revenue exists

  const total = Math.round(
    pipelineScore  * 0.25 +
    productsScore  * 0.20 +
    growthScore    * 0.20 +
    analyticsScore * 0.20 +
    financeScore   * 0.15
  )

  return {
    total,
    breakdown: [
      { label: 'Pipeline',  score: pipelineScore,  max: 100, color: pipelineScore  >= 80 ? 'emerald' : pipelineScore  >= 50 ? 'amber' : 'red' },
      { label: 'Products',  score: productsScore,  max: 100, color: productsScore  >= 80 ? 'emerald' : productsScore  >= 50 ? 'amber' : 'red' },
      { label: 'Growth',    score: growthScore,    max: 100, color: growthScore    >= 60 ? 'emerald' : growthScore    >= 30 ? 'amber' : 'red' },
      { label: 'Analytics', score: analyticsScore, max: 100, color: analyticsScore >= 50 ? 'emerald' : analyticsScore  > 0 ? 'amber' : 'red' },
      { label: 'Finance',   score: financeScore,   max: 100, color: 'emerald' },
    ],
  }
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────
// KPI data structure ready for GA4 ingestion. Until analytics is live, traffic
// metrics show 'N/A' — the structure is stable and won't change when GA4 connects.

export function getKPIs(): KPI[] {
  const products = getLiveProducts()
  const avgSeo   = Math.round(products.reduce((s, p) => s + p.seoScore, 0) / (products.length || 1))
  return [
    { id: 'monthly-visitors', label: 'Monthly Visitors',  value: 'N/A',           target: 100,   unit: '',       trend: 'unknown', source: 'ga4',    updatedAt: '2026-07-07' },
    { id: 'monthly-sessions', label: 'Monthly Sessions',  value: 'N/A',           target: 150,   unit: '',       trend: 'unknown', source: 'ga4',    updatedAt: '2026-07-07' },
    { id: 'page-views',       label: 'Page Views',        value: 'N/A',           target: 300,   unit: '',       trend: 'unknown', source: 'ga4',    updatedAt: '2026-07-07' },
    { id: 'avg-seo-score',    label: 'Avg SEO Score',     value: avgSeo,          target: 85,    unit: '/100',   trend: avgSeo > 60 ? 'up' : 'flat', source: 'manual', updatedAt: '2026-07-07' },
    { id: 'products-live',    label: 'Products Live',     value: products.length, target: 5,     unit: '',       trend: 'up',      source: 'manual', updatedAt: '2026-07-07' },
    { id: 'monthly-revenue',  label: 'Monthly Revenue',   value: '$0',            target: '$500', unit: '',      trend: 'flat',    source: 'stripe', updatedAt: '2026-07-07' },
  ]
}

// ─── Q3 Target ────────────────────────────────────────────────────────────────

export function getQ3Targets(): import('./types').Q3Target[] {
  const products = getLiveProducts()
  const avgSeo   = Math.round(products.reduce((s, p) => s + p.seoScore, 0) / (products.length || 1))
  return [
    {
      label:   'Real Users (Q3)',
      current: 0,
      target:  100,
      unit:    'users',
      percent: 0,
      status:  'not-started',
      note:    'Analytics not yet connected — configure GA4 to start measuring',
    },
    {
      label:   'Average SEO Score',
      current: avgSeo,
      target:  85,
      unit:    '/100',
      percent: Math.round((avgSeo / 85) * 100),
      status:  avgSeo >= 70 ? 'on-track' : 'at-risk',
      note:    'QuickQR SEO sprint in progress — target 85+ across all products',
    },
    {
      label:   'Products Live',
      current: products.length,
      target:  5,
      unit:    'products',
      percent: Math.round((products.length / 5) * 100),
      status:  'on-track',
      note:    'On track — new product planned for Sprint 14',
    },
    {
      label:   'Monthly Revenue',
      current: '$0',
      target:  '$500',
      unit:    '',
      percent: 0,
      status:  'not-started',
      note:    'Monetization sprint planned for Sprint 15 after traffic data is available',
    },
  ]
}

// ─── Product KPIs (per-product tracking row) ─────────────────────────────────

export function getProductKPIs(): ProductKPI[] {
  return getLiveProducts().map(p => ({
    productId:          p.id,
    visitors:           'N/A',
    sessions:           'N/A',
    seoScore:           p.seoScore,
    healthScore:        p.id === 'imagecompress' ? 92 : p.id === 'ogimagegen' ? 72 : 58,
    launchDate:         p.launchDate,
    growthStatus:       (p.seoScore >= 80 ? 'stable' : 'not-started') as ProductKPI['growthStatus'],
    lastUpdated:        p.launchDate,
    analyticsConnected: false,
  }))
}

// ─── Company Timeline ─────────────────────────────────────────────────────────

export function getTimeline(): TimelineEvent[] {
  return (timelineRaw as TimelineEvent[]).sort((a, b) => b.date.localeCompare(a.date))
}

// ─── AI Recommendations (Sprint 14 — kept for backward compat) ───────────────

export function getRecommendations(): Recommendation[] {
  return generateRecommendations(getProducts(), getDecisions(), getHealthScore())
}

// ─── Initiatives + ROI Engine (Sprint 15) ────────────────────────────────────

export function getInitiatives(): Initiative[] {
  return initiativesRaw as Initiative[]
}

// ─── Learning Layer (Sprint 15) ───────────────────────────────────────────────

export function getLearningRecords(): LearningRecord[] {
  return learningRaw as unknown as LearningRecord[]
}

// ─── Decision Engine (Sprint 15) — orchestrates ROI + ranking + simulation ───

export function getDecisionEngineOutput(): DecisionEngineOutput {
  return runDecisionEngine(getInitiatives(), getLearningRecords())
}

// ─── Connector Layer (Sprint 16) ─────────────────────────────────────────────

export function getConnectorReport() {
  return _getConnectorReport()
}

// ─── Summary Stats (used by overview page) ───────────────────────────────────

export function getCompanyStats() {
  const products = getLiveProducts()
  const agents   = getAgents()
  return {
    productsLive:    products.length,
    agentsOnline:    getOperationalAgents().length,
    agentsTotal:     agents.length,
    urgentApprovals: getUrgentDecisions().length,
    monthlyRevenue:  '$0',
    lastUpdated:     '2026-07-07',
  }
}
