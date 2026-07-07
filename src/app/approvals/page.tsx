import ApprovalCard from '@/components/ApprovalCard'
import { APPROVALS } from '@/lib/data'

export default function Approvals() {
  const blocking = APPROVALS.filter(a => a.category === 'blocking')
  const growth   = APPROVALS.filter(a => a.category === 'growth')
  const p0Count  = APPROVALS.filter(a => a.priority === 'P0').length
  const urgent   = APPROVALS.filter(a => a.priority === 'P0' || a.priority === 'P1').length

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Pending Approvals</h1>
        <p className="text-slate-400 text-sm mt-1">
          {APPROVALS.length} pending decisions · {urgent} urgent (P0/P1) · {p0Count} blocking development
        </p>
      </div>

      {/* Summary banner */}
      {p0Count > 0 && (
        <div className="bg-red-400/5 border border-red-400/30 rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-red-400 text-xl">⛔</span>
          <div>
            <div className="font-semibold text-red-400">Development Blocked</div>
            <div className="text-sm text-slate-400 mt-1">
              {blocking.length} legal/business decisions are preventing development of touchcut — which has the highest strategy score (P0 priority). CEO action required to unblock.
            </div>
          </div>
        </div>
      )}

      {/* Blocking decisions */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-semibold text-white">Blocking Decisions</h2>
          <span className="text-xs bg-red-400/10 text-red-400 border border-red-400/30 rounded-full px-2 py-0.5">{blocking.length} decisions</span>
        </div>
        <div className="space-y-4">
          {blocking.map(a => <ApprovalCard key={a.id} approval={a} />)}
        </div>
      </div>

      {/* Growth decisions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-semibold text-white">Growth Decisions</h2>
          <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-full px-2 py-0.5">{growth.length} decisions</span>
        </div>
        <div className="space-y-4">
          {growth.map(a => <ApprovalCard key={a.id} approval={a} />)}
        </div>
      </div>
    </div>
  )
}
