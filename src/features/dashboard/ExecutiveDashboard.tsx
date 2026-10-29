import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ActionCard, DashboardShell } from '@/features/dashboard/dashboard-shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const headcountTrend = [
  { label: 'Jul', value: 118 },
  { label: 'Aug', value: 121 },
  { label: 'Sep', value: 124 },
  { label: 'Oct', value: 128 },
]

export function ExecutiveDashboard() {
  return (
    <DashboardShell
      title="Executive dashboard"
      description="Organization-wide people and growth visibility for leadership."
      stats={[
        { label: 'Headcount', value: 128, delta: { value: '+4 MoM', trend: 'up' } },
        { label: 'Pipeline', value: '€2.4M', delta: { value: '+8%', trend: 'up' }, href: '/customers/leads' },
        { label: 'Departments', value: 4, delta: { value: 'Active', trend: 'flat' }, href: '/people/employees' },
        { label: 'Open risks', value: 3, delta: { value: '-1', trend: 'down' } },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Headcount trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={headcountTrend}>
                <CartesianGrid stroke="var(--divider)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <ActionCard
            title="People directory"
            body="Review organization headcount and department composition."
            to="/people/employees"
            label="View employees"
          />
          <ActionCard
            title="Growth pipeline"
            body="Inspect CRM leads contributing to executive revenue outlook."
            to="/customers/leads"
            label="View leads"
          />
        </div>
      </div>
    </DashboardShell>
  )
}
