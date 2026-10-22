import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { EmptyState, type EmptyStateProps } from '@/components/shared/EmptyState'
import { QueryError } from '@/components/shared/QueryState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export interface ChartDatum {
  label: string
  value: number
}

export interface ChartViewProps {
  title: string
  data: ChartDatum[]
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  empty: EmptyStateProps
  valueFormatter?: (value: number) => string
}

export function ChartView({
  title,
  data,
  isLoading,
  isError,
  error,
  onRetry,
  empty,
  valueFormatter,
}: ChartViewProps) {
  if (isError) {
    return <QueryError message={error?.message} onRetry={onRetry} />
  }

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />
  }

  if (data.length === 0) {
    return <EmptyState {...empty} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)' }} />
            <YAxis
              tick={{ fill: 'var(--text-muted)' }}
              tickFormatter={valueFormatter}
            />
            <Tooltip
              formatter={(value) =>
                valueFormatter && typeof value === 'number'
                  ? valueFormatter(value)
                  : value
              }
            />
            <Bar dataKey="value" fill="var(--chart-1)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
