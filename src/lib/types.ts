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

// ─── KPI ──────────────────────────────────────────────────────────────────────

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

// ─── Product KPI (per-product metrics row) ────────────────────────────────────

export interface ProductKPI {
  productId:   string
  visitors:    number | 'N/A'
  sessions:    number | 'N/A'
  seoScore:    number
  healthScore: number
  launchDate:  string
  growthStatus: 'growing' | 'stable' | 'not-started' | 'at-risk'
  lastUpdated:  string
  analyticsConnected: boolean
}

// ─── Q3 Target ────────────────────────────────────────────────────────────────

export interface Q3Target {
  label:   string
  current: number | string
  target:  number | string
  unit:    string
  percent: number
  status:  'on-track' | 'at-risk' | 'not-started'
  note:    string
}

// ─── AI Recommendation ────────────────────────────────────────────────────────

export type RecommendationPriority = 'P0' | 'P1' | 'P2' | 'P3'
export type RecommendationCategory =
  | 'analytics'
  | 'seo'
  | 'launch'
  | 'legal'
  | 'infrastructure'
  | 'revenue'
  | 'growth'

export interface Recommendation {
  id:            string
  priority:      RecommendationPriority
  title:         string
  reasoning:     string
  impact:        string
  estimatedTime: string
  category:      RecommendationCategory
  status:        'pending' | 'approved' | 'rejected' | 'deferred'
}

// ─── Company Timeline ─────────────────────────────────────────────────────────

export type TimelineEventType =
  | 'sprint'
  | 'deploy'
  | 'launch'
  | 'architecture'
  | 'growth'
  | 'milestone'
  | 'agent'

export interface TimelineEvent {
  id:          string
  date:        string
  type:        TimelineEventType
  title:       string
  description: string
  sprint?:     number
  product?:    string
  status?:     'success' | 'in-progress' | 'planned'
}

// ─── ROI Engine ───────────────────────────────────────────────────────────────

export type InitiativeCategory = 'analytics' | 'seo' | 'launch' | 'legal' | 'infrastructure' | 'revenue' | 'growth'

export interface ROIScores {
  expectedRevenue:    number  // 1–10: revenue potential
  expectedUsers:      number  // 1–10: user acquisition potential
  seoImpact:          number  // 1–10: SEO improvement
  developmentTime:    number  // 1–10: inverse — 10 = fastest
  codeReusability:    number  // 1–10: how reusable the code/pattern is
  technicalRisk:      number  // 1–10: inverse — 10 = zero risk
  maintenanceCost:    number  // 1–10: inverse — 10 = zero maintenance
  strategicAlignment: number  // 1–10: alignment with Q3 goals
  productSynergy:     number  // 1–10: benefit across existing products
  confidence:         number  // 1–10: confidence in the estimates
}

export interface Initiative {
  id:               string
  title:            string
  shortTitle:       string
  description:      string
  category:         InitiativeCategory
  status:           'pending' | 'approved' | 'rejected' | 'deferred' | 'completed'
  effort:           string
  scores:           ROIScores
  risks:            string[]
  requiredApproval: string
  sprintCompleted:  number | null
  notes:            string
  // computed by ROI engine:
  roiScore?:        number
  rank?:            number
}

// ─── What-if Simulation ───────────────────────────────────────────────────────

export interface SimulationOutcome {
  metric:  string
  before:  string | number
  after:   string | number
  delta:   string
  positive: boolean
}

export interface Scenario {
  id:           string
  title:        string
  description:  string
  initiativeId: string
  outcomes:     SimulationOutcome[]
  opportunityCost: string
  timeHorizon:  string
  confidence:   number  // 0–100
}

// ─── Learning Layer ───────────────────────────────────────────────────────────

export interface LearningRecord {
  id:         string
  sprint:     number
  initiative: string
  category:   InitiativeCategory | string
  completedDate: string | null
  expected: {
    users:          number
    seoGain:        number
    revenueUSD:     number
    durationSprints: number
    qualityScore:   number
  }
  actual: {
    users:          number | null
    seoGain:        number | null
    revenueUSD:     number | null
    durationSprints: number | null
    qualityScore:   number | null
  }
  delta:            Record<string, number | null>
  learnings:        string
  forecastAccuracy: number | null  // 0–1
}

// ─── Decision Engine Output ───────────────────────────────────────────────────

export interface DecisionEngineOutput {
  generatedAt:       string
  topRecommendation: Initiative
  alternatives:      Initiative[]
  allRanked:         Initiative[]
  scenarios:         Scenario[]
  learningInsights:  string[]
  avgForecastAccuracy: number | null
}
