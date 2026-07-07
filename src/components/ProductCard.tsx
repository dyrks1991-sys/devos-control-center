import type { Product } from '@/lib/types'

function seoColor(score: number) {
  if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
  if (score >= 60) return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
  return 'text-red-400 bg-red-400/10 border-red-400/30'
}

function seoGrade(score: number) {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2.5 py-1 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            LIVE
          </span>
          <h2 className="text-lg font-bold text-white">{product.name}</h2>
        </div>
        <div className="text-xs text-slate-500">Sprint {product.sprint}</div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">{product.description}</p>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-md px-2 py-1">
          QA {product.qaScore}
        </span>
        <span className={`text-xs border rounded-md px-2 py-1 ${seoColor(product.seoScore)}`}>
          SEO {product.seoScore}/100 ({seoGrade(product.seoScore)})
        </span>
      </div>

      <div className="text-xs text-slate-600 font-mono">{product.techStack}</div>

      <div className="flex gap-3 pt-1 border-t border-slate-800 text-xs">
        <a href={product.url} target="_blank" rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
          ↗ Live URL
        </a>
        <a href={product.github} target="_blank" rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-300 flex items-center gap-1">
          GitHub
        </a>
        <span className="text-slate-600 ml-auto">Launched {product.launchDate}</span>
      </div>
    </div>
  )
}
