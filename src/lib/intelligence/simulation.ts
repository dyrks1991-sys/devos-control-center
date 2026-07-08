import type { Scenario, Initiative } from '@/lib/types'

export function generateScenarios(initiatives: Initiative[]): Scenario[] {
  const ph      = initiatives.find(i => i.id === 'product-hunt-launch')
  const seo     = initiatives.find(i => i.id === 'ogimagegen-seo-sprint')
  const infra   = initiatives.find(i => i.id === 'live-api-connections')
  const revenue = initiatives.find(i => i.id === 'stripe-monetization')

  const scenarios: Scenario[] = []

  if (ph) {
    scenarios.push({
      id:           'scenario-product-hunt',
      title:        'What if we launch on Product Hunt?',
      description:  'OGImageGen goes live on Product Hunt on Tuesday morning. Assets are ready. Top-200 finish is the realistic target.',
      initiativeId: ph.id,
      outcomes: [
        { metric: 'Visitors (24h)',     before: 0,   after: '2,000–5,000', delta: '+2,000 to +5,000', positive: true },
        { metric: 'Q3 Users',           before: 0,   after: '30–80',       delta: '+30 to +80',       positive: true },
        { metric: 'Portfolio SEO',      before: 79,  after: '82',          delta: '+3 (backlinks)',    positive: true },
        { metric: 'Revenue',            before: '$0', after: '$0',         delta: 'None (no paywall)', positive: false },
        { metric: 'Sprints consumed',   before: 15,  after: 16,            delta: '+1 sprint',        positive: false },
        { metric: 'Analytics needed?',  before: 'No', after: 'Critical',  delta: 'Must connect GA4 before launch', positive: false },
      ],
      opportunityCost: 'Spend one full sprint on distribution instead of engineering. All other initiatives delayed by 1 sprint.',
      timeHorizon:  '24 hours for peak traffic; 2–4 weeks for ongoing organic effect',
      confidence:   60,
    })
  }

  if (seo) {
    scenarios.push({
      id:           'scenario-seo-first',
      title:        'What if we improve SEO first?',
      description:  'Apply the QuickQR SEO playbook (34→82) to OGImageGen (currently 57). Target: 57→85. Expected organic traffic in 4–8 weeks.',
      initiativeId: seo.id,
      outcomes: [
        { metric: 'OGImageGen SEO',   before: 57,  after: 85,    delta: '+28 points',              positive: true },
        { metric: 'Portfolio Avg SEO',before: 79,  after: 83,    delta: '+4 points',                positive: true },
        { metric: 'Organic Traffic',  before: '?', after: '+15–40%', delta: 'after 4–8 week delay', positive: true },
        { metric: 'Visitors (now)',   before: 0,   after: 0,     delta: 'No immediate change',      positive: false },
        { metric: 'Q3 Users (now)',   before: 0,   after: 0,     delta: 'Effect delayed 60 days',   positive: false },
        { metric: 'Sprints consumed', before: 15,  after: '15.5', delta: '+0.5 sprint',             positive: false },
      ],
      opportunityCost: 'Delay Product Hunt launch by 0.5 sprint. Organic results take 60+ days to appear — may not affect Q3 target.',
      timeHorizon:  '0.5 sprint to implement; 4–8 weeks to see organic traffic increase',
      confidence:   72,
    })
  }

  if (infra) {
    scenarios.push({
      id:           'scenario-infrastructure',
      title:        'What if we spend a sprint on infrastructure?',
      description:  'Connect GA4, Vercel, and GitHub APIs to the Control Center. Replace all mock data with live data. Dashboard shows real numbers.',
      initiativeId: infra.id,
      outcomes: [
        { metric: 'Dashboard data',      before: 'Mock',   after: 'Live',      delta: 'Real API data', positive: true },
        { metric: 'Company health',      before: 68,       after: 78,          delta: '+10 points',    positive: true },
        { metric: 'Q3 Users',            before: 0,        after: 0,           delta: 'Zero new users', positive: false },
        { metric: 'Revenue',             before: '$0',     after: '$0',        delta: 'No change',     positive: false },
        { metric: 'Time to market',      before: 'Week 15', after: 'Week 16', delta: '-1 sprint of growth', positive: false },
        { metric: 'Sprints consumed',    before: 15,        after: 16,         delta: '+0.5 sprint',   positive: false },
      ],
      opportunityCost: 'Zero direct user impact. Every infrastructure sprint is a sprint not spent on distribution. Worth doing after Q3 users milestone is hit.',
      timeHorizon:  '0.5 sprint; live data visible immediately after deploy',
      confidence:   85,
    })
  }

  if (revenue) {
    scenarios.push({
      id:           'scenario-monetization',
      title:        'What if we add revenue this sprint?',
      description:  'Integrate Stripe donation or pay-what-you-want into the highest-traffic product. First revenue event — transforms Q3 financial position.',
      initiativeId: revenue.id,
      outcomes: [
        { metric: 'Monthly Revenue',    before: '$0',  after: '$20–200',    delta: 'First revenue — highly uncertain', positive: true },
        { metric: 'Conversion rate',    before: 'N/A', after: '0.5–2%',    delta: 'Requires traffic to measure',      positive: true },
        { metric: 'Q3 Users',           before: 0,     after: 0,            delta: 'No new users from adding Stripe',  positive: false },
        { metric: 'Analytics required', before: 'No',  after: 'Critical',  delta: 'Cannot measure without GA4 first', positive: false },
        { metric: 'Sprints consumed',   before: 15,    after: 16,           delta: '+0.5–1 sprint',                   positive: false },
      ],
      opportunityCost: 'Revenue without traffic is $0. Analytics must be connected first to know which product to monetize. Premature if traffic is unmeasured.',
      timeHorizon:  '0.5–1 sprint; revenue depends on traffic level which is currently unmeasured',
      confidence:   40,
    })
  }

  return scenarios
}
