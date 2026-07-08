export type {
  ConnectorStatus,
  ConnectorMeta,
  ConnectorResult,
  ConnectorReport,
  GA4Data,
  GA4DeviceBreakdown,
  GA4CountryData,
  GA4TrafficSource,
  GA4PageData,
  SearchConsoleData,
  SearchConsoleQuery,
  SearchConsolePage,
  GitHubData,
  GitHubRepo,
  GitHubCommit,
  GitHubPR,
  VercelData,
  VercelDeployment,
  BuildStatus,
} from './types'

export { getGA4Data, GA4_META }                         from './ga4'
export { getSearchConsoleData, SEARCH_CONSOLE_META }    from './searchConsole'
export { getGitHubData, getGitHubDataSync, GITHUB_META } from './github'
export { getVercelData, getVercelDataSync, VERCEL_META }  from './vercel'
export {
  getConnectorReport,
  getConnectorReportAsync,
  CONNECTOR_SETUP_GUIDE,
}                                                       from './connectorManager'
