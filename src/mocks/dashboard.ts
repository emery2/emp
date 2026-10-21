import type { ChartPoint, DashboardStats } from '@/types'

export const dashboardStats: DashboardStats = {
  headcount: 93,
  headcountDelta: '+4 this month',
  openLeave: 7,
  openLeaveDelta: '2 pending',
  pipelineValue: 411000,
  pipelineDelta: '+12% vs last month',
  openTickets: 14,
  openTicketsDelta: '3 overdue',
}

export const headcountTrend: ChartPoint[] = [
  { label: 'May', value: 82 },
  { label: 'Jun', value: 85 },
  { label: 'Jul', value: 87 },
  { label: 'Aug', value: 89 },
  { label: 'Sep', value: 91 },
  { label: 'Oct', value: 93 },
]

export const pipelineByStage: ChartPoint[] = [
  { label: 'Qualify', value: 130000 },
  { label: 'Discovery', value: 125000 },
  { label: 'Proposal', value: 48000 },
  { label: 'Negotiation', value: 72000 },
  { label: 'Closed', value: 36000 },
]
