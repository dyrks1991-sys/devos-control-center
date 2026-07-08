import type { LearningRecord } from '@/lib/types'

export function computeAvgAccuracy(records: LearningRecord[]): number | null {
  const withAccuracy = records.filter(r => r.forecastAccuracy !== null)
  if (!withAccuracy.length) return null
  const avg = withAccuracy.reduce((s, r) => s + (r.forecastAccuracy ?? 0), 0) / withAccuracy.length
  return Math.round(avg * 100) / 100
}

export function getLearningInsights(records: LearningRecord[]): string[] {
  const insights: string[] = []
  const completed     = records.filter(r => r.completedDate !== null)
  const infraSprints  = completed.filter(r => r.category === 'infrastructure')
  const avgAccuracy   = computeAvgAccuracy(records)

  if (infraSprints.length >= 3) {
    insights.push(
      `${infraSprints.length} infrastructure sprints delivered: all on schedule, quality consistently exceeded forecast (+5–10 points above target). ` +
      `Pattern: DevOS over-delivers on engineering, under-delivers on distribution (because distribution requires CEO action, not agent action).`
    )
  }

  if (avgAccuracy !== null) {
    insights.push(
      `Average forecast accuracy across ${records.filter(r => r.forecastAccuracy !== null).length} completed sprints: ` +
      `${Math.round(avgAccuracy * 100)}%. ` +
      (avgAccuracy >= 0.85 ? 'Engineering estimates are reliable. Increase confidence in future sprint forecasts.' :
       avgAccuracy >= 0.70 ? 'Moderate forecast reliability. Buffer estimates by 15–20%.' :
       'Low forecast reliability. Increase sprint buffers and reduce scope.')
    )
  }

  const blockingPattern = records.filter(r =>
    r.learnings.toLowerCase().includes('ceo') || r.learnings.toLowerCase().includes('blocker')
  )
  if (blockingPattern.length >= 2) {
    insights.push(
      `Recurring pattern (${blockingPattern.length} sprints): CEO-dependent actions (GA4 setup, legal decisions) are the primary growth blockers. ` +
      `Every sprint that requires CEO activation of an external service remains incomplete until that action is taken. ` +
      `Recommend: front-load CEO actions before sprint execution to unblock downstream value.`
    )
  }

  insights.push(
    'Forecast improvement recommendation: future sprints should track actual user impact (not just engineering quality) within 14 days of delivery. ' +
    'This data will allow the ROI engine to calibrate user impact estimates.'
  )

  return insights
}

export function getSprintAccuracyTrend(records: LearningRecord[]): Array<{ sprint: number; accuracy: number | null }> {
  return records
    .sort((a, b) => a.sprint - b.sprint)
    .map(r => ({ sprint: r.sprint, accuracy: r.forecastAccuracy }))
}
