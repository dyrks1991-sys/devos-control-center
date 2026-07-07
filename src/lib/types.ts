// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  slug: string
  tagline: string
  url: string
  github: string
  status: 'live' | 'building' | 'planned' | 'paused' | 'archived'
  description: string
  elevatorPitch?: string
  qaScore: string
  seoScore: number
  launchDate: string
  techStack: string
  sprint: number
  // Growth / marketing fields
  keywords: string[]
  subreddits: string[]
  devtoTags: string[]
  audience: string[]
  features: string[]
  competitors: string[]
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export interface Agent {
  id: string
  name: string
  file: string
  status: 'operational' | 'degraded' | 'offline' | 'building'
  version: string
  sprint: number
  description: string
  lastRunAt?: string
  lastRunStatus?: 'success' | 'fail'
}

// ─── Events (Activity Feed) ───────────────────────────────────────────────────

export type ActivityType = 'deploy' | 'qa' | 'agent' | 'growth' | 'plan' | 'strategy' | 'brief'

export interface Activity {
  id: number
  date: string
  type: ActivityType
  description: string
  product?: string
  status: 'success' | 'fail' | 'info'
}

// ─── Decisions (CEO Approvals) ────────────────────────────────────────────────

export interface Approval {
  id: number
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  category: 'blocking' | 'growth' | 'strategic' | 'operational'
  status: 'open' | 'approved' | 'rejected' | 'deferred'
  title: string
  project: string
  description: string
  since: string
}

// ─── Growth Metrics ───────────────────────────────────────────────────────────

export interface GrowthMetric {
  productId: string
  seoScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  hasRobots: boolean
  hasSitemap: boolean
  analyticsConfigured: boolean
  topGap: string
  launchStatus: {
    reddit: boolean
    hackerNews: boolean
    productHunt: boolean
    devTo: boolean
  }
}

// ─── Finance ──────────────────────────────────────────────────────────────────

export interface FinanceLine {
  category: string
  monthly: number
  notes: string
}

// ─── Health Score ─────────────────────────────────────────────────────────────

export interface HealthScore {
  total: number
  breakdown: Array<{
    label: string
    score: number
    max: number
    color: 'emerald' | 'amber' | 'red' | 'blue'
  }>
}

// ─── KPI (placeholder — populated by Analytics Agent in Sprint 13) ────────────

export type KPISource = 'manual' | 'ga4' | 'vercel' | 'stripe' | 'github'
export type KPITrend  = 'up' | 'down' | 'flat' | 'unknown'

export interface KPI {
  id: string
  label: string
  value: number | string
  target?: number | string
  unit?: string
  trend?: KPITrend
  source: KPISource
  updatedAt: string
}
