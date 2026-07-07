import type { Product, Agent, Activity, Approval, GrowthMetric, FinanceLine } from './types'

export const LAST_UPDATED = '2026-07-07'

export const PRODUCTS: Product[] = [
  {
    id: 'quickqr',
    name: 'QuickQR',
    url: 'https://quickqr-gray.vercel.app',
    github: 'https://github.com/dyrks1991-sys/quickqr',
    status: 'live',
    description: 'Free, browser-based QR code generator. No account. No upload. Instant PNG download.',
    qaScore: '24/24',
    seoScore: 34,
    launchDate: '2026-07-05',
    techStack: 'Next.js 14 · qrcode.react · Tailwind CSS',
    sprint: 1,
  },
  {
    id: 'imagecompress',
    name: 'ImageCompress',
    url: 'https://imagecompress-jet.vercel.app',
    github: 'https://github.com/dyrks1991-sys/imagecompress',
    status: 'live',
    description: 'Client-side image compression up to 80%. JPEG/WebP/PNG. Images never leave your device.',
    qaScore: '15/15',
    seoScore: 92,
    launchDate: '2026-07-06',
    techStack: 'Next.js 14 · Canvas API · browser-image-compression · Tailwind CSS',
    sprint: 5,
  },
  {
    id: 'ogimagegen',
    name: 'OGImageGen',
    url: 'https://ogimagegen-25q515r4v-dyrks1991-2163s-projects.vercel.app',
    github: 'https://github.com/dyrks1991-sys/ogimagegen',
    status: 'live',
    description: 'Design Open Graph images in the browser. 3 templates, custom colors, 1200×630 PNG download.',
    qaScore: '15/15',
    seoScore: 57,
    launchDate: '2026-07-07',
    techStack: 'Next.js 14 · Canvas 2D API · Tailwind CSS',
    sprint: 7,
  },
]

export const AGENTS: Agent[] = [
  { id: 'strategy',  name: 'Strategy Agent',  file: 'agents/product-strategy.js', status: 'operational', version: 'v2', sprint: 3, description: '7-dimension scoring model — ranks product ideas by market opportunity' },
  { id: 'planner',   name: 'Planner Agent',   file: 'agents/planner.js',           status: 'operational', version: 'v1', sprint: 4, description: 'Generates 7 planning documents (PRD, TECH_SPEC, UI_PLAN, TASKS, ROADMAP, CHECKLIST, DECISIONS)' },
  { id: 'bootstrap', name: 'Bootstrap Agent', file: 'agents/bootstrap.js',         status: 'operational', version: 'v2', sprint: 2, description: 'Scaffolds full Next.js 14 project with Tailwind, TypeScript, fonts, config' },
  { id: 'developer', name: 'Developer Agent', file: 'agents/developer.js',         status: 'operational', version: 'v1', sprint: 5, description: 'Reads TASKS.md and executes implementation tasks' },
  { id: 'qa',        name: 'QA Agent',        file: 'agents/qa.js',                status: 'operational', version: 'v1', sprint: 5, description: 'Runs 15 Playwright checks per project — build, serve, test, report' },
  { id: 'deploy',    name: 'Deploy Agent',    file: 'agents/deploy.js',            status: 'operational', version: 'v1', sprint: 5, description: 'GitHub push + Vercel deploy + HTTP 200 verification + triggers Growth Agent' },
  { id: 'growth',    name: 'Growth Agent',    file: 'agents/growth.js',            status: 'operational', version: 'v1', sprint: 8, description: 'SEO audit, social media drafts, launch plans, KPI dashboards per product' },
]

export const ACTIVITIES: Activity[] = [
  { id: 11, date: '2026-07-07', type: 'qa',      product: 'DevOS Control Center', description: 'QA Agent: 15/15 Playwright checks passed for DevOS Control Center',  status: 'success' },
  { id: 10, date: '2026-07-07', type: 'deploy',  product: 'DevOS Control Center', description: 'DevOS Control Center v0.1.0 deployed — 9-module CEO dashboard live', status: 'success' },
  { id: 9,  date: '2026-07-07', type: 'growth',  product: 'All Products',          description: 'Growth Agent generated packages for QuickQR, ImageCompress, OGImageGen', status: 'success' },
  { id: 8,  date: '2026-07-07', type: 'deploy',  product: 'OGImageGen',            description: 'OGImageGen v0.1.0 deployed — 15/15 QA pass',                       status: 'success' },
  { id: 7,  date: '2026-07-07', type: 'qa',      product: 'OGImageGen',            description: 'QA Agent: 15/15 Playwright checks passed for OGImageGen',           status: 'success' },
  { id: 6,  date: '2026-07-07', type: 'agent',   product: undefined,                    description: 'Strategy Agent v2 updated — Code Reusability dimension added',       status: 'success' },
  { id: 5,  date: '2026-07-07', type: 'plan',    product: 'OGImageGen',            description: 'Planner Agent generated 7 docs + 20 tasks for OGImageGen',           status: 'success' },
  { id: 4,  date: '2026-07-06', type: 'deploy',  product: 'ImageCompress',         description: 'ImageCompress Sprint 6 polish deployed — SEO 34→92, quality 5.4→8.3/10', status: 'success' },
  { id: 3,  date: '2026-07-06', type: 'qa',      product: 'ImageCompress',         description: 'QA Agent: 15/15 Playwright checks passed (6 selector fixes)',        status: 'success' },
  { id: 2,  date: '2026-07-06', type: 'deploy',  product: 'ImageCompress',         description: 'ImageCompress v0.1.0 deployed — first automated pipeline product',   status: 'success' },
  { id: 1,  date: '2026-07-05', type: 'deploy',  product: 'QuickQR',               description: 'QuickQR deployed — DevOS first live product (manual pipeline)',      status: 'success' },
]

