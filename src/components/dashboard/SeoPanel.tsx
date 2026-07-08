import { Widget, SeoScore } from '@/components/widgets'
import type { Product } from '@/lib/types'

interface SeoPanelProps {
  products: Product[]
}

const SEO_CHECKS = ['robots.txt', 'sitemap.xml', 'JSON-LD', 'OG tags', 'Analytics']

// Which checks each product has completed
const CHECK_STATUS: Record<string, Record<string, boolean>> = {
  quickqr:       { 'robots.txt': true,  'sitemap.xml': true,  'JSON-LD': true,  'OG tags': true,  'Analytics': false },
  imagecompress: { 'robots.txt': true,  'sitemap.xml': true,  'JSON-LD': true,  'OG tags': true,  'Analytics': false },
  ogimagegen:    { 'robots.txt': false, 'sitemap.xml': false, 'JSON-LD': true,  'OG tags': true,  'Analytics': false },
}

export default function SeoPanel({ products }: SeoPanelProps) {
  const live   = products.filter(p => p.status === 'live')
  const avgSeo = live.length ? Math.round(live.reduce((s, p) => s + p.seoScore, 0) / live.length) : 0

  return (
    <Widget title="SEO" subtitle={`Portfolio avg ${avgSeo}/100`} href="/growth" action="Growth →">
      <div className="space-y-4">
        {live.map(p => {
          const checks = CHECK_STATUS[p.id] ?? {}
          const passed = Object.values(checks).filter(Boolean).length
          return (
            <div key={p.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{p.name}</span>
                <SeoScore score={p.seoScore} size="sm" />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {SEO_CHECKS.map(check => (
                  <span key={check}
                    className={`text-xs border rounded px-1.5 py-0.5 ${
                      checks[check]
                        ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                        : 'text-slate-600 border-slate-800'
                    }`}
                  >
                    {checks[check] ? '✓' : '○'} {check}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Widget>
  )
}
