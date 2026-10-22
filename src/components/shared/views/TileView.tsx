import { EmptyState, type EmptyStateProps } from '@/components/shared/EmptyState'
import { QueryError } from '@/components/shared/QueryState'
import { Skeleton } from '@/components/ui/skeleton'

export interface TileItem {
  id: string
  label: string
  value: string
  meta?: string
  badge?: React.ReactNode
}

export interface TileViewProps {
  items: TileItem[]
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  empty: EmptyStateProps
  onItemClick?: (id: string) => void
}

export function TileView({
  items,
  isLoading,
  isError,
  error,
  onRetry,
  empty,
  onItemClick,
}: TileViewProps) {
  if (isError) {
    return <QueryError message={error?.message} onRetry={onRetry} />
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyState {...empty} />
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onItemClick?.(item.id)}
          className="bg-surface p-4 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <p className="text-overline uppercase tracking-wide text-text-muted">
            {item.label}
          </p>
          <p className="mt-2 truncate text-lg font-semibold tabular-nums text-text-primary">
            {item.value}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            {item.meta ? (
              <p className="truncate text-xs text-text-secondary">{item.meta}</p>
            ) : (
              <span />
            )}
            {item.badge}
          </div>
        </button>
      ))}
    </div>
  )
}
