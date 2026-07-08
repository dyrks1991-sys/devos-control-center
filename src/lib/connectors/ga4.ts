/**
 * GA4 Connector
 *
 * Activation: set GA4_PROPERTY_ID + GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY
 *
 * Real API: GA4 Data API v1beta
 *   POST https://analyticsdata.googleapis.com/v1beta/properties/{id}:runReport
 *   Auth: OAuth2 service account JWT (GOOGLE_PRIVATE_KEY + GOOGLE_CLIENT_EMAIL)
 *
 * Sprint 16: architecture complete, real API call stubbed (requires service account JWT)
 * Sprint 17: implement Google service account JWT auth + real API call
 */

import type { ConnectorResult, ConnectorMeta, GA4Data } from './types'

export const GA4_META: ConnectorMeta = {
  name:        'Google Analytics 4',
  description: 'Visitor, session, pageview, device, and country data',
  envVars:     ['GA4_PROPERTY_ID', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY'],
  setupUrl:    'https://analytics.google.com',
  apiDocs:     'https://developers.google.com/analytics/devguides/reporting/data/v1',
}

const MOCK_DATA: GA4Data = {
  period:        '30d',
  visitors:      null,
  sessions:      null,
  pageViews:     null,
  bounceRate:    null,
  avgSessionSec: null,
  returningRate: null,
  sources: [
    { label: 'Organic Search', percent: 45, color: '#10b981' },
    { label: 'Direct',         percent: 30, color: '#6366f1' },
    { label: 'Social',         percent: 15, color: '#f59e0b' },
    { label: 'Referral',       percent: 10, color: '#ec4899' },
  ],
  topPages: [
    { path: '/',        views: null, product: 'QuickQR' },
    { path: '/',        views: null, product: 'ImageCompress' },
    { path: '/',        views: null, product: 'OGImageGen' },
  ],
  devices: { desktop: 60, mobile: 35, tablet: 5 },
  countries: [
    { country: 'United States', percent: 40, sessions: null },
    { country: 'United Kingdom', percent: 12, sessions: null },
    { country: 'Germany',       percent: 8,  sessions: null },
    { country: 'India',         percent: 7,  sessions: null },
    { country: 'Other',         percent: 33, sessions: null },
  ],
  connected: false,
}

function isConfigured(): boolean {
  return !!(
    process.env.GA4_PROPERTY_ID &&
    process.env.GOOGLE_CLIENT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  )
}

// Sprint 17: replace stub with real JWT auth + API call
// async function fetchRealData(propertyId: string): Promise<GA4Data> {
//   const token = await getServiceAccountToken(
//     process.env.GOOGLE_CLIENT_EMAIL!,
//     process.env.GOOGLE_PRIVATE_KEY!,
//     'https://www.googleapis.com/auth/analytics.readonly',
//   )
//   const res = await fetch(
//     `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
//     {
//       method: 'POST',
//       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//       body: JSON.stringify({ dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
//         metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
//         dimensions: [{ name: 'deviceCategory' }, { name: 'country' }] }),
//     }
//   )
//   return parseGA4Response(await res.json())
// }

export function getGA4Data(): ConnectorResult<GA4Data> {
  const configured = isConfigured()
  const t0 = Date.now()

  if (!configured) {
    return {
      data:      MOCK_DATA,
      status:    'unconfigured',
      source:    'mock',
      fetchedAt: new Date().toISOString(),
    }
  }

  // Credentials present — real API call goes here in Sprint 17
  // For now, return mock with 'configured' status to show CEO that setup is detected
  return {
    data:      { ...MOCK_DATA, connected: false },
    status:    'unconfigured',
    source:    'GA4 credentials detected — real API call requires Sprint 17 JWT implementation',
    fetchedAt: new Date().toISOString(),
    latencyMs: Date.now() - t0,
  }
}
