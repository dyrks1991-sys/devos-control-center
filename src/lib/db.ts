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

import type { Product, Agent, Activity, Approval, GrowthMetric, FinanceLine, HealthScore, KPI } from './types'

import productsRaw  from '../data/products.json'
import agentsRaw    from '../data/agents.json'
import decisionsRaw from '../data/decisions.json'
import eventsRaw    from '../data/events.json'

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
    hasRobots:            p.id === 'imagecompress',
    hasSitemap:           p.id === 'imagecompress',
    analyticsConfigured:  false,
    topGap:               p.id === 'quickqr'       ? 'Missing robots.txt, sitemap, JSON-LD, all OG/Twitter tags'
                        : p.id === 'imagecompress' ? 'Analytics not configured (analytics.ts stubs only)'
                        : 'Vercel preview URL — robots.txt blocked by platform; needs production domain',
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
// Placeholder KPIs — populated by Analytics Agent (Sprint 13) and future agents.

export function getKPIs(): KPI[] {
  const products = getLiveProducts()
  return [
    { id: 'products-live',    label: 'Products Live',     value: products.length,  target: 10,    unit: '',       trend: 'up',      source: 'manual',  updatedAt: '2026-07-07' },
    { id: 'agents-online',    label: 'Agents Online',     value: getOperationalAgents().length, target: 7, unit: '', trend: 'flat', source: 'manual', updatedAt: '2026-07-07' },
    { id: 'monthly-revenue',  label: 'Monthly Revenue',   value: 0,                target: 1000,  unit: '$',      trend: 'flat',    source: 'stripe',  updatedAt: '2026-07-07' },
    { id: 'monthly-visitors', label: 'Monthly Visitors',  value: 'N/A',            target: 10000, unit: '',       trend: 'unknown', source: 'ga4',     updatedAt: '2026-07-07' },
    { id: 'avg-seo-score',    label: 'Avg SEO Score',     value: Math.round(products.reduce((s,p) => s + p.seoScore, 0) / (products.length || 1)), target: 85, unit: '/100', trend: 'unknown', source: 'manual', updatedAt: '2026-07-07' },
  ]
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
