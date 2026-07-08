interface SeoScoreProps {
  score:  number
  size?:  'sm' | 'md'
  showBar?: boolean
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-red-400'
}

function barColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400'
  if (score >= 60) return 'bg-amber-400'
  return 'bg-red-400'
}

export default function SeoScore({ score, size = 'md', showBar = true }: SeoScoreProps) {
  return (
    <div className="flex items-center gap-2.5">
      {showBar && (
        <div className="flex-1 bg-slate-800 rounded-full h-1.5 max-w-[64px]">
          <div className={`h-1.5 rounded-full ${barColor(score)}`} style={{ width: `${score}%` }} />
        </div>
      )}
      <span className={`font-bold tabular-nums ${size === 'sm' ? 'text-sm' : 'text-base'} ${scoreColor(score)}`}>
        {score}
      </span>
    </div>
  )
}
