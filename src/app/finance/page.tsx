import { FINANCE } from '@/lib/data'

const REVENUE_ROADMAP = [
  { sprint: 9,  product: 'ImageCompress Pro', model: 'Subscription $4.99/mo', features: 'Batch processing, API access, priority support', mrr100: '$499' },
  { sprint: 10, product: 'OGImageGen Pro',     model: 'Subscription $4.99/mo', features: 'Custom fonts, brand presets, bulk export',       mrr100: '$499' },
  { sprint: 11, product: 'DevOS SaaS Tier',    model: 'Team plan $29/mo',      features: 'White-label pipeline, custom agents, reporting',  mrr100: '$2,900' },
]

export default function Finance() {
  const totalCosts = FINANCE.reduce((a, f) => a + f.monthly, 0)
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Finance Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">P&L · Costs · Revenue Roadmap</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <div className="text-3xl font-bold text-slate-300">$0</div>
          <div className="text-sm text-slate-400 mt-1">Monthly Revenue</div>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <div className="text-3xl font-bold text-emerald-400">$0</div>
          <div className="text-sm text-slate-400 mt-1">Monthly Burn</div>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <div className="text-3xl font-bold text-emerald-400">∞</div>
          <div className="text-sm text-slate-400 mt-1">Runway</div>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <div className="text-3xl font-bold text-slate-300">3</div>
          <div className="text-sm text-slate-400 mt-1">Live Products</div>
        </div>
      </div>

      {/* Zero burn callout */}
      <div className="bg-emerald-400/5 border border-emerald-400/30 rounded-xl p-5 mb-8">
        <div className="text-emerald-400 font-semibold mb-1">Zero Burn Rate — Infinite Runway</div>
        <p className="text-slate-400 text-sm">
          All infrastructure runs on free tiers (Vercel, GitHub). No paid tools. No employees. Net monthly cash flow: $0. The company can sustain its current operations indefinitely without external funding.
        </p>
      </div>

      {/* Infrastructure costs */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#1f2937]">
          <h2 className="font-semibold text-white">Infrastructure Costs</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f2937]">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Monthly</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody>
            {FINANCE.map((line, i) => (
              <tr key={line.category} className={i < FINANCE.length - 1 ? 'border-b border-[#1f2937]' : ''}>
                <td className="px-6 py-4 text-white">{line.category}</td>
                <td className="px-6 py-4 text-emerald-400 font-medium">${line.monthly}</td>
                <td className="px-6 py-4 text-slate-400">{line.notes}</td>
              </tr>
            ))}
            <tr className="border-t border-slate-700 bg-slate-900/50">
              <td className="px-6 py-4 font-semibold text-white">Total</td>
              <td className="px-6 py-4 font-bold text-emerald-400">${totalCosts}</td>
              <td className="px-6 py-4 text-slate-500">All free tiers</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Revenue roadmap */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f2937]">
          <h2 className="font-semibold text-white">Revenue Roadmap</h2>
          <p className="text-xs text-slate-400 mt-1">Projected at 100 paid users per product tier</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f2937]">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Sprint</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Product</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Model</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase hidden md:table-cell">Features</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">100 Users MRR</th>
            </tr>
          </thead>
          <tbody>
            {REVENUE_ROADMAP.map((row, i) => (
              <tr key={row.sprint} className={i < REVENUE_ROADMAP.length - 1 ? 'border-b border-[#1f2937]' : ''}>
                <td className="px-6 py-4">
                  <span className="text-xs border border-slate-700 rounded px-2 py-0.5 text-slate-300">Sprint {row.sprint}</span>
                </td>
                <td className="px-6 py-4 font-medium text-white">{row.product}</td>
                <td className="px-6 py-4 text-slate-300">{row.model}</td>
                <td className="px-6 py-4 text-slate-400 text-xs hidden md:table-cell">{row.features}</td>
                <td className="px-6 py-4 font-bold text-emerald-400">{row.mrr100}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
