import { PRODUCTS } from '@/lib/data'

const SETUP_STEPS = {
  ga4: [
    'Go to analytics.google.com → Create property',
    'Copy your Measurement ID (G-XXXXXXXXXX)',
    'Open src/lib/analytics.ts in each project',
    'Replace the GA4 stub with: gtag("config", "G-XXXXXXXXXX")',
    'Submit sitemap to Google Search Console',
  ],
  searchConsole: [
    'Go to search.google.com/search-console',
    'Add property → URL prefix → paste live URL',
    'Verify via HTML meta tag in layout.tsx metadata',
    'Submit sitemap: <live-url>/sitemap.xml',
  ],
  clarity: [
    'Go to clarity.microsoft.com → New project',
    'Copy Project ID',
    'Add Clarity script to src/app/layout.tsx',
    'Get heatmaps + session recordings for free',
  ],
  plausible: [
    'Sign up at plausible.io (paid, privacy-first)',
    'Add your domain',
    'Add script tag to src/app/layout.tsx',
    'View real-time dashboard without cookies or GDPR consent',
  ],
}

export default function Analytics() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Setup guides · Status · Configuration</p>
      </div>

      {/* Big warning */}
      <div className="bg-amber-400/5 border border-amber-400/40 rounded-xl p-6 mb-8">
        <div className="text-xl font-bold text-amber-400 mb-2">⚠ Analytics Not Configured</div>
        <p className="text-slate-300 leading-relaxed">
          Zero analytics configured on any of the 3 live products. Without analytics, the company has no data on user behavior, retention, or conversion. This must be resolved before running Reddit, HN, or Product Hunt launches.
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="text-slate-400">Estimated setup time: <span className="text-white font-medium">2 hours</span></div>
          <div className="text-slate-400">Products affected: <span className="text-white font-medium">3 / 3</span></div>
          <div className="text-slate-400">Priority: <span className="text-amber-400 font-medium">P1 — Before any launch</span></div>
        </div>
      </div>

      {/* Status table */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#1f2937]">
          <h2 className="font-semibold text-white">Current Status</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f2937]">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Product</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">GA4</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Search Console</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase hidden md:table-cell">Clarity</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase hidden md:table-cell">Plausible</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p, i) => (
              <tr key={p.id} className={i < PRODUCTS.length - 1 ? 'border-b border-[#1f2937]' : ''}>
                <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                {['GA4', 'Search Console', 'Clarity', 'Plausible'].map((tool, ti) => (
                  <td key={tool} className={`px-6 py-4 ${ti >= 2 ? 'hidden md:table-cell' : ''}`}>
                    <span className="text-xs text-red-400 bg-red-400/5 border border-red-400/20 rounded px-2 py-1">Not configured</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Setup guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: 'ga4',           title: 'Google Analytics 4',    color: 'blue',   rec: '⭐ Recommended first' },
          { id: 'searchConsole', title: 'Google Search Console', color: 'green',  rec: 'Required for SEO' },
          { id: 'clarity',       title: 'Microsoft Clarity',     color: 'purple', rec: 'Free heatmaps' },
          { id: 'plausible',     title: 'Plausible Analytics',   color: 'teal',   rec: 'Privacy-first alternative' },
        ].map(tool => (
          <div key={tool.id} className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{tool.title}</h3>
              <span className="text-xs text-slate-400">{tool.rec}</span>
            </div>
            <ol className="space-y-2">
              {SETUP_STEPS[tool.id as keyof typeof SETUP_STEPS].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-xs text-slate-500 font-mono mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <span className="text-slate-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}
