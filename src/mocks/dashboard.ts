import type {
  ChartPoint,
  CrmOverviewData,
  DashboardStats,
} from '@/types'

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

export const crmOverview: CrmOverviewData = {
  newContactsThisMonth: 3,
  contactsAddedOverTime: [
    { label: 'Week 1', value: 1 },
    { label: 'Week 2', value: 0 },
    { label: 'Week 3', value: 1 },
    { label: 'Week 4', value: 1 },
  ],
  contactSources: [
    { label: 'Webinar', value: 1 },
    { label: 'Referral', value: 1 },
    { label: 'Outbound', value: 1 },
    { label: 'Trade show', value: 1 },
  ],
  dealsCreatedOverTime: [
    { label: 'Jul', value: 1 },
    { label: 'Aug', value: 2 },
    { label: 'Sep', value: 1 },
    { label: 'Oct', value: 2 },
  ],
  dealsByStage: [
    { label: 'Qualify', value: 2, color: '#005e5e' },
    { label: 'Discovery', value: 1, color: '#7eb8b8' },
    { label: 'Proposal', value: 1, color: '#a0ced9' },
    { label: 'Negotiation', value: 1, color: '#c84e8e' },
    { label: 'Closed Won', value: 1, color: '#33475b' },
  ],
  activityBreakdown: [
    { label: 'Call', value: 2 },
    { label: 'Email sent to contact', value: 4 },
    { label: 'Meeting', value: 1 },
    { label: 'Task', value: 2 },
  ],
  teamActivity: [
    { label: 'Unassigned', call: 2, meeting: 1, task: 2 },
  ],
  openTickets: 0,
  ticketStatuses: [],
}
