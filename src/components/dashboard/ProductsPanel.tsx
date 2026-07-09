import Link from 'next/link'
import { Widget, SeoScore, StatusPill } from '@/components/widgets'
import type { Product } from '@/lib/types'

interface ProductsPanelProps {
  products: Product[]
}

export default function ProductsPanel({ products }: ProductsPanelProps) {
  const live = products.filter(p => p.status === 'live')

  return (
    <Widget title="Products" subtitle={`${live.length} live · 0 revenue`} href="/portfolio">
      <div className="space-y-2">
        {live.map(p => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="flex items-center justify-between p-3 bg-[#0f172a] border border-slate-800
                       rounded-xl hover:border-slate-600 transition-all duration-150 active:scale-[0.98]"
          >
            <div className="min-w-0">
              <div className="text-sm font-medium text-white">{p.name}</div>
              <div className="text-xs text-slate-500 mt-0.5 truncate">{p.tagline}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <SeoScore score={p.seoScore} size="sm" />
              <StatusPill status="live" showDot />
            </div>
          </Link>
        ))}
        {products.filter(p => p.status !== 'live').length > 0 && (
          <div className="text-xs text-slate-700 text-center pt-1">
            +{products.filter(p => p.status !== 'live').length} in pipeline
          </div>
        )}
      </div>
    </Widget>
  )
}
