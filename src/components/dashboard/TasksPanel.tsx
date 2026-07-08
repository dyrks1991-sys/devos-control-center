import Link from 'next/link'
import { Widget } from '@/components/widgets'

interface Task {
  id:       string
  label:    string
  detail:   string
  href:     string
  priority: 'critical' | 'high' | 'medium' | 'low'
  done:     boolean
}

// CEO action queue — updated each sprint
const CEO_TASKS: Task[] = [
  {
    id:       'analytics',
    label:    'Connect Google Analytics 4',
    detail:   'Create GA4 property → add NEXT_PUBLIC_GA_ID to Vercel env vars → redeploy (3 products)',
    href:     '/analytics',
    priority: 'critical',
    done:     false,
  },
  {
    id:       'search-console',
    label:    'Verify Google Search Console',
    detail:   'Add 3 URL-prefix properties → verify ownership → submit sitemaps',
    href:     '/analytics',
    priority: 'critical',
    done:     false,
  },
  {
    id:       'og-image-quickqr',
    label:    'Generate og.png for QuickQR',
    detail:   'Use OGImageGen to create 1200×630 PNG → save to projects/quickqr/public/og.png',
    href:     'https://ogimagegen.vercel.app',
    priority: 'high',
    done:     false,
  },
  {
    id:       'ph-prep',
    label:    'Prepare OGImageGen Product Hunt launch',
    detail:   'Screenshots, thumbnail, demo video → launch when Sprint 13 approved',
    href:     '/growth',
    priority: 'high',
    done:     false,
  },
  {
    id:       'legal-touchcut',
    label:    'Resolve touchcut legal blockers',
    detail:   'P0: yt-dlp ToS review. P1: GPU pricing model. P1: DMCA liability.',
    href:     '/approvals',
    priority: 'medium',
    done:     false,
  },
]

const priorityColor: Record<Task['priority'], string> = {
  critical: 'text-red-400',
  high:     'text-amber-400',
  medium:   'text-blue-400',
  low:      'text-slate-500',
}

export default function TasksPanel() {
  const open   = CEO_TASKS.filter(t => !t.done)
  const closed = CEO_TASKS.filter(t => t.done)

  return (
    <Widget
      title="CEO Action Queue"
      subtitle={`${open.length} open tasks`}
      href="/approvals"
      action="All decisions →"
    >
      <div className="space-y-2">
        {open.map(task => (
          <Link key={task.id} href={task.href}
            className="flex items-start gap-3 p-3 bg-[#0f172a] border border-slate-800 rounded-xl hover:border-slate-600 transition-colors block">
            <span className={`text-xs font-bold mt-0.5 uppercase shrink-0 ${priorityColor[task.priority]}`}>
              {task.priority === 'critical' ? 'P0' : task.priority === 'high' ? 'P1' : task.priority === 'medium' ? 'P2' : 'P3'}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white leading-tight">{task.label}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">{task.detail}</div>
            </div>
            <span className="text-slate-600 shrink-0 mt-0.5">→</span>
          </Link>
        ))}
        {closed.length > 0 && (
          <div className="text-xs text-slate-600 text-center pt-1">{closed.length} completed tasks hidden</div>
        )}
      </div>
    </Widget>
  )
}
