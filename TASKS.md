# Tasks — DevOS Control Center

> Version: 0.1.0
> Sprint: 1
> Generated: 2026-07-07
> Total estimated: 11.5h (~1.4 days)

---

## Task Status Key

| Status | Meaning |
|---|---|
| `pending` | Not started |
| `in_progress` | Currently being worked on |
| `done` | Complete, AC verified |
| `blocked` | Waiting on dependency |

---

## Epic: Foundation

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E1-T1` | Bootstrap project | 0.5h | — | pending |
| `E1-T2` | lib/types.ts — TypeScript interfaces | 0.5h | E1-T1 | pending |
| `E1-T3` | lib/data.ts — all dashboard data | 1h | E1-T2 | pending |

### E1-T1 — Bootstrap project

**Estimate:** 0.5h  
**Dependencies:** none  
**Description:** Run bootstrap agent. Verify Next.js 14 App Router, Tailwind, Inter font. Remove output: export from next.config.js. Add robots.txt: User-agent: * Disallow: /.

### E1-T2 — lib/types.ts — TypeScript interfaces

**Estimate:** 0.5h  
**Dependencies:** E1-T1  
**Description:** Export: Product (id, name, url, github, status, description, qaScore, seoScore, launchDate, techStack). Agent (id, name, file, status, version, sprint). Activity (id, date, type, description, product?, status). Approval (id, priority, category, title, project, description, since). GrowthMetric (productId, seoScore, hasRobots, hasSitemap, analyticsConfigured, grade). FinanceLine (category, monthly, notes). DashboardData (products, agents, activities, approvals, growth, finance, lastUpdated).

### E1-T3 — lib/data.ts — all dashboard data

**Estimate:** 1h  
**Dependencies:** E1-T2  
**Description:** Export TODAY string. PRODUCTS: QuickQR (url: quickqr-gray.vercel.app, qaScore: 24/24, seoScore: 34), ImageCompress (url: imagecompress-jet.vercel.app, qaScore: 15/15, seoScore: 92), OGImageGen (url: ogimagegen-...vercel.app, qaScore: 15/15, seoScore: 57). AGENTS: 7 agents all operational. ACTIVITIES: 10 chronological events (deploys, QA runs, Growth Agent). APPROVALS: 6 items (3 touchcut P0/P1 + analytics P1 + QuickQR SEO P2 + ProductHunt P2). GROWTH: SEO data per product. FINANCE: all zeros (Vercel free, zero revenue). Export DASHBOARD_DATA as combined object.

## Epic: Shell

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E2-T1` | components/Sidebar.tsx | 1h | E1-T3 | pending |
| `E2-T2` | app/layout.tsx — shell | 0.5h | E2-T1 | pending |

### E2-T1 — components/Sidebar.tsx

**Estimate:** 1h  
**Dependencies:** E1-T3  
**Description:** 'use client'. usePathname(). NAV_ITEMS array: [{href:'/', label:'Overview', icon:<HomeIcon/>}, {href:'/portfolio', label:'Portfolio', icon:<GridIcon/>}, {href:'/agents', label:'Agents', icon:<CpuIcon/>}, {href:'/growth', label:'Growth', icon:<TrendingIcon/>}, {href:'/analytics', label:'Analytics', icon:<ChartIcon/>}, {href:'/finance', label:'Finance', icon:<DollarIcon/>}, {href:'/activity', label:'Activity', icon:<ActivityIcon/>}, {href:'/approvals', label:'Approvals', icon:<AlertIcon/>, badge: APPROVALS.filter(a=>a.priority==='P0'||a.priority==='P1').length}, {href:'/brief', label:'CEO Brief', icon:<ClipboardIcon/>}]. Active item: bg-slate-800 border-l-2 border-emerald-400. Use inline SVG path icons (no icon library). Logo: 'DevOS' bold white + 'Control Center' small gray.

### E2-T2 — app/layout.tsx — shell

