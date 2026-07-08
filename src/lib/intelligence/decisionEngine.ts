import type { Initiative, LearningRecord, DecisionEngineOutput } from '@/lib/types'
import { rankInitiatives, getAlternatives, getRankingInsights } from './ranking'
import { generateScenarios } from './simulation'
import { getLearningInsights, computeAvgAccuracy } from './learning'

export function runDecisionEngine(
  initiatives:     Initiative[],
  learningRecords: LearningRecord[],
): DecisionEngineOutput {
  const allRanked          = rankInitiatives(initiatives)
  const topRecommendation  = allRanked[0]
  const alternatives       = getAlternatives(initiatives, 3)
  const scenarios          = generateScenarios(initiatives)
  const rankingInsights    = getRankingInsights(allRanked)
  const learningInsights   = getLearningInsights(learningRecords)
  const avgForecastAccuracy = computeAvgAccuracy(learningRecords)

  const learningInsightsFiltered = [
    ...learningInsights,
    ...rankingInsights,
  ]

  return {
    generatedAt:        new Date().toISOString(),
    topRecommendation,
    alternatives,
    allRanked,
    scenarios,
    learningInsights:   learningInsightsFiltered,
    avgForecastAccuracy,
  }
}

export function formatROIScore(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Strong'
  if (score >= 50) return 'Moderate'
  if (score >= 35) return 'Weak'
  return 'Poor'
}

export function getRoiColor(score: number): string {
  if (score >= 70) return 'text-emerald-400'
  if (score >= 55) return 'text-amber-400'
  return 'text-red-400'
}

export function getRoiBg(score: number): string {
  if (score >= 70) return 'bg-emerald-400'
  if (score >= 55) return 'bg-amber-400'
  return 'bg-red-400'
}
