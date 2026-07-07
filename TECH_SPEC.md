# Technical Specification — DevOS Control Center

> Version: 0.1.0
> Status: Approved
> Date: 2026-07-07

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 App Router (NO static export — keep API routes available) | Same pipeline as QuickQR — zero new infra |
| Language | TypeScript 5 (strict mode) | Strict mode, consistent with all DevOS projects |
| Styling | Tailwind CSS 3 (dark theme throughout) | Utility-first, mobile-first, design system consistent |
| State | React useState (Sidebar active state only); all data via server components | Sufficient for single-page linear state machine |
| Deployment | Vercel (standard Next.js — no static export) | Proven by QuickQR deploy |

---

## Architecture

```
Browser
  └── Next.js 14 static export
        └── page.tsx (state owner)
              ├── DropZone         ← File input
              ├── FormatSelector   ← Output format
              ├── QualitySlider    ← Compression level
              ├── ImagePreview     ← Before/after display
              ├── CompressionStats ← Size delta
              └── DownloadButton   ← Output
```

**No backend. No API. No database. No auth.**
All computation happens in the user's browser.

---

## Folder Structure

```
projects/devos-control-center/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Shell: Inter font, sidebar + header wrapper
│   │   ├── globals.css         # Tailwind + dark theme base
│   │   ├── page.tsx            # / — Executive Overview
│   │   ├── portfolio/page.tsx  # /portfolio — Product Portfolio
│   │   ├── agents/page.tsx     # /agents — Agent Status
│   │   ├── growth/page.tsx     # /growth — Growth Dashboard
│   │   ├── analytics/page.tsx  # /analytics — Analytics Dashboard
│   │   ├── finance/page.tsx    # /finance — Finance Dashboard
│   │   ├── activity/page.tsx   # /activity — Activity Feed
│   │   ├── approvals/page.tsx  # /approvals — Pending Approvals
│   │   └── brief/page.tsx      # /brief — CEO Brief
│   ├── components/
│   │   ├── Sidebar.tsx         # 'use client' — navigation
│   │   ├── Header.tsx          # Server — page title
│   │   ├── StatCard.tsx        # Reusable metric card
│   │   ├── ProductCard.tsx     # Product status card
│   │   ├── AgentRow.tsx        # Agent table row
│   │   ├── ActivityItem.tsx    # Timeline item
│   │   └── ApprovalCard.tsx    # Decision card
│   └── lib/
│       ├── types.ts            # TypeScript interfaces
│       └── data.ts             # All dashboard data
├── public/
│   ├── favicon.svg             # Dark bg + "DC"
│   └── robots.txt              # Disallow: / (never index)
├── PRD.md
├── TECH_SPEC.md
├── UI_PLAN.md
├── TASKS.md
├── ROADMAP.md
├── CHECKLIST.md
├── DECISIONS.md
├── package.json
├── next.config.js              # NO output: export
├── tsconfig.json
└── tailwind.config.js
```

---

## Component Specifications

| Component | File | Responsibility |
|---|---|---|
| `Sidebar` | `src/components/Sidebar.tsx` | Client component. usePathname() active state. 9 nav items with SVG icons. Fixed left, w-64. |
| `Header` | `src/components/Header.tsx` | Server component. Page title + last updated + "All Systems Operational" pill. |
| `StatCard` | `src/components/StatCard.tsx` | Reusable metric card: value, label, color variant (green/amber/red/neutral). |
| `ProductCard` | `src/components/ProductCard.tsx` | Product card: name, status badge, URL, GitHub, QA/SEO scores, tech stack. |
| `AgentRow` | `src/components/AgentRow.tsx` | Table row: agent name, file, version, status dot, sprint. |
| `ActivityItem` | `src/components/ActivityItem.tsx` | Timeline item: colored dot, date, description, status badge. |
| `ApprovalCard` | `src/components/ApprovalCard.tsx` | Decision card: priority badge, title, project, description, since date. |

---

## Library Modules

| Module | File | Responsibility |
|---|---|---|
| — | `src/lib/types.ts` | TypeScript interfaces: Product, Agent, Activity, Approval, GrowthMetric, FinanceLine. |
| — | `src/lib/data.ts` | All dashboard data as typed constants. Single source of truth. Replace with API calls in future sprints. |

---

## State Design

All state lives in `src/app/page.tsx`. Components are stateless — they receive props and call callbacks.

| State | Type | Default | Description |
|---|---|---|---|
| `pathname` | `string` | `'/'` | Active route — drives Sidebar highlight. From usePathname(). |
| `No global state` | `—` | `—` | All data is static (from data.ts). Server components. No state management library needed. |

---

## Data Flow

```
User drops file
  → selectedFile ← File
  → originalUrl  ← URL.createObjectURL(file)
  → useEffect [selectedFile, outputFormat, quality]
      → compress(file, { format, quality })
      → compressedBlob ← Blob
      → compressedUrl  ← URL.createObjectURL(blob)
  → ImagePreview renders both URLs
  → DownloadButton: downloadBlob(compressedBlob, generateFilename(format))
```

---

## No Backend Required

| Concern | Resolution |
|---|---|
| Storage | None — files never leave the browser |
| Auth | None — no accounts |
| API | None — Canvas API + Web Worker |
| GDPR | Trivially compliant — zero data retention |
| Hosting | Vercel free tier, static CDN |

---

## Performance Targets

| Metric | Target | How |
|---|---|---|
| First Load JS | < 100 KB | Static export, no unnecessary deps |
| Compression time (2MB JPEG) | < 2 000ms | browser-image-compression Web Worker |
| Preview update after slider | < 300ms | Debounce + Web Worker |
| Lighthouse Performance | ≥ 90 | Static export + no blocking resources |

---

*Generated by DevOS Planner Agent v1 — 2026-07-07*
