import { CONNECTORS } from '@/lib/data'
import { CONNECTOR_SETUP_GUIDE } from '@/lib/connectors'
import type { ConnectorStatus } from '@/lib/connectors'

function statusLabel(s: ConnectorStatus) {
  if (s === 'connected')    return { text: 'Live',          cls: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' }
  if (s === 'error')        return { text: 'Error',         cls: 'bg-red-400/10 text-red-400 border border-red-400/20' }
  if (s === 'unconfigured') return { text: 'Not Connected', cls: 'bg-amber-400/10 text-amber-400 border border-amber-400/20' }
  return                           { text: 'Mock Data',     cls: 'bg-slate-700/60 text-slate-400 border border-slate-600' }
}

function difficultyColor(d: string) {
  if (d === 'Easy')   return 'text-emerald-400'
  if (d === 'Medium') return 'text-amber-400'
  return 'text-red-400'
}

export default function IntegrationsPage() {
  const { ga4, searchConsole, github, vercel, connectedCount, totalCount, overallStatus } = CONNECTORS

  const connectors = [
    { result: ga4,           guide: CONNECTOR_SETUP_GUIDE[0], icon: '📊', label: 'Google Analytics 4' },
    { result: searchConsole, guide: CONNECTOR_SETUP_GUIDE[1], icon: '🔍', label: 'Search Console' },
    { result: github,        guide: CONNECTOR_SETUP_GUIDE[2], icon: '🐙', label: 'GitHub' },
    { result: vercel,        guide: CONNECTOR_SETUP_GUIDE[3], icon: '▲',  label: 'Vercel' },
  ]

  const overallBanner =
    overallStatus === 'all-connected' ? { text: 'All systems connected — live data active', cls: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' }
  : overallStatus === 'partial'       ? { text: `${connectedCount} of ${totalCount} connected — partial live data`, cls: 'bg-amber-400/10 border-amber-400/20 text-amber-400' }
  :                                     { text: 'No connectors active — all data is mock', cls: 'bg-slate-800 border-slate-700 text-slate-400' }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Integrations</h1>
          <p className="text-slate-400 text-sm">Connect DevOS to real-world data sources. Each connector auto-switches from mock to live when credentials are set.</p>
        </div>

        {/* Overall status */}
        <div className={`rounded-xl px-5 py-4 border mb-8 ${overallBanner.cls}`}>
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {overallStatus === 'all-connected' ? '✅' : overallStatus === 'partial' ? '⚠️' : '🔌'}
            </span>
            <div>
              <div className="font-semibold">{overallBanner.text}</div>
              <div className="text-xs opacity-70 mt-0.5">Last checked: {CONNECTORS.generatedAt.slice(0, 19).replace('T', ' ')} UTC</div>
            </div>
          </div>
        </div>

        {/* Connector cards */}
        <div className="grid gap-6 mb-10">
          {connectors.map(({ result, guide, icon, label }) => {
            const pill = statusLabel(result.status)
            return (
              <div key={label} className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
                {/* Card header */}
                <div className="flex items-start justify-between px-5 py-4 border-b border-[#30363d]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="font-semibold text-white">{label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{guide.meta.description}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${pill.cls}`}>{pill.text}</span>
                </div>

                <div className="px-5 py-4 grid md:grid-cols-2 gap-5">
                  {/* Required env vars */}
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Env Vars</div>
                    <div className="space-y-1.5">
                      {guide.meta.envVars.map(v => (
                        <div key={v} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${result.status === 'connected' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                          <code className="text-xs text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded">{v}</code>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <span className={`font-medium ${difficultyColor(guide.difficulty)}`}>{guide.difficulty}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{guide.timeEst}</span>
                    </div>
                  </div>

                  {/* Setup steps */}
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Setup Steps</div>
                    <ol className="space-y-1">
                      {guide.steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-400">
                          <span className="text-slate-600 shrink-0 font-mono">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Source + error footer */}
                {(result.error || result.status === 'connected') && (
                  <div className={`px-5 py-2.5 text-xs border-t border-[#30363d] ${result.error ? 'text-red-400 bg-red-400/5' : 'text-emerald-400 bg-emerald-400/5'}`}>
                    {result.error ? `⚠ ${result.error}` : `✓ Connected via ${result.source}`}
                    {result.latencyMs && <span className="ml-2 opacity-60">{result.latencyMs}ms</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Architecture note */}
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] px-5 py-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Architecture</div>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            {['Connector Layer\nsrc/lib/connectors/', 'Business Logic\nsrc/lib/intelligence/', 'Data Access\nsrc/lib/db.ts', 'UI Components\nsrc/components/'].map((block, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg px-3 py-3">
                {block.split('\n').map((line, j) => (
                  <div key={j} className={j === 0 ? 'text-xs font-medium text-white mb-1' : 'text-xs font-mono text-slate-500'}>{line}</div>
                ))}
                {i < 3 && <div className="hidden md:block text-slate-600 text-lg mt-2">→</div>}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">No connector updates UI directly. Adding a new integration requires only a new file in <code className="font-mono bg-slate-800 px-1 rounded">src/lib/connectors/</code> and registration in <code className="font-mono bg-slate-800 px-1 rounded">connectorManager.ts</code>.</p>
        </div>
      </div>
    </div>
  )
}
