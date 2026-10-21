import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

export interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  delta?: { value: string; trend: 'up' | 'down' | 'flat' }
  href?: string
  isLoading?: boolean
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  href,
  isLoading,
}: StatCardProps) {
  const content = (
    <Card
      className={cn(
        'h-full',
        href && 'transition-colors hover:bg-surface-hover',
      )}
    >
      <CardContent className="flex h-full flex-col gap-2 p-4">
        {isLoading ? (
          <>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-24" />
          </>
        ) : (
          <>
            <p className="text-overline uppercase tracking-wide text-text-muted">
              {label}
            </p>
            <p className="text-2xl font-bold tabular-nums text-text-primary">
              {value}
              {unit ? (
                <span className="ml-1 text-sm font-medium text-text-secondary">
                  {unit}
                </span>
              ) : null}
            </p>
            {delta ? (
              <p
                className={cn(
                  'text-xs',
                  delta.trend === 'up' && 'text-success',
                  delta.trend === 'down' && 'text-danger',
                  delta.trend === 'flat' && 'text-text-secondary',
                )}
              >
                {delta.value}
              </p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link to={href} className="block h-full focus-visible:outline-none">
        {content}
      </Link>
    )
  }

  return content
}
