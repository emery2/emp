import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  dashboardKeys,
  fetchDashboardStats,
  fetchHeadcountTrend,
  fetchPipelineChart,
} from '@/api/dashboard'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { StatCard } from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { roleLabels } from '@/lib/rbac'

export function DashboardPage() {
  const { user } = useAuth()
  const statsQuery = useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: fetchDashboardStats,
  })
  const headcountQuery = useQuery({
    queryKey: dashboardKeys.headcount,
    queryFn: fetchHeadcountTrend,
  })
  const pipelineQuery = useQuery({
    queryKey: dashboardKeys.pipeline,
    queryFn: fetchPipelineChart,
  })

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.firstName ?? 'there'}`}
        description={`${roleLabels[user?.role ?? 'employee']} overview for your organization.`}
      />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Headcount"
          value={
            statsQuery.data ? formatNumber(statsQuery.data.headcount) : '—'
          }
          delta={
            statsQuery.data
              ? { value: statsQuery.data.headcountDelta, trend: 'up' }
              : undefined
          }
          href="/people/employees"
          isLoading={statsQuery.isLoading}
        />
        <StatCard
          label="Open leave"
          value={statsQuery.data?.openLeave ?? '—'}
          delta={
            statsQuery.data
              ? { value: statsQuery.data.openLeaveDelta, trend: 'flat' }
              : undefined
          }
          href="/people/leave"
          isLoading={statsQuery.isLoading}
        />
        <StatCard
          label="Pipeline"
          value={
            statsQuery.data
              ? formatCurrency(statsQuery.data.pipelineValue)
              : '—'
          }
          delta={
            statsQuery.data
              ? { value: statsQuery.data.pipelineDelta, trend: 'up' }
              : undefined
          }
          href="/customers/pipeline"
          isLoading={statsQuery.isLoading}
        />
        <StatCard
          label="Open tickets"
          value={statsQuery.data?.openTickets ?? '—'}
          delta={
            statsQuery.data
              ? { value: statsQuery.data.openTicketsDelta, trend: 'down' }
              : undefined
          }
          href="/support/tickets"
          isLoading={statsQuery.isLoading}
        />
      </div>
      {statsQuery.isError ? (
        <div className="mb-6">
          <QueryError
            message={statsQuery.error.message}
            onRetry={() => void statsQuery.refetch()}
          />
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Headcount trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {headcountQuery.isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : headcountQuery.isError ? (
              <QueryError
                message={headcountQuery.error.message}
                onRetry={() => void headcountQuery.refetch()}
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={headcountQuery.data}>
                  <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fill: 'var(--text-muted)' }} />
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
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by stage</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {pipelineQuery.isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : pipelineQuery.isError ? (
              <QueryError
                message={pipelineQuery.error.message}
                onRetry={() => void pipelineQuery.refetch()}
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineQuery.data}>
                  <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fill: 'var(--text-muted)' }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