**Estimate:** 0.5h  
**Dependencies:** E2-T1  
**Description:** Inter font (variable). html dark bg (#0a0a0a). body: flex h-screen overflow-hidden. Sidebar fixed w-64 h-full. main: flex-1 flex-col overflow-y-auto bg-[#0a0a0a]. metadata: title DevOS Control Center, robots noindex nofollow. No OG image.

## Epic: Overview

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E3-T1` | components/StatCard.tsx | 0.25h | E2-T2 | pending |
| `E3-T2` | app/page.tsx — Executive Overview | 1h | E3-T1 | pending |

### E3-T1 — components/StatCard.tsx

**Estimate:** 0.25h  
**Dependencies:** E2-T2  
**Description:** Props: value (string|number), label (string), color (green|amber|red|neutral). Card: bg-[#111827] border border-[#1f2937] rounded-xl p-6. Value: text-3xl font-bold colored. Label: text-sm text-slate-400. Export default.

### E3-T2 — app/page.tsx — Executive Overview

**Estimate:** 1h  
**Dependencies:** E3-T1  
**Description:** Server component (no use client). Import DASHBOARD_DATA. 4 StatCards: Products Live=3 (green), Agents Online=7/7 (green), Pending Approvals=count P0+P1 (amber), Revenue=$0 (neutral). Health score section: title "Company Health" + colored progress bar (bg-emerald-500 at 75%) + "75/100 — Good". Pipeline status: flex row of 7 badges (bg-[#111827] border text-xs), connected by → arrows, all with green dot. Recent Activity: last 5 ACTIVITIES as a list with colored dot + description + date. Quick actions: two buttons linking to /approvals and /brief.

## Epic: Portfolio

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E4-T1` | app/portfolio/page.tsx | 1h | E1-T3 | pending |

### E4-T1 — app/portfolio/page.tsx

**Estimate:** 1h  
**Dependencies:** E1-T3  
**Description:** Server component. Import PRODUCTS. Page header: "Product Portfolio" + "3 products · 3 live". Grid grid-cols-1 md:grid-cols-2 gap-6. ProductCard for each: status badge (🟢 LIVE emerald), product name h2, description text-slate-400, URL as external link, GitHub link, QA Score badge (green), SEO Score badge (color by grade: ≥80 green, ≥60 amber, <60 red), launch date, tech stack pill. Bottom: summary line.

## Epic: Agents

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E4-T2` | app/agents/page.tsx | 0.75h | E1-T3 | pending |

### E4-T2 — app/agents/page.tsx

**Estimate:** 0.75h  
**Dependencies:** E1-T3  
**Description:** Server component. Import AGENTS. Table: columns=Agent, File, Version, Status, Sprint. Each row: name, code tag for file path, version badge, green dot "Operational", sprint number. Below table: pipeline visualization — flex row of 7 boxes (Strategy/Planner/Bootstrap/Developer/QA/Deploy/Growth), each bg-[#111827] border rounded with green dot + name, connected by → in text-slate-500. Caption: "Full 7-agent pipeline operational — Sprint 8 2026-07-07".

## Epic: Growth

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E4-T3` | app/growth/page.tsx | 0.75h | E1-T3 | pending |

### E4-T3 — app/growth/page.tsx

**Estimate:** 0.75h  
**Dependencies:** E1-T3  
**Description:** Server component. Import GROWTH data + PRODUCTS. Section 1: SEO Audit table — Product, Score (colored), Grade, robots.txt, sitemap.xml, Top Gap. Section 2: Analytics Status — Product, GA4, Search Console, Clarity, Plausible — all ❌ with amber "Action Required" banner. Section 3: Growth Packages — table showing ✅ for each of 5 files per product. Section 4: Launch Readiness checklist per product (Reddit=not launched, HN=not launched, ProductHunt=not launched).

## Epic: Analytics

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E4-T4` | app/analytics/page.tsx | 0.5h | E1-T3 | pending |

### E4-T4 — app/analytics/page.tsx

**Estimate:** 0.5h  
**Dependencies:** E1-T3  
**Description:** Server component. Top: amber banner "Analytics Not Configured — No data available for any product". Then per product: collapsible/static setup checklist with specific steps for GA4 (create property → get Measurement ID → add to analytics.ts), Search Console (add property → verify → submit sitemap), Clarity (create project → add script), Plausible (signup → add script). Estimated total setup time: 2 hours. Priority: Set up before Reddit/HN/ProductHunt launches.

## Epic: Finance

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E4-T5` | app/finance/page.tsx | 0.5h | E1-T3 | pending |

### E4-T5 — app/finance/page.tsx

**Estimate:** 0.5h  
**Dependencies:** E1-T3  
**Description:** Server component. Monthly P&L: Revenue $0 (gray), Total Costs $0 (gray), Net Cash Flow $0, Burn Rate "Zero (pre-revenue)". Infrastructure table: Vercel $0 Free Tier, GitHub $0 Free Tier, Domains $0, Total $0. Revenue Roadmap table: Sprint 9 ImageCompress Pro $4.99/mo, Sprint 10 OGImageGen Pro $4.99/mo, Sprint 11+ additional products. Unit economics: if 100 Pro users at $4.99 = $499 MRR. Green callout: "Zero burn rate — runway is infinite at current spend."

## Epic: Activity

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E4-T6` | app/activity/page.tsx | 0.5h | E1-T3 | pending |

### E4-T6 — app/activity/page.tsx

**Estimate:** 0.5h  
**Dependencies:** E1-T3  
**Description:** Server component. Import ACTIVITIES (10+ events). Timeline layout: left colored dot (deploy=blue, qa=green, agent=purple, growth=teal) + right content (date small text-slate-400, description, status badge). Filter row at top (tabs: All, Deploy, QA, Agent, Growth) — use URL searchParams for filter (server component compatible). Show 20 most recent.

## Epic: Approvals

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E4-T7` | app/approvals/page.tsx | 0.75h | E1-T3 | pending |

### E4-T7 — app/approvals/page.tsx

**Estimate:** 0.75h  
**Dependencies:** E1-T3  
**Description:** Server component. Import APPROVALS. Summary: "6 pending decisions — 3 blocking development, 3 blocking growth". Group by category: BLOCKING (touchcut legal + GPU pricing + copyright — all P0/P1), GROWTH (analytics setup P1, QuickQR SEO P2, ProductHunt launch P2). ApprovalCard per item: colored priority badge, title bold, project chip, description text-slate-400, "Since: date" small. Red alert box for P0 items: "CEO action required."

## Epic: Brief

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E4-T8` | app/brief/page.tsx | 0.75h | E1-T3 | pending |

### E4-T8 — app/brief/page.tsx

**Estimate:** 0.75h  
**Dependencies:** E1-T3  
**Description:** Server component. Header: "CEO Brief" + date + "Confidential — Internal". 4 sections: 1) Situation: "DevOS has 3 products live in production. The full 7-agent pipeline shipped 3 products in 3 days. Zero revenue, zero burn. The company is operationally healthy and capital-efficient." 2) Priorities: numbered list of 3: [1] Configure analytics on all products (2h), [2] Upgrade QuickQR SEO from 34/100 (same approach as Sprint 6 ImageCompress), [3] Launch on Reddit r/SideProject and r/webdev for first external users. 3) Risks: touchcut legal blockers, zero analytics = zero data for decisions, no external validation yet. 4) Health Score: 75/100 — labeled bar with category scores (Pipeline 100, Products 85, Growth 40, Analytics 0, Finance 90). Print button (window.print()).

## Epic: Polish

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E5-T1` | public/favicon.svg + robots.txt | 0.25h | E4-T8 | pending |

### E5-T1 — public/favicon.svg + robots.txt

**Estimate:** 0.25h  
**Dependencies:** E4-T8  
**Description:** favicon.svg: 100x100 rect fill=#0f172a, text "DC" font-size=44 font-weight=700 fill=white text-anchor=middle dominant-baseline=central. robots.txt: User-agent: *\nDisallow: /\n (internal tool — never index).

## Epic: QA

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E6-T1` | QA Agent — devoscontrolcenter suite | 0.5h | E5-T1 | pending |

### E6-T1 — QA Agent — devoscontrolcenter suite

**Estimate:** 0.5h  
**Dependencies:** E5-T1  
**Description:** Add runDevosControlCenterTests(port, screenshotDir) to agents/qa.js. Slug: "devoscontrolcenter". IMPORTANT: This project has no static export. QA agent must detect non-static projects and start Next.js server with PORT=port npx next start instead of the static file server. 15 TCs: TC01 title=DevOS Control Center, TC02 sidebar visible, TC03-TC11 each nav link navigates (9 links), TC12 stat cards on overview, TC13 agents table visible /agents, TC14 mobile 390px sidebar hidden, TC15 no console errors.

## Epic: Deploy

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E6-T2` | Deploy + CEO Dashboard update | 0.5h | E6-T1 | pending |

### E6-T2 — Deploy + CEO Dashboard update

**Estimate:** 0.5h  
**Dependencies:** E6-T1  
**Description:** node agents/deploy.js "DevOS Control Center". Push to GitHub dyrks1991-sys/devos-control-center. Deploy to Vercel. Verify HTTP 200. Growth Agent runs. Update CEO-DASHBOARD.md Sprint 9 row.

---

## Completion Criteria

Sprint 1 is done when:
- All tasks above are `done`
- Production URL returns HTTP 200
- Lighthouse Performance ≥ 90
- At least one real image compressed and downloaded successfully

---

*Generated by DevOS Planner Agent v1 — 2026-07-07*
