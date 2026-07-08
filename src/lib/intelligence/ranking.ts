import type { Initiative } from '@/lib/types'
import { scoreAll } from './roi'

export function rankInitiatives(initiatives: Initiative[]): Initiative[] {
  const scored = scoreAll(initiatives.filter(i => i.status === 'pending' || i.status === 'approved'))
  return scored
    .sort((a, b) => (b.roiScore ?? 0) - (a.roiScore ?? 0))
    .map((initiative, idx) => ({ ...initiative, rank: idx + 1 }))
}

export function getTopRecommendation(initiatives: Initiative[]): Initiative | null {
  const ranked = rankInitiatives(initiatives)
  return ranked[0] ?? null
}

export function getAlternatives(initiatives: Initiative[], count = 3): Initiative[] {
  const ranked = rankInitiatives(initiatives)
  return ranked.slice(1, count + 1)
}

export function getRankingInsights(ranked: Initiative[]): string[] {
  const insights: string[] = []

  const top = ranked[0]
  const bottom = ranked[ranked.length - 1]

  if (top) {
    insights.push(
      `Top opportunity "${top.shortTitle}" scores ${top.roiScore}/100 — ` +
      `highest because ${top.scores.developmentTime >= 8 ? 'low time investment' : 'high user impact'} ` +
      `and ${top.scores.confidence >= 8 ? 'high confidence' : top.scores.strategicAlignment >= 8 ? 'strong strategic fit' : 'measurable ROI'}.`
    )
  }

  const quickWins = ranked.filter(i => (i.roiScore ?? 0) >= 60 && i.scores.developmentTime >= 8)
  if (quickWins.length > 1) {
    insights.push(
      `${quickWins.length} quick wins identified (score ≥ 60, fast to execute): ` +
      quickWins.map(i => i.shortTitle).join(', ') + '.'
    )
  }

  const highRisk = ranked.filter(i => i.scores.technicalRisk <= 4)
  if (highRisk.length) {
    insights.push(
      `${highRisk.length} initiative${highRisk.length > 1 ? 's' : ''} carry elevated technical risk: ` +
      highRisk.map(i => i.shortTitle).join(', ') + '. Proceed with caution.'
    )
  }

  if (bottom && (bottom.roiScore ?? 0) < 50) {
    insights.push(
      `"${bottom.shortTitle}" ranks last (${bottom.roiScore}/100). ` +
      `High risk, long timeline, or low user impact currently outweigh the potential. Revisit when situation changes.`
    )
  }

  return insights
}