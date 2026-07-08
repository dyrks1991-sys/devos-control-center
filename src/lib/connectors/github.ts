/**
 * GitHub Connector
 *
 * Activation: GITHUB_TOKEN + GITHUB_OWNER (optional, defaults to env or 'dyrks1991-sys')
 *
 * Real API: GitHub REST API v3
 *   GET https://api.github.com/repos/{owner}/{repo}/commits
 *   GET https://api.github.com/repos/{owner}/{repo}/pulls
 *   GET https://api.github.com/repos/{owner}/{repo}
 *   Auth: Bearer token (no JWT required — simple PAT works)
 *
 * Sprint 16: real API call IMPLEMENTED. Set GITHUB_TOKEN to activate live data.
 */

import type { ConnectorResult, ConnectorMeta, GitHubData, GitHubRepo, GitHubCommit, GitHubPR } from './types'

export const GITHUB_META: ConnectorMeta = {
  name:        'GitHub',
  description: 'Latest commits, pull requests, issues, build status, contributors',
  envVars:     ['GITHUB_TOKEN'],
  setupUrl:    'https://github.com/settings/tokens',
  apiDocs:     'https://docs.github.com/en/rest',
}

const REPOS = [
  { name: 'QuickQR',       product: 'QuickQR',       slug: 'quickqr'       },
  { name: 'ImageCompress', product: 'ImageCompress',  slug: 'imagecompress' },
  { name: 'OGImageGen',    product: 'OGImageGen',     slug: 'ogimagegen'    },
  { name: 'DevOS',         product: 'DevOS',          slug: 'devos'         },
]

const MOCK_DATA: GitHubData = {
  connected: false,
  repos: REPOS.map(r => ({
    name:     r.name,
    product:  r.product,
    fullName: `dyrks1991-sys/${r.slug}`,
    url:      `https://github.com/dyrks1991-sys/${r.slug}`,
    branch:   'main',
    recentCommits: [
      { sha: 'abc1234', message: 'Sprint 15 — Decision Intelligence Engine', author: 'DevOS', date: '2026-07-05' },
    ],
    openPRs:      [],
    openIssues:   0,
    buildStatus:  'unknown' as const,
    contributors: 1,
    stars:        0,
    lastPushAt:   '2026-07-05',
  })),
}

function isConfigured(): boolean {
  return !!process.env.GITHUB_TOKEN
}

// Parse raw GitHub API commit response
function parseCommit(c: Record<string, unknown>): GitHubCommit {
  const commit = c.commit as Record<string, unknown>
  const author = (commit?.author ?? {}) as Record<string, unknown>
  const committer = (c.committer ?? {}) as Record<string, unknown>
  return {
    sha:     String(c.sha ?? '').slice(0, 7),
    message: String((commit?.message ?? '') as string).split('\n')[0].slice(0, 80),
    author:  String((committer as Record<string, unknown>)?.login ?? author?.name ?? 'unknown'),
    date:    String(author?.date ?? '').slice(0, 10),
  }
}

function parsePR(pr: Record<string, unknown>): GitHubPR {
  return {
    number:    Number(pr.number ?? 0),
    title:     String(pr.title ?? '').slice(0, 80),
    state:     (pr.state === 'open' ? 'open' : pr.merged_at ? 'merged' : 'closed') as GitHubPR['state'],
    createdAt: String(pr.created_at ?? '').slice(0, 10),
  }
}

async function fetchRepo(owner: string, slug: string, token: string): Promise<GitHubRepo | null> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'DevOS-Control-Center/1.0',
  }
  const base = `https://api.github.com/repos/${owner}/${slug}`

  try {
    const [repoRes, commitsRes, prsRes] = await Promise.all([
      fetch(base, { headers }),
      fetch(`${base}/commits?per_page=3`, { headers }),
      fetch(`${base}/pulls?state=open&per_page=5`, { headers }),
    ])

    if (!repoRes.ok) return null

    const [repo, commits, prs] = await Promise.all([
      repoRes.json() as Promise<Record<string, unknown>>,
      commitsRes.ok ? commitsRes.json() as Promise<Record<string, unknown>[]> : Promise.resolve([]),
      prsRes.ok     ? prsRes.json()    as Promise<Record<string, unknown>[]> : Promise.resolve([]),
    ])

    const r = REPOS.find(x => x.slug === slug) ?? { name: slug, product: slug }

    return {
      name:          r.name,
      product:       r.product,
      fullName:      `${owner}/${slug}`,
      url:           `https://github.com/${owner}/${slug}`,
      branch:        String(repo.default_branch ?? 'main'),
      recentCommits: (commits as Record<string, unknown>[]).map(parseCommit),
      openPRs:       (prs as Record<string, unknown>[]).map(parsePR),
      openIssues:    Number(repo.open_issues_count ?? 0) - (prs as unknown[]).length,
      buildStatus:   'unknown',
      contributors:  1,
      stars:         Number(repo.stargazers_count ?? 0),
      lastPushAt:    String(repo.pushed_at ?? '').slice(0, 10),
    }
  } catch {
    return null
  }
}

export async function getGitHubData(): Promise<ConnectorResult<GitHubData>> {
  if (!isConfigured()) {
    return {
      data:      MOCK_DATA,
      status:    'unconfigured',
      source:    'mock',
      fetchedAt: new Date().toISOString(),
    }
  }

  const token = process.env.GITHUB_TOKEN!
  const owner = process.env.GITHUB_OWNER ?? 'dyrks1991-sys'
  const t0 = Date.now()

  try {
    const results = await Promise.all(
      REPOS.map(r => fetchRepo(owner, r.slug, token))
    )
    const repos = results.filter((r): r is GitHubRepo => r !== null)

    if (repos.length === 0) {
      return {
        data:      MOCK_DATA,
        status:    'error',
        source:    'GitHub API v3',
        error:     `No repos accessible for owner '${owner}'. Check GITHUB_OWNER and token scopes.`,
        fetchedAt: new Date().toISOString(),
        latencyMs: Date.now() - t0,
      }
    }

    return {
      data:      { repos, connected: true },
      status:    'connected',
      source:    'GitHub API v3',
      fetchedAt: new Date().toISOString(),
      latencyMs: Date.now() - t0,
    }
  } catch (err) {
    return {
      data:      MOCK_DATA,
      status:    'error',
      source:    'GitHub API v3',
      error:     String(err),
      fetchedAt: new Date().toISOString(),
      latencyMs: Date.now() - t0,
    }
  }
}

// Sync version for static rendering — returns mock only; use async version for live data
export function getGitHubDataSync(): ConnectorResult<GitHubData> {
  return {
    data:      MOCK_DATA,
    status:    isConfigured() ? 'unconfigured' : 'unconfigured',
    source:    'mock',
    fetchedAt: new Date().toISOString(),
  }
}
