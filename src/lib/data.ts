/**
 * data.ts — backward-compatibility shim
 *
 * All data now lives in src/data/*.json and is accessed via db.ts.
 * This file re-exports the same names that pages already import,
 * so no page changes are required.
 *
 * Migration: update page imports to use db.ts functions directly
 * (getProducts(), getAgents(), etc.) when convenient.
 */
export {
  getProducts    as PRODUCTS_FN,
  getAgents      as AGENTS_FN,
  getEvents      as EVENTS_FN,
  getDecisions   as DECISIONS_FN,
  getGrowthMetrics,
  getFinance,
  getHealthScore as HEALTH_FN,
} from './db'

import {
  getProducts,
  getAgents,
  getEvents,
  getDecisions,
  getGrowthMetrics,
  getFinance,
  getHealthScore,
  getKPIs,
  getProductKPIs,
  getQ3Targets,
  getCompanyStats,
  getTimeline,
  getRecommendations,
  getInitiatives,
  getLearningRecords,
  getDecisionEngineOutput,
  getConnectorReport,
} from './db'

export const PRODUCTS         = getProducts()
export const AGENTS           = getAgents()
export const ACTIVITIES       = getEvents()
export const APPROVALS        = getDecisions()
export const GROWTH_DATA      = getGrowthMetrics()
export const FINANCE          = getFinance()
export const HEALTH_SCORE     = getHealthScore()
export const KPIS             = getKPIs()
export const PRODUCT_KPIS     = getProductKPIs()
export const Q3_TARGETS       = getQ3Targets()
export const LAST_UPDATED     = getCompanyStats().lastUpdated
export const TIMELINE         = getTimeline()
export const RECOMMENDATIONS  = getRecommendations()
export const INITIATIVES      = getInitiatives()
export const LEARNING         = getLearningRecords()
export const DECISION_ENGINE  = getDecisionEngineOutput()
export const CONNECTORS       = getConnectorReport()
