import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ActionCard, DashboardShell } from '@/features/dashboard/dashboard-shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const portfolio = [
  { label: 'Q1', value: 82 },
  { label: 'Q2', value: 88 },
  { label: 'Q3', value: 91 },
  { label: 'Q4', value: 86 },
]

export function BoardDashboard() {
  return (
    <DashboardShell
      title="Board overview"
      description="Governance KPIs and portfolio health for board members."
      stats={[
        { label: 'Strategic score', value: '91', delta: { value: '+3 pts', trend: 'up' } },
        { label: 'Risk index', value: '12', delta: { value: 'Stable', trend: 'flat' } },
        { label: 'CapEx utilization', value: '74%', delta: { value: '+2%', trend: 'up' } },
        {
          label: 'Org reports',
          value: 'View',
          href: '/reports',
          delta: { value: 'Open portfolio', trend: 'flat' },
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio performance</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolio}>
                <CartesianGrid stroke="var(--divider)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <ActionCard
          title="Board reporting"
          body="Open organization reports for board packs and risk summaries."
          to="/reports"
          label="Open reports"
        />
      </div>
    </DashboardShell>
  )
}
