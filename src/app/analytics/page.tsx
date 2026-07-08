import { PRODUCTS, PRODUCT_KPIS } from '@/lib/data'

const PRODUCTS_ANALYTICS = [
  { id: 'quickqr',       envVar: 'NEXT_PUBLIC_GA_ID', url: 'https://quickqr-gray.vercel.app' },
  { id: 'imagecompress', envVar: 'NEXT_PUBLIC_GA_ID', url: 'https://imagecompress-jet.vercel.app' },
  { id: 'ogimagegen',   envVar: 'NEXT_PUBLIC_GA_ID', url: 'https://ogimagegen.vercel.app' },
]

export default function Analytics() {
  const connectedCount = PRODUCT_KPIS.filter(k => k.analyticsConnected).length
  const totalProducts  = PRODUCT_KPIS.length

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">GA4 connection status · Setup guide · Search Console</p>
      </div>

      {/* Status summary */}
      <div className="bg-amber-400/5 border border-amber-400/40 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-amber-400 text-xl mt-0.5">⚠</span>
          <div className="flex-1">
            <div className="font-semibold text-amber-400 mb-1">
              Analytics not connected ({connectedCount}/{totalProducts} products)
            </div>
            <p className="text-sm text-slate-300">
              GA4 code is deployed in all products. Add your Measurement ID to each project&apos;s Vercel environment variables to activate tracking.
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 flex-shrink-0">
            <div>Setup time</div>
            <div className="text-white font-medium">~2 hours</div>
          </div>
        </div>
      </div>

      {/* Per-product connection table */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#1f2937]">
          <h2 className="font-semibold text-white">Connection Status</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f2937]">
              {['Product', 'GA4', 'Search Console', 'Environment Variable', 'Action'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p, i) => {
              const kpi  = PRODUCT_KPIS.find(k => k.productId === p.id)
              const meta = PRODUCTS_ANALYTICS.find(m => m.id === p.id)
              return (
                <tr key={p.id} className={i < PRODUCTS.length - 1 ? 'border-b border-[#1f2937]' : ''}>
                  <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                  <td className="px-6 py-4">
                    {kpi?.analyticsConnected
                      ? <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded px-2 py-1">Connected</span>
                      : <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded px-2 py-1">Code deployed</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500 border border-slate-700 rounded px-2 py-1">Needs verification</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{meta?.envVar}</td>
                  <td className="px-6 py-4 text-xs text-blue-400">
                    Add in Vercel env settings →
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Setup steps 2×2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Google Analytics 4</h3>
            <span className="text-xs text-blue-400">⭐ Step 1</span>
          </div>
          <ol className="space-y-2">
            {[
              'Go to analytics.google.com → Create property',
              'Set up a "Web" data stream → enter each product URL',
              'Copy the Measurement ID (G-XXXXXXXXXX)',
              'In Vercel: Project Settings → Environment Variables',
              'Add NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX for each project',
              'Redeploy — GA4 activates automatically',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-xs text-slate-500 font-mono mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span className="text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Google Search Console</h3>
            <span className="text-xs text-green-400">Step 2</span>
          </div>
          <ol className="space-y-2">
            {[
              'Go to search.google.com/search-console',
              'Add property → URL prefix → paste Vercel URL',
              'Verify via HTML meta tag — copy the verification code',
              'Add to layout.tsx: verification: { google: "CODE" }',
              'Redeploy to confirm ownership',
              'Submit sitemap: <url>/sitemap.xml (all 3 products have one)',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-xs text-slate-500 font-mono mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span className="text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">After GA4 is Live</h3>
            <span className="text-xs text-slate-400">Verify</span>
          </div>
          <ol className="space-y-2">
            {[
              'GA4 → Real-time view → visit any product URL',
              'Confirm your visit appears within 30 seconds',
              'Add conversion: file_downloaded (ImageCompress, OGImageGen)',
              'Add conversion: qr_downloaded (QuickQR)',
              'Update db.ts: set analyticsConnected: true per product',
              'Growth Dashboard will populate automatically',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-xs text-slate-500 font-mono mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span className="text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Events Tracked Automatically</h3>
            <span className="text-xs text-slate-400">GA4 built-in</span>
          </div>
          <div className="space-y-2.5">
            {[
              { event: 'page_view',     desc: 'Visitors, sessions, pageviews' },
              { event: 'session_start', desc: 'Bounce rate, session duration' },
              { event: 'first_visit',   desc: 'New vs returning users' },
              { event: 'scroll',        desc: 'Scroll depth — FAQ engagement' },
              { event: 'click',         desc: 'Outbound / internal link clicks' },
            ].map(({ event, desc }) => (
              <div key={event} className="flex items-center gap-3 text-sm">
                <span className="font-mono text-xs text-blue-400 flex-shrink-0 w-28">{event}</span>
                <span className="text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
