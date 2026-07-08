/**
 * GA4 Datasource
 *
 * Migration path:
 *   Phase 1 (now): returns MOCK data
 *   Phase 2: replace body with GA4 Data API call (requires service account)
 *   Phase 3: fetch('/api/analytics') — backend proxy handles auth
 *
 * Shape contract: the interface below never changes across phases.
 * Only the implementation inside get*() changes.
 */

export interface TrafficData {
  period:           '7d' | '30d' | '90d'
  visitors:         number | null   // null = not configured
  sessions:         number | null
  pageViews:        number | null
  bounceRate:       number | null   // 0–100
  avgSessionSec:    number | null
  returningRate:    number | null   // 0–100
  sources: Array<{
    label:   string
    percent: number
    color:   string
  }>
  topPages: Array<{
    path:     string
    views:    number | null
    product:  string
  }>
  connected: boolean
}

const MOCK: TrafficData = {
  period:        '30d',
  visitors:      null,
  sessions:      null,
  pageViews:     null,
  bounceRate:    null,
  avgSessionSec: null,
  returningRate: null,
  connected:     false,
  sources: [
    { label: 'Organic Search', percent: 0, color: '#10b981' },
    { label: 'Direct',         percent: 0, color: '#6366f1' },
    { label: 'Referral',       percent: 0, color: '#f59e0b' },
    { label: 'Social',         percent: 0, color: '#ec4899' },
  ],
  topPages: [
    { path: '/', views: null, product: 'QuickQR' },
    { path: '/', views: null, product: 'ImageCompress' },
    { path: '/', views: null, product: 'OGImageGen' },
  ],
}

export function getTrafficData(): TrafficData {
  const isConnected = process.env.NEXT_PUBLIC_GA_ID != null
  if (!isConnected) return MOCK

  // Phase 2: fetch from GA4 Data API
  // const response = await fetch('/api/analytics?period=30d')
  // return response.json()
  return { ...MOCK, connected: true }
}
