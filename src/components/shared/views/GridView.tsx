import type { LucideIcon } from 'lucide-react'
import { EmptyState, type EmptyStateProps } from '@/components/shared/EmptyState'
import { QueryError } from '@/components/shared/QueryState'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

export interface GridCard {
  id: string
  title: string
  subtitle?: string
  meta?: string
  badge?: React.ReactNode
}

export interface GridViewProps {
  items: GridCard[]
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  empty: EmptyStateProps
  onItemClick?: (id: string) => void
  icon?: LucideIcon
}

export function GridView({
  items,
  isLoading,
  isError,
  error,
  onRetry,
  empty,
  onItemClick,
  icon: Icon,
}: GridViewProps) {
  if (isError) {
    return <QueryError message={error?.message} onRetry={onRetry} />
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyState {...empty} />
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onItemClick?.(item.id)}
          className={cn(
            'bg-surface p-4 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            onItemClick && 'cursor-pointer',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {Icon ? (
                <Icon
                  className="mb-2 h-4 w-4 text-primary"
                  strokeWidth={1.5}
                  aria-hidden
                />
              ) : null}
              <p className="truncate font-medium text-text-primary">{item.title}</p>
              {item.subtitle ? (
                <p className="mt-1 truncate text-sm text-text-secondary">
                  {item.subtitle}
                </p>
              ) : null}
              {item.meta ? (
                <p className="mt-2 text-xs text-text-muted">{item.meta}</p>
              ) : null}
            </div>
            {item.badge}
          </div>
        </button>
      ))}
    </div>
  )
}
