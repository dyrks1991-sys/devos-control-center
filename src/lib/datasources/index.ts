/**
 * Unified datasource index
 *
 * Import all external data through this file. Each function:
 *   - returns mock data today
 *   - can be swapped to a real API call without changing callers
 *
 * Source status:
 *   ga4           → NOT connected (code deployed, awaiting NEXT_PUBLIC_GA_ID)
 *   vercel        → NOT connected (awaiting VERCEL_TOKEN)
 *   github        → NOT connected (awaiting GITHUB_TOKEN)
 *   internal      → LIVE (reads company/*.json via db.ts)
 */

export { getTrafficData }      from './ga4'
export { getVercelData }       from './vercel'
export { getGitHubData }       from './github'

export type { TrafficData }    from './ga4'
export type { VercelData, DeploymentInfo, BuildStatus } from './vercel'
export type { GitHubData, RepoStatus }                  from './github'
