interface Props {
  value: string | number
  label: string
  color?: 'green' | 'amber' | 'red' | 'neutral' | 'blue'
  sublabel?: string
}

const colorMap = {
  green:   'text-emerald-400',
  amber:   'text-amber-400',
  red:     'text-red-400',
  blue:    'text-blue-400',
  neutral: 'text-slate-200',
}

export default function StatCard({ value, label, color = 'neutral', sublabel }: Props) {
  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 flex flex-col gap-1">
      <div className={`text-3xl font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      {sublabel && <div className="text-xs text-slate-600 mt-1">{sublabel}</div>}
    </div>
  )
}
