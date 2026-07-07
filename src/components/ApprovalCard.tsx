import type { Approval } from '@/lib/types'

const priorityStyle: Record<string, string> = {
  P0: 'text-red-400 bg-red-400/10 border-red-400/40',
  P1: 'text-amber-400 bg-amber-400/10 border-amber-400/40',
  P2: 'text-blue-400 bg-blue-400/10 border-blue-400/40',
  P3: 'text-slate-400 bg-slate-400/10 border-slate-400/40',
}

export default function ApprovalCard({ approval }: { approval: Approval }) {
  return (
    <div className={`bg-[#111827] border rounded-xl p-5 ${approval.priority === 'P0' ? 'border-red-900/50' : 'border-[#1f2937]'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold border rounded px-2 py-0.5 ${priorityStyle[approval.priority]}`}>
            {approval.priority}
          </span>
          <span className="text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">
            {approval.project}
          </span>
        </div>
        <span className="text-xs text-slate-600 flex-shrink-0">Since {approval.since}</span>
      </div>
      <h3 className="text-sm font-semibold text-white mb-2">{approval.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{approval.description}</p>
      {approval.priority === 'P0' && (
        <div className="mt-3 text-xs text-red-400 bg-red-400/5 border border-red-400/20 rounded px-3 py-2">
          CEO action required — blocking product development
        </div>
      )}
    </div>
  )
}
