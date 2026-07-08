import type { TimelineEvent, TimelineEventType } from '@/lib/types'

const TYPE_CONFIG: Record<TimelineEventType, { label: string; dot: string; badge: string }> = {
  sprint:       { label: 'Sprint',        dot: 'bg-emerald-400',  badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  deploy:       { label: 'Deploy',        dot: 'bg-blue-400',     badge: 'bg-blue-400/10 text-blue-400 border-blue-400/20' },
  launch:       { label: 'Product Launch',dot: 'bg-amber-400',    badge: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  architecture: { label: 'Architecture',  dot: 'bg-purple-400',   badge: 'bg-purple-400/10 text-purple-400 border-purple-400/20' },
  growth:       { label: 'Growth',        dot: 'bg-teal-400',     badge: 'bg-teal-400/10 text-teal-400 border-teal-400/20' },
  milestone:    { label: 'Milestone',     dot: 'bg-white',        badge: 'bg-white/10 text-white border-white/20' },
  agent:        { label: 'Agent',         dot: 'bg-indigo-400',   badge: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20' },
}

const STATUS_STYLES: Record<string, string> = {
  success:     'opacity-100',
  'in-progress': 'opacity-100',
  planned:     'opacity-50',
}

interface Props {
  events: TimelineEvent[]
}

export default function TimelineView({ events }: Props) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[9px] top-3 bottom-3 w-px bg-[#1f2937]" />

      <div className="space-y-0">
        {events.map((ev, idx) => {
          const cfg     = TYPE_CONFIG[ev.type]
          const opacity = STATUS_STYLES[ev.status ?? 'success']
          const isLast  = idx === events.length - 1

          return (
            <div key={ev.id} className={`relative flex gap-4 pb-6 ${isLast ? 'pb-0' : ''} ${opacity}`}>
              {/* Dot */}
              <div className="flex-shrink-0 w-5 flex items-start justify-center pt-1">
                <span className={`inline-block w-2.5 h-2.5 rounded-full border-2 border-[#0a0a0a] ${cfg.dot} ${ev.status === 'in-progress' ? 'animate-pulse' : ''}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-start gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] font-medium border rounded-full px-2 py-0.5 flex-shrink-0 ${cfg.badge}`}>
                    {ev.type === 'sprint' && ev.sprint ? `Sprint ${ev.sprint}` : cfg.label}
                  </span>
                  {ev.status === 'in-progress' && (
                    <span className="text-[10px] font-medium text-amber-400 border border-amber-400/30 rounded-full px-2 py-0.5">
                      In Progress
                    </span>
                  )}
                  <span className="text-xs text-slate-600 ml-auto flex-shrink-0">{ev.date}</span>
                </div>
                <div className="font-medium text-sm text-white leading-snug mb-1">{ev.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{ev.description}</p>
                {ev.product && (
                  <span className="inline-block mt-1.5 text-[10px] text-slate-500 border border-slate-800 rounded px-1.5 py-0.5">
                    {ev.product}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
