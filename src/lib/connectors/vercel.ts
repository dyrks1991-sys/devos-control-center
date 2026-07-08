/**
 * Vercel Connector
 *
 * Activation: VERCEL_TOKEN
 *
 * Real API: Vercel REST API v6
 *   GET https://api.vercel.com/v6/deployments?limit=20
 *   Auth: Bearer token
 *
 * Sprint 16: real API call IMPLEMENTED. Set VERCEL_TOKEN to activate live data.
 */

import type { ConnectorResult, ConnectorMeta, VercelData, VercelDeployment, BuildStatus } from './types'

export const VERCEL_META: ConnectorMeta = {
  name:        'Vercel',
  description: 'Production status, deployment history, build duration, failed builds',
  envVars:     ['VERCEL_TOKEN'],
  setupUrl:    'https://vercel.com/account/tokens',
  apiDocs:     'https://vercel.com/docs/rest-api',
}

const MOCK_DATA: VercelData = {
  connected: false,
  failedBuilds: 0,
  avgBuildMs: null,
  deployments: [
    {
      id:        'dpl-mock-1',
      project:   'QuickQR',
      url:       'https://quickqr-gray.vercel.app',
      status:    'ready',
      branch:    'main',
      commitMsg: 'Sprint 12 — SEO improvements',
      commitSha: 'abc1234',
      createdAt: '2026-07-07',
      buildMs:   42000,
      region:    'iad1',
    },
    {
      id:        'dpl-mock-2',
      project:   'ImageCompress',
      url:       'https://imagecompress.vercel.app',
      status:    'ready',
      branch:    'main',
      commitMsg: 'Sprint 6 quality polish',
      commitSha: 'def5678',
      createdAt: '2026-07-06',
      buildMs:   38000,
      region:    'iad1',
    },
    {
      id:        'dpl-mock-3',
      project:   'OGImageGen',
      url:       'https://ogimagegen.vercel.app',
      status:    'ready',
      branch:    'main',
      commitMsg: 'Sprint 7 initial launch',
      commitSha: 'ghi9012',
      createdAt: '2026-07-07',
      buildMs:   45000,
      region:    'iad1',
    },
  ],
}

function isConfigured(): boolean {
  return !!process.env.VERCEL_TOKEN
}

function parseStatus(raw: string): BuildStatus {
  if (raw === 'READY')    return 'ready'
  if (raw === 'BUILDING') return 'building'
  if (raw === 'ERROR')    return 'error'
  if (raw === 'CANCELED') return 'canceled'
  return 'unknown'
}

function parseDeployment(d: Record<string, unknown>): VercelDeployment {
  const meta = (d.meta ?? {}) as Record<string, unknown>
  const createdAt = d.createdAt
    ? new Date(Number(d.createdAt)).toISOString().slice(0, 10)
    : ''
  const buildMs = (d.buildingAt && d.ready)
    ? Number(d.ready) - Number(d.buildingAt)
    : null

  return {
    id:        String(d.uid ?? d.id ?? ''),
    project:   String(d.name ?? d.projectId ?? ''),
    url:       d.url ? `https://${d.url}` : '',
    status:    parseStatus(String(d.readyState ?? d.state ?? 'UNKNOWN')),
    branch:    String(meta.githubCommitRef ?? d.gitBranch ?? 'main'),
    commitMsg: String(meta.githubCommitMessage ?? d.gitSource ?? '').split('\n')[0].slice(0, 80),
    commitSha: String(meta.githubCommitSha ?? '').slice(0, 7),
    createdAt,
    buildMs,
    region:    String((d.regions as string[] | undefined)?.[0] ?? 'iad1'),
  }
}

async function fetchRealData(token: string): Promise<VercelData> {
  const res = await fetch('https://api.vercel.com/v6/deployments?limit=20', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Vercel API ${res.status}: ${await res.text()}`)
  }

  const json = await res.json() as { deployments: Record<string, unknown>[] }
  const deployments = (json.deployments ?? []).map(parseDeployment)

  const failed = deployments.filter(d => d.status === 'error').length
  const buildTimes = deployments.filter(d => d.buildMs !== null).map(d => d.buildMs!)
  const avgBuildMs = buildTimes.length > 0
    ? Math.round(buildTimes.reduce((a, b) => a + b, 0) / buildTimes.length)
    : null

  return { deployments, failedBuilds: failed, avgBuildMs, connected: true }
}

export async function getVercelData(): Promise<ConnectorResult<VercelData>> {
  if (!isConfigured()) {
    return {
      data:      MOCK_DATA,
      status:    'unconfigured',
      source:    'mock',
      fetchedAt: new Date().toISOString(),
    }
  }

  const t0 = Date.now()
  try {
    const data = await fetchRealData(process.env.VERCEL_TOKEN!)
    return {
      data,
      status:    'connected',
      source:    'Vercel API v6',
      fetchedAt: new Date().toISOString(),
      latencyMs: Date.now() - t0,
    }
  } catch (err) {
    return {
      data:      MOCK_DATA,
      status:    'error',
      source:    'Vercel API v6',
      error:     String(err),
      fetchedAt: new Date().toISOString(),
      latencyMs: Date.now() - t0,
    }
  }
}

// Sync version for static rendering
export function getVercelDataSync(): ConnectorResult<VercelData> {
  return {
    data:      MOCK_DATA,
    status:    isConfigured() ? 'unconfigured' : 'unconfigured',
    source:    'mock',
    fetchedAt: new Date().toISOString(),
  }
}
