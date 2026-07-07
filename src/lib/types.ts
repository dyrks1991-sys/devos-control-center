export interface Product {
  id: string
  name: string
  url: string
  github: string
  status: 'live' | 'blocked' | 'planned'
  description: string
  qaScore: string
  seoScore: number
  launchDate: string
  techStack: string
  sprint: number
}

export interface Agent {
  id: string
  name: string
  file: string
  status: 'operational' | 'degraded' | 'offline'
  version: string
  sprint: number
  description: string
}

export type ActivityType = 'deploy' | 'qa' | 'agent' | 'growth' | 'plan'

export interface Activity {
  id: number
  date: string
  type: ActivityType
  description: string
  product?: string
  status: 'success' | 'fail' | 'info'
}

export interface Approval {
  id: number
  priority: 'P0' | 'P1' | 'P2'
  category: 'blocking' | 'growth'
  title: string
  project: string
  description: string
  since: string
}

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

export interface FinanceLine {
  category: string
  monthly: number
  notes: string
}
