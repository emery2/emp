import { delay } from '@/mocks/delay'
import {
  crmOverview,
  dashboardStats,
  headcountTrend,
  pipelineByStage,
} from '@/mocks/dashboard'
import type { ChartPoint, CrmOverviewData, DashboardStats } from '@/types'

export const dashboardKeys = {
  stats: ['dashboard', 'stats'] as const,
  headcount: ['dashboard', 'headcount'] as const,
  pipeline: ['dashboard', 'pipeline'] as const,
  crmOverview: ['dashboard', 'crm-overview'] as const,
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay()
  return dashboardStats
}

export async function fetchHeadcountTrend(): Promise<ChartPoint[]> {
  await delay()
  return headcountTrend
}

export async function fetchPipelineChart(): Promise<ChartPoint[]> {
  await delay()
  return pipelineByStage
}

export async function fetchCrmOverview(): Promise<CrmOverviewData> {
  await delay()
  return crmOverview
}
