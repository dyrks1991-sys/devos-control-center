'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">

        {/* Logo */}
        <div className="w-20 h-20 bg-[#0f172a] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#30363d]">
          <span className="text-emerald-400 font-black text-4xl">D</span>
        </div>

        {/* Status */}
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 mb-5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-medium">Offline</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">You're offline</h1>
        <p className="text-slate-400 text-sm mb-8">
          DevOS needs a connection to load live data. Cached pages may still be available.
        </p>

        {/* Cached pages */}
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-4 mb-6 text-left">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Available offline</div>
          <div className="space-y-2">
            {[
              { href: '/',            label: 'Overview',     sub: 'CEO Dashboard' },
              { href: '/brief',       label: 'AI Brief',     sub: "Today's briefing" },
              { href: '/decisions',   label: 'Decisions',    sub: 'ROI ranking' },
              { href: '/portfolio',   label: 'Portfolio',    sub: 'Products & KPIs' },
              { href: '/integrations', label: 'Integrations', sub: 'Connector status' },
            ].map(({ href, label, sub }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />
                <div>
                  <div className="text-sm text-white">{label}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
