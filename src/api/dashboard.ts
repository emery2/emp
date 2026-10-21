import { delay } from '@/mocks/delay'
import {
  dashboardStats,
  headcountTrend,
  pipelineByStage,
} from '@/mocks/dashboard'
import type { ChartPoint, DashboardStats } from '@/types'

export const dashboardKeys = {
  stats: ['dashboard', 'stats'] as const,
  headcount: ['dashboard', 'headcount'] as const,
  pipeline: ['dashboard', 'pipeline'] as const,
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
