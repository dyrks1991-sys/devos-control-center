import { Widget, StatusPill } from '@/components/widgets'
import type { Agent } from '@/lib/types'

interface AgentPanelProps {
  agents: Agent[]
}

const PIPELINE_ORDER = ['strategy', 'planner', 'bootstrap', 'developer', 'qa', 'deploy', 'growth']

export default function AgentPanel({ agents }: AgentPanelProps) {
  const sorted    = [...agents].sort((a, b) => PIPELINE_ORDER.indexOf(a.id) - PIPELINE_ORDER.indexOf(b.id))
  const online    = agents.filter(a => a.status === 'operational').length
  const sdkVersion = 'v1.0.0'

  return (
    <Widget
      title="Agent Pipeline"
      subtitle={`${online}/${agents.length} operational · SDK ${sdkVersion}`}
      href="/agents"
    >
      <div className="space-y-2">
        {sorted.map((agent, i) => (
          <div key={agent.id} className="flex items-center gap-3">
            {/* Step number */}
            <span className="text-xs text-slate-600 font-mono w-4 text-right flex-shrink-0">{i + 1}</span>

            {/* Agent row */}
            <div className="flex-1 flex items-center justify-between bg-[#0f172a] border border-slate-800 rounded-lg px-3 py-2">
              <div>
                <span className="text-sm text-slate-200">{agent.name}</span>
                <span className="text-xs text-slate-600 ml-2">{agent.version}</span>
              </div>
              <StatusPill
                status={agent.status === 'operational' ? 'ok' : agent.status === 'degraded' ? 'warning' : 'offline'}
                label={agent.status === 'operational' ? 'Online' : agent.status}
                showDot
              />
            </div>

            {/* Arrow between agents */}
            {i < sorted.length - 1 && (
              <span className="text-slate-700 text-xs flex-shrink-0">↓</span>
            )}
          </div>
        ))}
      </div>
    </Widget>
  )
}
