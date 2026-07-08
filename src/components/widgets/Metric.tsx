type Trend = 'up' | 'down' | 'flat' | 'unknown'

interface MetricProps {
  value:    string | number
  label:    string
  sublabel?: string
  trend?:   Trend
  color?:   'white' | 'emerald' | 'amber' | 'red' | 'blue' | 'slate'
  size?:    'sm' | 'md' | 'lg'
}

const colorMap: Record<string, string> = {
  white:   'text-white',
  emerald: 'text-emerald-400',
  amber:   'text-amber-400',
  red:     'text-red-400',
  blue:    'text-blue-400',
  slate:   'text-slate-400',
}

const sizeMap: Record<string, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
}

const trendIcon: Record<Trend, string> = {
  up:      '↑',
  down:    '↓',
  flat:    '→',
  unknown: '—',
}
const trendColor: Record<Trend, string> = {
  up:      'text-emerald-400',
  down:    'text-red-400',
  flat:    'text-slate-400',
  unknown: 'text-slate-600',
}

export default function Metric({ value, label, sublabel, trend, color = 'white', size = 'md' }: MetricProps) {
  return (
    <div>
      <div className="flex items-end gap-2">
        <span className={`font-bold tabular-nums leading-none ${sizeMap[size]} ${colorMap[color]}`}>
          {value}
        </span>
        {trend && trend !== 'unknown' && (
          <span className={`text-sm mb-0.5 ${trendColor[trend]}`}>{trendIcon[trend]}</span>
        )}
      </div>
      <div className="text-xs text-slate-400 mt-1 leading-tight">{label}</div>
      {sublabel && <div className="text-xs text-slate-600 mt-0.5">{sublabel}</div>}
    </div>
  )
}
