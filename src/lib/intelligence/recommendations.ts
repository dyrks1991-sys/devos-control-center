import type { Product, Approval, HealthScore, Recommendation } from '@/lib/types'

export function generateRecommendations(
  products: Product[],
  approvals: Approval[],
  health: HealthScore,
): Recommendation[] {
  const recs: Recommendation[] = []

  const analyticsGap = products.filter(p => p.status === 'live').every(p => !p.features?.includes('analytics'))
  const p0Blockers   = approvals.filter(a => a.priority === 'P0' && a.status === 'open')
  const live         = products.filter(p => p.status === 'live')
  const lowSeo       = live.filter(p => p.seoScore < 70)
  const avgSeo       = live.length ? live.reduce((s, p) => s + p.seoScore, 0) / live.length : 0
  const hasAnalytics = approvals.find(a => a.id === 4 && a.status !== 'approved')

  // Always highest priority: unresolved legal/CEO P0 blockers
  if (p0Blockers.length) {
    recs.push({
      id:            'rec-p0-legal',
      priority:      'P0',
      title:         `Resolve ${p0Blockers.length} legal blocker${p0Blockers.length > 1 ? 's' : ''} on touchcut`,
      reasoning:     `touchcut has ${p0Blockers.length} P0 blocking decision${p0Blockers.length > 1 ? 's' : ''} requiring legal review (yt-dlp ToS, copyright liability). Every sprint without resolution is a sprint touchcut cannot move forward. This is the highest-leverage unblocking action available.`,
      impact:        'Unblocks highest-revenue potential product in portfolio',
      estimatedTime: '1–2 weeks (legal review)',
      category:      'legal',
      status:        'pending',
    })
  }

  // Analytics: zero visibility across all products
  if (hasAnalytics) {
    recs.push({
      id:            'rec-analytics',
      priority:      'P0',
      title:         'Connect Google Analytics 4 to all 3 products',
      reasoning:     'Every strategic decision — SEO investment, marketing channel, Product Hunt timing — is being made without data. GA4 code is deployed and waiting. A single env var per product activates real tracking. Continuing without this means Q3 targets cannot be measured.',
      impact:        'Unlocks user measurement, SEO validation, conversion tracking',
      estimatedTime: '2 hours (create GA4 property + add NEXT_PUBLIC_GA_ID env vars)',
      category:      'analytics',
      status:        'pending',
    })
  }

  // Search Console setup
  recs.push({
    id:            'rec-search-console',
    priority:      'P1',
    title:         'Verify products in Google Search Console',
    reasoning:     `QuickQR sitemap.xml and robots.txt are live. Without Search Console verification, Google hasn't been told where to index. Submitting sitemaps for all ${live.length} products accelerates indexing from weeks to days.`,
    impact:        'Accelerates SEO indexing for all live products',
    estimatedTime: '30 minutes',
    category:      'seo',
    status:        'pending',
  })

  // Product Hunt launch
  recs.push({
    id:            'rec-product-hunt',
    priority:      'P1',
    title:         'Launch OGImageGen on Product Hunt',
    reasoning:     'Complete launch package exists in PRODUCT_HUNT_ASSETS.md. OGImageGen solves a specific developer pain point, has a polished UI, and a clear value proposition. Best launch window is Tuesday–Thursday. A top-100 finish drives 2–5K visitors in 24 hours — more than the Q3 target.',
    impact:        'Potential 2,000–5,000 visitors in 24 hours',
    estimatedTime: '1 day (schedule + monitor)',
    category:      'launch',
    status:        'pending',
  })

  // Low SEO products
  if (lowSeo.length) {
    lowSeo.forEach(p => {
      recs.push({
        id:            `rec-seo-${p.id}`,
        priority:      'P2',
        title:         `Improve ${p.name} SEO (${p.seoScore}/100 → 85+)`,
        reasoning:     `${p.name} SEO score is ${p.seoScore}/100. QuickQR was improved from 34→82 using the same playbook: robots.txt, sitemap, JSON-LD, H1 optimization, meta description. Each point of SEO improvement compounds over months.`,
        impact:        `Organic search traffic growth for ${p.name}`,
        estimatedTime: '0.5 sprint',
        category:      'seo',
        status:        'pending',
      })
    })
  }

  // Generate og.png for QuickQR
  recs.push({
    id:            'rec-og-image',
    priority:      'P2',
    title:         'Generate og.png for QuickQR using OGImageGen',
    reasoning:     'QuickQR social meta tags reference /og.png, which does not yet exist. When shared on Twitter/LinkedIn/Slack, QuickQR shows a blank card. OGImageGen can generate this in 30 seconds. Fixes a visible credibility gap.',
    impact:        'Professional social sharing preview for QuickQR',
    estimatedTime: '10 minutes',
    category:      'growth',
    status:        'pending',
  })

  // Revenue
  if (health.total < 80) {
    recs.push({
      id:            'rec-revenue',
      priority:      'P3',
      title:         'Define monetization model for highest-traffic product',
      reasoning:     `Company health score is ${health.total}/100 with $0 revenue. Before the company scales, one monetization approach should be selected for the product with the most traction. Options: donations (Ko-fi), freemium, or API access tier.`,
      impact:        'First revenue event — transforms Q3 financial position',
      estimatedTime: '1 week (define + implement)',
      category:      'revenue',
      status:        'pending',
    })
  }

  // Sort: P0 > P1 > P2 > P3
  const ORDER = { P0: 0, P1: 1, P2: 2, P3: 3 }
  return recs.sort((a, b) => ORDER[a.priority] - ORDER[b.priority])
}
