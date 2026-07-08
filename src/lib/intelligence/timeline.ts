import path from 'path'
import fs   from 'fs'
import type { TimelineEvent } from '@/lib/types'

const DEVOS_ROOT = path.resolve(process.cwd(), '../..')

function readJSON<T>(rel: string): T {
  const abs  = path.join(DEVOS_ROOT, 'company', rel)
  const data = path.join(process.cwd(), 'src', 'data', rel)
  const src  = fs.existsSync(data) ? data : abs
  return JSON.parse(fs.readFileSync(src, 'utf-8')) as T
}

export function getTimeline(): TimelineEvent[] {
  try {
    const raw = readJSON<TimelineEvent[]>('timeline.json')
    return raw.sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}
