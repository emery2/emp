import { EmptyState, type EmptyStateProps } from '@/components/shared/EmptyState'
import { QueryError } from '@/components/shared/QueryState'
import { Skeleton } from '@/components/ui/skeleton'

export interface TimelineItem {
  id: string
  title: string
  description?: string
  dateLabel: string
  badge?: React.ReactNode
}

export interface TimelineViewProps {
  items: TimelineItem[]
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  empty: EmptyStateProps
  onItemClick?: (id: string) => void
}

export function TimelineView({
  items,
  isLoading,
  isError,
  error,
  onRetry,
  empty,
  onItemClick,
}: TimelineViewProps) {
  if (isError) {
    return <QueryError message={error?.message} onRetry={onRetry} />
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyState {...empty} />
  }

  return (
    <ol className="relative space-y-0 border-l border-divider pl-4">
      {items.map((item) => (
        <li key={item.id} className="relative pb-4">
          <span
            className="absolute -left-[21px] top-2 h-2.5 w-2.5 rounded-full bg-primary"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => onItemClick?.(item.id)}
            className="w-full bg-surface p-3 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-text-primary">{item.title}</p>
              <div className="flex items-center gap-2">
                {item.badge}
                <span className="text-xs tabular-nums text-text-muted">
                  {item.dateLabel}
                </span>
              </div>
            </div>
            {item.description ? (
              <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
            ) : null}
          </button>
        </li>
      ))}
    </ol>
  )
}
