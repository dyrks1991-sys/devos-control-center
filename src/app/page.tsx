import Link from 'next/link'
import StatCard from '@/components/StatCard'
import ActivityItem from '@/components/ActivityItem'
import { PRODUCTS, AGENTS, ACTIVITIES, APPROVALS, HEALTH_SCORE, LAST_UPDATED } from '@/lib/data'

const PIPELINE = ['Strategy', 'Planner', 'Bootstrap', 'Developer', 'QA', 'Deploy', 'Growth']

const urgentApprovals = APPROVALS.filter(a => a.priority === 'P0' || a.priority === 'P1').length

export default function ExecutiveOverview() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Last updated: {LAST_UPDATED}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          All Systems Operational
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard value={PRODUCTS.filter(p => p.status === 'live').length} label="Products Live" color="green" sublabel="QuickQR · ImageCompress · OGImageGen" />
        <StatCard value={`${AGENTS.filter(a => a.status === 'operational').length}/${AGENTS.length}`} label="Agents Online" color="green" sublabel="Full pipeline operational" />
        <StatCard value={urgentApprovals} label="Urgent Approvals" color="amber" sublabel="P0/P1 decisions pending" />
        <StatCard value="$0" label="Monthly Revenue" color="neutral" sublabel="Zero burn · Pre-revenue" />
      </div>

      {/* Company health */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Company Health</h2>
          <span className="text-2xl font-bold text-emerald-400">{HEALTH_SCORE.total}<span className="text-sm text-slate-400 font-normal">/100</span></span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${HEALTH_SCORE.total}%` }} />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {HEALTH_SCORE.breakdown.map((item) => (
            <div key={item.label} className="text-center">
              <div className={`text-sm font-bold ${item.color === 'emerald' ? 'text-emerald-400' : item.color === 'amber' ? 'text-amber-400' : 'text-red-400'}`}>
                {item.score}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline status */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-white mb-4">Agent Pipeline</h2>
        <div className="flex items-center gap-1 flex-wrap">
          {PIPELINE.map((agent, i) => (
            <div key={agent} className="flex items-center gap-1">
              <div className="flex items-center gap-2 bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-200">{agent}</span>
              </div>
              {i < PIPELINE.length - 1 && <span className="text-slate-600 text-xs">→</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">Full 7-agent pipeline operational · Sprint 8 · 2026-07-07</p>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Activity</h2>
            <Link href="/activity" className="text-xs text-slate-400 hover:text-slate-200">View all →</Link>
          </div>
          <div>
            {ACTIVITIES.slice(0, 5).map((a) => (
              <ActivityItem key={a.id} activity={a} />
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <h2 className="font-semibold text-white mb-4">CEO Action Queue</h2>
          <div className="space-y-3">
            <Link href="/approvals" className="flex items-center justify-between p-3 bg-red-400/5 border border-red-400/20 rounded-lg hover:border-red-400/40 transition-colors">
              <div>
                <div className="text-sm font-medium text-white">Pending Approvals</div>
                <div className="text-xs text-slate-400 mt-0.5">{urgentApprovals} urgent decisions blocking development and growth</div>
              </div>
              <span className="text-red-400 text-lg">→</span>
            </Link>
            <Link href="/brief" className="flex items-center justify-between p-3 bg-[#0f172a] border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
              <div>
                <div className="text-sm font-medium text-white">Read CEO Brief</div>
                <div className="text-xs text-slate-400 mt-0.5">Daily situation + priorities + risks</div>
              </div>
              <span className="text-slate-400 text-lg">→</span>
            </Link>
            <Link href="/analytics" className="flex items-center justify-between p-3 bg-amber-400/5 border border-amber-400/20 rounded-lg hover:border-amber-400/40 transition-colors">
              <div>
                <div className="text-sm font-medium text-white">Configure Analytics</div>
                <div className="text-xs text-slate-400 mt-0.5">Zero analytics on 3 live products — 2hr setup</div>
              </div>
              <span className="text-amber-400 text-lg">→</span>
            </Link>
            <Link href="/growth" className="flex items-center justify-between p-3 bg-[#0f172a] border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
              <div>
                <div className="text-sm font-medium text-white">Review Growth Packages</div>
                <div className="text-xs text-slate-400 mt-0.5">Social media + launch plans ready for all 3 products</div>
              </div>
              <span className="text-slate-400 text-lg">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
