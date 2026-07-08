/**
 * Vercel Datasource
 *
 * Migration path:
 *   Phase 1 (now): returns mock build/deploy data from products.json
 *   Phase 2: Vercel API (api.vercel.com/v6/deployments) — requires VERCEL_TOKEN
 *   Phase 3: fetch('/api/deployments') — backend proxy
 */

export type BuildStatus = 'ready' | 'building' | 'error' | 'cancelled' | 'unknown'

export interface DeploymentInfo {
  projectId:   string
  projectName: string
  url:         string
  status:      BuildStatus
  branch:      string
  commit:      string
  deployedAt:  string
  duration:    number   // seconds
  region:      string
}

export interface VercelData {
  deployments: DeploymentInfo[]
  connected:   boolean
}

const MOCK: VercelData = {
  connected: false,
  deployments: [
    {
      projectId:   'quickqr',
      projectName: 'QuickQR',
      url:         'https://quickqr-gray.vercel.app',
      status:      'ready',
      branch:      'main',
      commit:      'Sprint 12 — SEO improvements',
      deployedAt:  '2026-07-07',
      duration:    42,
      region:      'iad1',
    },
    {
      projectId:   'imagecompress',
      projectName: 'ImageCompress',
      url:         'https://imagecompress-jet.vercel.app',
      status:      'ready',
      branch:      'main',
      commit:      'Sprint 6 — SEO + quality polish',
      deployedAt:  '2026-07-06',
      duration:    38,
      region:      'iad1',
    },
    {
      projectId:   'ogimagegen',
      projectName: 'OGImageGen',
      url:         'https://ogimagegen.vercel.app',
      status:      'ready',
      branch:      'main',
      commit:      'Sprint 7 — initial launch',
      deployedAt:  '2026-07-07',
      duration:    45,
      region:      'iad1',
    },
    {
      projectId:   'devos-control-center',
      projectName: 'Control Center',
      url:         'https://devos-control-center.vercel.app',
      status:      'ready',
      branch:      'main',
      commit:      'Sprint 13 — CEO dashboard v2',
      deployedAt:  '2026-07-08',
      duration:    67,
      region:      'iad1',
    },
  ],
}

export function getVercelData(): VercelData {
  const hasToken = !!process.env.VERCEL_TOKEN
  if (!hasToken) return MOCK

  // Phase 2: fetch from Vercel API
  // const response = await fetch('https://api.vercel.com/v6/deployments', {
  //   headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` }
  // })
  return { ...MOCK, connected: true }
}
