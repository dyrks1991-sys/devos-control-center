/**
 * GitHub Datasource
 *
 * Migration path:
 *   Phase 1: mock data
 *   Phase 2: GitHub REST API (api.github.com) — requires GITHUB_TOKEN
 *   Phase 3: fetch('/api/github')
 */

export interface RepoStatus {
  name:         string
  slug:         string
  url:          string
  branch:       string
  lastCommit:   string
  lastCommitAt: string
  openIssues:   number
  openPRs:      number
  stars:        number
}

export interface GitHubData {
  repos:     RepoStatus[]
  connected: boolean
}

const MOCK: GitHubData = {
  connected: false,
  repos: [
    { name: 'QuickQR',          slug: 'quickqr',          url: 'https://github.com/dyrks1991-sys/quickqr',          branch: 'main', lastCommit: 'Sprint 12 SEO sprint', lastCommitAt: '2026-07-07', openIssues: 0, openPRs: 0, stars: 0 },
    { name: 'ImageCompress',    slug: 'imagecompress',    url: 'https://github.com/dyrks1991-sys/imagecompress',    branch: 'main', lastCommit: 'Sprint 6 quality polish', lastCommitAt: '2026-07-06', openIssues: 0, openPRs: 0, stars: 0 },
    { name: 'OGImageGen',       slug: 'ogimagegen',       url: 'https://github.com/dyrks1991-sys/ogimagegen',       branch: 'main', lastCommit: 'Sprint 7 initial launch', lastCommitAt: '2026-07-07', openIssues: 0, openPRs: 0, stars: 0 },
    { name: 'DevOS',            slug: 'devos',            url: 'https://github.com/dyrks1991-sys/devos',            branch: 'main', lastCommit: 'Sprint 13 dashboard v2', lastCommitAt: '2026-07-08', openIssues: 0, openPRs: 0, stars: 0 },
  ],
}

export function getGitHubData(): GitHubData {
  const hasToken = !!process.env.GITHUB_TOKEN
  if (!hasToken) return MOCK

  // Phase 2: fetch from GitHub API
  // const response = await fetch('https://api.github.com/user/repos', {
  //   headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  // })
  return { ...MOCK, connected: true }
}
