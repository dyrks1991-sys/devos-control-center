/**
 * Connector Manager
 *
 * Aggregates all 4 connectors into a single ConnectorReport.
 * This is the single entry point for the connector layer.
 *
 * Usage (Server Component only):
 *   import { getConnectorReport } from '@/lib/connectors'
 *   const report = getConnectorReport()      // sync — uses mock data
 *
 * Architecture:
 *   - Connectors are isolated: adding a new one requires only a new file + registration here
 *   - No connector has access to UI components
 *   - Business logic (ROI, scoring) lives in src/lib/intelligence/, not here
 *   - Decision engine reads from db.ts, which calls this manager
 */

import { getGA4Data, GA4_META }                         from './ga4'
import { getSearchConsoleData, SEARCH_CONSOLE_META }    from './searchConsole'
import { getGitHubDataSync, GITHUB_META }               from './github'
import { getVercelDataSync, VERCEL_META }               from './vercel'
import type { ConnectorReport, ConnectorStatus }         from './types'

function countConnected(statuses: ConnectorStatus[]): number {
  return statuses.filter(s => s === 'connected').length
}

function overallStatus(connected: number, total: number): ConnectorReport['overallStatus'] {
  if (connected === total) return 'all-connected'
  if (connected === 0)     return 'all-mock'
  return 'partial'
}

// Synchronous — returns mock data for unconfigured connectors.
// For async real-data calls, use getConnectorReportAsync() (Server Components with await).
export function getConnectorReport(): ConnectorReport {
  const ga4           = getGA4Data()
  const searchConsole = getSearchConsoleData()
  const github        = getGitHubDataSync()
  const vercel        = getVercelDataSync()

  const statuses = [ga4.status, searchConsole.status, github.status, vercel.status]
  const connected = countConnected(statuses)

  const setupRequired = [
    ...(ga4.status !== 'connected'           ? [GA4_META]              : []),
    ...(searchConsole.status !== 'connected' ? [SEARCH_CONSOLE_META]   : []),
    ...(github.status !== 'connected'        ? [GITHUB_META]           : []),
    ...(vercel.status !== 'connected'        ? [VERCEL_META]           : []),
  ]

  return {
    ga4,
    searchConsole,
    github,
    vercel,
    generatedAt:    new Date().toISOString(),
    connectedCount: connected,
    totalCount:     4,
    overallStatus:  overallStatus(connected, 4),
    setupRequired,
  }
}

// Async version — calls real APIs for GitHub and Vercel when tokens are present.
// Use in async Server Components for live data.
export async function getConnectorReportAsync(): Promise<ConnectorReport> {
  // GA4 and Search Console use sync (JWT auth not yet implemented)
  const ga4           = getGA4Data()
  const searchConsole = getSearchConsoleData()

  // GitHub and Vercel have real async implementations
  const [github, vercel] = await Promise.all([
    import('./github').then(m => m.getGitHubData()),
    import('./vercel').then(m => m.getVercelData()),
  ])

  const statuses = [ga4.status, searchConsole.status, github.status, vercel.status]
  const connected = countConnected(statuses)

  const setupRequired = [
    ...(ga4.status !== 'connected'           ? [GA4_META]              : []),
    ...(searchConsole.status !== 'connected' ? [SEARCH_CONSOLE_META]   : []),
    ...(github.status !== 'connected'        ? [GITHUB_META]           : []),
    ...(vercel.status !== 'connected'        ? [VERCEL_META]           : []),
  ]

  return {
    ga4,
    searchConsole,
    github,
    vercel,
    generatedAt:    new Date().toISOString(),
    connectedCount: connected,
    totalCount:     4,
    overallStatus:  overallStatus(connected, 4),
    setupRequired,
  }
}

// Per-connector activation instructions for the Integrations page
export const CONNECTOR_SETUP_GUIDE = [
  {
    meta:     GA4_META,
    steps: [
      'Go to analytics.google.com → Create property → Web stream',
      'Go to Google Cloud Console → Create Service Account → Download JSON key',
      'Extract client_email and private_key from the JSON',
      'Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GA4_PROPERTY_ID in Vercel env vars',
      'Also set NEXT_PUBLIC_GA_ID for client-side tracking (GA4 measurement ID)',
    ],
    difficulty: 'Medium' as const,
    timeEst:    '30–60 min',
  },
  {
    meta:     SEARCH_CONSOLE_META,
    steps: [
      'Go to search.google.com/search-console → Add property → URL prefix',
      'Verify ownership via HTML tag or DNS record',
      'In Google Cloud Console → Enable "Search Console API" for your project',
      'Grant Service Account "Owner" in Search Console → Settings → Users',
      'Set SEARCH_CONSOLE_SITE_URL=https://your-domain.com in Vercel',
      'GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY are shared with GA4',
    ],
    difficulty: 'Medium' as const,
    timeEst:    '20–30 min (after GA4 service account)',
  },
  {
    meta:     GITHUB_META,
    steps: [
      'Go to github.com/settings/tokens → Generate new token (classic)',
      'Grant scopes: repo (read), read:user',
      'Set GITHUB_TOKEN=ghp_xxx in Vercel env vars',
      'Optionally set GITHUB_OWNER=your-org if repos are under an org',
    ],
    difficulty: 'Easy' as const,
    timeEst:    '5 min',
  },
  {
    meta:     VERCEL_META,
    steps: [
      'Go to vercel.com/account/tokens → Create token',
      'Set VERCEL_TOKEN=xxx in Vercel env vars (NOT NEXT_PUBLIC_)',
      'Redeploy the Control Center to activate',
    ],
    difficulty: 'Easy' as const,
    timeEst:    '5 min',
  },
]
