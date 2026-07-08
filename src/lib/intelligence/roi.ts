import type { Initiative, ROIScores } from '@/lib/types'

// Weights sum to 1.0. Adjusted for Q3 priority: users + strategy dominate.
export const ROI_WEIGHTS: Record<keyof ROIScores, number> = {
  expectedRevenue:    0.15,
  expectedUsers:      0.20,
  seoImpact:          0.10,
  developmentTime:    0.15,
  codeReusability:    0.05,
  technicalRisk:      0.10,
  maintenanceCost:    0.05,
  strategicAlignment: 0.10,
  productSynergy:     0.05,
  confidence:         0.05,
}

export function computeROIScore(scores: ROIScores): number {
  let weighted = 0
  for (const [key, weight] of Object.entries(ROI_WEIGHTS) as [keyof ROIScores, number][]) {
    weighted += scores[key] * weight
  }
  // Scale to 0–100 (raw weighted sum is 1–10)
  return Math.round(weighted * 10)
}

export function scoreInitiative(initiative: Initiative): Initiative {
  return {
    ...initiative,
    roiScore: computeROIScore(initiative.scores),
  }
}

export function scoreAll(initiatives: Initiative[]): Initiative[] {
  return initiatives.map(scoreInitiative)
}

export function scoreBreakdown(scores: ROIScores): Array<{ label: string; score: number; weight: number; weighted: number }> {
  const labels: Record<keyof ROIScores, string> = {
    expectedRevenue:    'Revenue Potential',
    expectedUsers:      'User Acquisition',
    seoImpact:          'SEO Impact',
    developmentTime:    'Speed (Dev Time)',
    codeReusability:    'Code Reusability',
    technicalRisk:      'Technical Safety',
    maintenanceCost:    'Low Maintenance',
    strategicAlignment: 'Strategic Alignment',
    productSynergy:     'Product Synergy',
    confidence:         'Confidence',
  }
  return (Object.entries(scores) as [keyof ROIScores, number][]).map(([key, score]) => ({
    label:    labels[key],
    score,
    weight:   ROI_WEIGHTS[key],
    weighted: Math.round(score * ROI_WEIGHTS[key] * 10) / 10,
  }))
}
