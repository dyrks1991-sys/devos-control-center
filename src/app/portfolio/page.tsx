import ProductCard from '@/components/ProductCard'
import { PRODUCTS } from '@/lib/data'

export default function Portfolio() {
  const live = PRODUCTS.filter(p => p.status === 'live')
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Product Portfolio</h1>
        <p className="text-slate-400 text-sm mt-1">
          {PRODUCTS.length} products · {live.length} live · 0 blocked
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
