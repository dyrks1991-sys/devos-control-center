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
      <div className="space-y-3">
        {live.map(p => (
          <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
             className="flex items-center justify-between p-3 bg-[#0f172a] border border-slate-800 rounded-xl hover:border-slate-600 transition-colors">
            <div className="min-w-0">
              <div className="text-sm font-medium text-white">{p.name}</div>
              <div className="text-xs text-slate-500 mt-0.5 truncate">{p.tagline}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <SeoScore score={p.seoScore} size="sm" />
              <StatusPill status="live" showDot />
            </div>
          </a>
        ))}
        {products.filter(p => p.status !== 'live').length > 0 && (
          <div className="text-xs text-slate-600 text-center pt-1">
            +{products.filter(p => p.status !== 'live').length} in pipeline
          </div>
        )}
      </div>
    </Widget>
  )
}
