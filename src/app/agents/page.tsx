import { AGENTS } from '@/lib/data'

const PIPELINE_STEPS = [
  { name: 'Strategy',  desc: 'Score & rank ideas' },
  { name: 'Planner',   desc: 'Generate 7 docs' },
  { name: 'Bootstrap', desc: 'Scaffold project' },
  { name: 'Developer', desc: 'Execute tasks' },
  { name: 'QA',        desc: '15 Playwright tests' },
  { name: 'Deploy',    desc: 'GitHub + Vercel' },
  { name: 'Growth',    desc: 'SEO + social + KPI' },
]

export default function Agents() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Agent Status</h1>
        <p className="text-slate-400 text-sm mt-1">
          {AGENTS.filter(a => a.status === 'operational').length}/{AGENTS.length} agents operational
        </p>
      </div>

      {/* Agent table */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm" aria-label="Agent status table">
          <thead>
            <tr className="border-b border-[#1f2937]">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Agent</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide hidden md:table-cell">File</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Version</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide hidden lg:table-cell">Sprint</th>
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((agent, i) => (
              <tr key={agent.id} className={i < AGENTS.length - 1 ? 'border-b border-[#1f2937]' : ''}>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{agent.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5 hidden sm:block">{agent.description}</div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <code className="text-xs text-slate-400 bg-[#0f172a] px-2 py-1 rounded">{agent.file}</code>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs border border-slate-700 rounded px-2 py-0.5 text-slate-300">{agent.version}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-400">Operational</span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-xs text-slate-500">Sprint {agent.sprint}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pipeline visualization */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
        <h2 className="font-semibold text-white mb-5">Pipeline Visualization</h2>
        <div className="flex flex-wrap items-stretch gap-2">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.name} className="flex items-center gap-2">
              <div className="bg-[#0f172a] border border-emerald-400/30 rounded-lg px-4 py-3 text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-white">{step.name}</span>
                </div>
                <div className="text-xs text-slate-500">{step.desc}</div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <span className="text-slate-600 text-sm">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Full 7-agent pipeline operational since Sprint 8 · 2026-07-07
        </p>
      </div>
    </div>
  )
}
