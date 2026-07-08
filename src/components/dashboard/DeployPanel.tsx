import { Widget, StatusPill } from '@/components/widgets'
import type { VercelData, BuildStatus } from '@/lib/datasources/vercel'

interface DeployPanelProps {
  data: VercelData
}

function buildStatusVariant(s: BuildStatus): 'ok' | 'building' | 'warning' | 'offline' | 'mock' {
  if (s === 'ready')    return 'ok'
  if (s === 'building') return 'building'
  if (s === 'error')    return 'offline'
  return 'mock'
}

export default function DeployPanel({ data }: DeployPanelProps) {
  const allReady = data.deployments.every(d => d.status === 'ready')

  return (
    <Widget
      title="Deployments"
      subtitle={data.connected ? 'Vercel · live' : 'Vercel · mock data'}
      accent={allReady ? 'default' : 'amber'}
    >
      {!data.connected && (
        <div className="text-xs text-slate-600 bg-slate-800/50 rounded-lg px-3 py-2 mb-3">
          Connect <span className="text-slate-400">VERCEL_TOKEN</span> env var for live deployment status
        </div>
      )}
      <div className="space-y-2">
        {data.deployments.map(d => (
          <div key={d.projectId} className="flex items-center justify-between py-2 border-b border-[#1f2937] last:border-0">
            <div className="min-w-0">
              <div className="text-sm text-white font-medium">{d.projectName}</div>
              <div className="text-xs text-slate-500 mt-0.5 truncate">{d.commit}</div>
            </div>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <span className="text-xs text-slate-600">{d.deployedAt}</span>
              <StatusPill
                status={buildStatusVariant(d.status)}
                label={d.status === 'ready' ? 'Live' : d.status}
              />
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}