export const APPROVALS: Approval[] = [
  { id: 1, priority: 'P0', category: 'blocking', title: 'Legal Review: yt-dlp / YouTube ToS',          project: 'touchcut', description: 'yt-dlp usage violates YouTube Terms of Service. Legal review required before any development can proceed on touchcut.', since: '2026-07-05' },
  { id: 2, priority: 'P1', category: 'blocking', title: 'CEO Decision: GPU Compute Pricing Model',      project: 'touchcut', description: 'GPU processing costs at scale are unproven. Need CEO to define pricing model (subscription vs. per-minute) before architecture is finalized.', since: '2026-07-05' },
  { id: 3, priority: 'P1', category: 'blocking', title: 'CEO Decision: Copyright of Derived Works',     project: 'touchcut', description: 'Edited video clips derived from copyrighted material. Need legal clarity on DMCA liability and user indemnification model.', since: '2026-07-05' },
  { id: 4, priority: 'P1', category: 'growth',   title: 'Configure Analytics on All Products',          project: 'all',      description: 'Zero analytics configured on any live product. Cannot measure growth, retention, or conversion. Estimated 2-hour setup for GA4 + Search Console.', since: '2026-07-07' },
  { id: 5, priority: 'P2', category: 'growth',   title: 'Approve QuickQR SEO Sprint',                   project: 'quickqr',  description: 'QuickQR SEO score is 34/100 — missing robots.txt, sitemap, JSON-LD, OG tags. Same treatment as ImageCompress Sprint 6 raised score from 34→92.', since: '2026-07-07' },
  { id: 6, priority: 'P2', category: 'growth',   title: 'Schedule Product Hunt Launch — OGImageGen',    project: 'ogimagegen', description: 'OGImageGen has highest Product Hunt potential of the 3 products. Growth package ready. Needs screenshot prep, demo video, and coordinated launch day.', since: '2026-07-07' },
]

export const GROWTH_DATA: GrowthMetric[] = [
  {
    productId: 'quickqr',
    seoScore: 34,
    grade: 'D',
    hasRobots: false,
    hasSitemap: false,
    analyticsConfigured: false,
    topGap: 'Missing robots.txt, sitemap, JSON-LD, all OG/Twitter tags',
    launchStatus: { reddit: false, hackerNews: false, productHunt: false, devTo: false },
  },
  {
    productId: 'imagecompress',
    seoScore: 92,
    grade: 'A',
    hasRobots: true,
    hasSitemap: true,
    analyticsConfigured: false,
    topGap: 'Analytics not configured (analytics.ts stubs only)',
    launchStatus: { reddit: false, hackerNews: false, productHunt: false, devTo: false },
  },
  {
    productId: 'ogimagegen',
    seoScore: 57,
    grade: 'D',
    hasRobots: false,
    hasSitemap: false,
    analyticsConfigured: false,
    topGap: 'Vercel preview URL — robots.txt blocked by platform; needs production domain',
    launchStatus: { reddit: false, hackerNews: false, productHunt: false, devTo: false },
  },
]

export const FINANCE: FinanceLine[] = [
  { category: 'Vercel Hosting',   monthly: 0, notes: 'Free tier — 3 projects deployed' },
  { category: 'GitHub',           monthly: 0, notes: 'Free tier — public repos' },
  { category: 'Domain Names',     monthly: 0, notes: 'Using .vercel.app subdomains' },
  { category: 'Design Tools',     monthly: 0, notes: 'No paid design tools used' },
  { category: 'Analytics',        monthly: 0, notes: 'Not yet configured' },
]

export const HEALTH_SCORE = {
  total: 78,
  breakdown: [
    { label: 'Pipeline',  score: 100, max: 100, color: 'emerald' },
    { label: 'Products',  score: 90,  max: 100, color: 'emerald' },
    { label: 'Growth',    score: 40,  max: 100, color: 'amber'   },
    { label: 'Analytics', score: 0,   max: 100, color: 'red'     },
    { label: 'Finance',   score: 90,  max: 100, color: 'emerald' },
  ],
}
