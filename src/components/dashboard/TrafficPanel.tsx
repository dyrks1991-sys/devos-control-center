import Link from 'next/link'
import { Widget, Metric } from '@/components/widgets'
import type { TrafficData } from '@/lib/datasources/ga4'

interface TrafficPanelProps {
  data: TrafficData
}

function Placeholder({ label }: { label: string }) {
  return (
    <div>
      <div className="text-xl font-bold text-slate-700 tabular-nums">—</div>
      <div className="text-xs text-slate-600 mt-1">{label}</div>
    </div>
  )
}

export default function TrafficPanel({ data }: TrafficPanelProps) {
  const isLive = data.connected && data.visitors !== null

  return (
    <Widget
      title="Traffic"
      subtitle={isLive ? 'Last 30 days · Google Analytics 4' : 'Last 30 days · Analytics not connected'}
      href="/analytics"
      action="Setup →"
      accent={isLive ? 'default' : 'amber'}
    >
      {!isLive && (
        <div className="flex items-center gap-2 bg-amber-400/5 border border-amber-400/20 rounded-lg px-3 py-2 mb-4 text-xs text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Connect GA4 to see live traffic
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {isLive ? (
          <>
            <Metric value={data.visitors!.toLocaleString()} label="Visitors" trend="unknown" color="white" />
            <Metric value={data.sessions!.toLocaleString()} label="Sessions" color="white" />
            <Metric value={data.pageViews!.toLocaleString()} label="Page Views" color="white" />
          </>
        ) : (
          <>
            <Placeholder label="Visitors" />
            <Placeholder label="Sessions" />
            <Placeholder label="Page Views" />
          </>
        )}
      </div>
      {isLive && (
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#1f2937]">
          <div>
            <div className="text-sm font-semibold text-white">{data.bounceRate?.toFixed(0)}%</div>
            <div className="text-xs text-slate-500">Bounce rate</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{data.returningRate?.toFixed(0)}%</div>
            <div className="text-xs text-slate-500">Return visitors</div>
          </div>
        </div>
      )}
      {!isLive && (
        <div className="pt-3 border-t border-[#1f2937]">
          <div className="text-xs text-slate-500 mb-2">Q3 Target</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-800 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-slate-700" style={{ width: '0%' }} />
            </div>
            <span className="text-xs text-slate-600">0 / 100 users</span>
          </div>
        </div>
      )}
    </Widget>
  )
}
