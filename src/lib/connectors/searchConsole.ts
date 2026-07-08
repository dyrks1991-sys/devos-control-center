/**
 * Search Console Connector
 *
 * Activation: SEARCH_CONSOLE_SITE_URL + GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY
 *
 * Real API: Google Search Console API v1
 *   POST https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query
 *   Auth: OAuth2 service account JWT (same credentials as GA4)
 *
 * Sprint 16: architecture + mock complete. Real call shares JWT auth with GA4 connector.
 * Sprint 17: implement JWT auth + real API call (reuse GA4 service account)
 */

import type { ConnectorResult, ConnectorMeta, SearchConsoleData } from './types'

export const SEARCH_CONSOLE_META: ConnectorMeta = {
  name:        'Google Search Console',
  description: 'Search clicks, impressions, CTR, position, top queries, indexed pages',
  envVars:     ['SEARCH_CONSOLE_SITE_URL', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY'],
  setupUrl:    'https://search.google.com/search-console',
  apiDocs:     'https://developers.google.com/webmaster-tools/v1/api_reference_index',
}

const MOCK_DATA: SearchConsoleData = {
  period:      '28d',
  clicks:      null,
  impressions: null,
  ctr:         null,
  avgPosition: null,
  topQueries: [
    { query: 'qr code generator',  clicks: 0, impressions: 0, ctr: 0, position: 0 },
    { query: 'compress image',     clicks: 0, impressions: 0, ctr: 0, position: 0 },
    { query: 'og image generator', clicks: 0, impressions: 0, ctr: 0, position: 0 },
  ],
  topPages: [
    { url: 'https://quickqr-gray.vercel.app/',     product: 'QuickQR',       clicks: 0, impressions: 0, position: 0 },
    { url: 'https://imagecompress.vercel.app/',    product: 'ImageCompress', clicks: 0, impressions: 0, position: 0 },
    { url: 'https://ogimagegen.vercel.app/',       product: 'OGImageGen',    clicks: 0, impressions: 0, position: 0 },
  ],
  indexedPages: null,
  connected:   false,
}

function isConfigured(): boolean {
  return !!(
    process.env.SEARCH_CONSOLE_SITE_URL &&
    process.env.GOOGLE_CLIENT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  )
}

// Sprint 17: real implementation
// async function fetchRealData(siteUrl: string, token: string): Promise<SearchConsoleData> {
//   const encoded = encodeURIComponent(siteUrl)
//   const res = await fetch(
//     `https://searchconsole.googleapis.com/webmasters/v3/sites/${encoded}/searchAnalytics/query`,
//     {
//       method: 'POST',
//       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         startDate: new Date(Date.now() - 28 * 864e5).toISOString().slice(0, 10),
//         endDate:   new Date().toISOString().slice(0, 10),
//         dimensions: ['query'],
//         rowLimit:   10,
//       }),
//     }
//   )
//   return parseSearchConsoleResponse(await res.json(), siteUrl)
// }

export function getSearchConsoleData(): ConnectorResult<SearchConsoleData> {
  if (!isConfigured()) {
    return {
      data:      MOCK_DATA,
      status:    'unconfigured',
      source:    'mock',
      fetchedAt: new Date().toISOString(),
    }
  }

  return {
    data:      MOCK_DATA,
    status:    'unconfigured',
    source:    'Search Console credentials detected — JWT auth in Sprint 17',
    fetchedAt: new Date().toISOString(),
  }
}
