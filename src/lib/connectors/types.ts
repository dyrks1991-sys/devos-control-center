/**
 * Connector Layer — Shared Types
 *
 * Architecture:
 *   Connector<T>         — abstract: fetches data, wraps in ConnectorResult
 *   ConnectorResult<T>   — data + status + provenance metadata
 *   ConnectorManager     — aggregates all connectors, exposes ConnectorReport
 *
 * Separation:
 *   Connectors  → data fetching only (no UI, no business logic)
 *   db.ts       → data access (reads connectors, owns caching)
 *   intelligence → business logic, scoring, ranking
 *   Components  → rendering only — never import connectors directly
 */

export type ConnectorStatus =
  | 'connected'    // live data, credentials present, API responded
  | 'mock'         // no credentials — using built-in mock data
  | 'error'        // credentials present but API call failed
  | 'unconfigured' // credentials partially missing

export interface ConnectorMeta {
  name:        string
  description: string
  envVars:     string[]   // env vars required to activate
  setupUrl:    string     // URL where CEO can set up credentials
  apiDocs:     string     // API documentation URL
}

export interface ConnectorResult<T> {
  data:       T
  status:     ConnectorStatus
  source:     string       // 'GA4 Data API v1beta' | 'mock' | 'Vercel API v6' etc.
  error?:     string       // human-readable error if status === 'error'
  latencyMs?: number       // API call latency, undefined for mock
  fetchedAt:  string       // ISO timestamp
}

// ── GA4 ──────────────────────────────────────────────────────────────────────

export interface GA4DeviceBreakdown {
  desktop: number   // percent 0–100
  mobile:  number
  tablet:  number
}

export interface GA4CountryData {
  country: string
  percent: number
  sessions: number | null
}

export interface GA4TrafficSource {
  label:   string
  percent: number
  color:   string
}

export interface GA4PageData {
  path:     string
  views:    number | null
  product:  string
}

export interface GA4Data {
  period:        '7d' | '30d' | '90d'
  visitors:      number | null
  sessions:      number | null
  pageViews:     number | null
  bounceRate:    number | null   // 0–100
  avgSessionSec: number | null
  returningRate: number | null   // 0–100
  sources:       GA4TrafficSource[]
  topPages:      GA4PageData[]
  devices:       GA4DeviceBreakdown
  countries:     GA4CountryData[]
  connected:     boolean
}

// ── Search Console ────────────────────────────────────────────────────────────

export interface SearchConsoleQuery {
  query:       string
  clicks:      number
  impressions: number
  ctr:         number   // 0–1
  position:    number
}

export interface SearchConsolePage {
  url:         string
  product:     string
  clicks:      number
  impressions: number
  position:    number
}

export interface SearchConsoleData {
  period:      '7d' | '28d' | '90d'
  clicks:      number | null
  impressions: number | null
  ctr:         number | null         // 0–1
  avgPosition: number | null
  topQueries:  SearchConsoleQuery[]
  topPages:    SearchConsolePage[]
  indexedPages: number | null
  connected:   boolean
}

// ── GitHub ────────────────────────────────────────────────────────────────────

export interface GitHubCommit {
  sha:     string
  message: string
  author:  string
  date:    string
}

export interface GitHubPR {
  number:    number
  title:     string
  state:     'open' | 'closed' | 'merged'
  createdAt: string
}

export interface GitHubRepo {
  name:         string
  product:      string
  fullName:     string
  url:          string
  branch:       string
  recentCommits: GitHubCommit[]
  openPRs:      GitHubPR[]
  openIssues:   number
  buildStatus:  'passing' | 'failing' | 'unknown'
  contributors: number
  stars:        number
  lastPushAt:   string
}

export interface GitHubData {
  repos:     GitHubRepo[]
  connected: boolean
}

// ── Vercel ────────────────────────────────────────────────────────────────────

export type BuildStatus = 'ready' | 'building' | 'error' | 'canceled' | 'unknown'

export interface VercelDeployment {
  id:         string
  project:    string
  url:        string
  status:     BuildStatus
  branch:     string
  commitMsg:  string
  commitSha:  string
  createdAt:  string
  buildMs:    number | null
  region:     string
}

export interface VercelData {
  deployments:  VercelDeployment[]
  failedBuilds: number
  avgBuildMs:   number | null
  connected:    boolean
}

// ── Connector Report ──────────────────────────────────────────────────────────

export interface ConnectorReport {
  ga4:           ConnectorResult<GA4Data>
  searchConsole: ConnectorResult<SearchConsoleData>
  github:        ConnectorResult<GitHubData>
  vercel:        ConnectorResult<VercelData>
  generatedAt:   string
  connectedCount: number
  totalCount:    number
  overallStatus: 'all-connected' | 'partial' | 'all-mock'
  setupRequired: ConnectorMeta[]   // connectors that need CEO action
}
