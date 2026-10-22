import { EmptyState, type EmptyStateProps } from '@/components/shared/EmptyState'
import { QueryError } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

export interface SplitListItem {
  id: string
  title: string
  subtitle?: string
  meta?: string
  badge?: React.ReactNode
}

export interface SplitViewProps {
  items: SplitListItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  empty: EmptyStateProps
  detail: React.ReactNode
  onOpenDetail?: (id: string) => void
  openLabel?: string
}

export function SplitView({
  items,
  selectedId,
  onSelect,
  isLoading,
  isError,
  error,
  onRetry,
  empty,
  detail,
  onOpenDetail,
  openLabel = 'Open full page',
}: SplitViewProps) {
  if (isError) {
    return <QueryError message={error?.message} onRetry={onRetry} />
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Skeleton className="h-96 lg:col-span-2" />
        <Skeleton className="h-96 lg:col-span-3" />
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyState {...empty} />
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
      <div className="max-h-[32rem] overflow-auto bg-surface lg:col-span-2">
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  'flex w-full items-start justify-between gap-2 border-b border-divider px-3 py-3 text-left hover:bg-surface-hover',
                  selectedId === item.id && 'bg-sidebar-active',
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.subtitle ? (
                    <p className="truncate text-xs text-text-secondary">
                      {item.subtitle}
                    </p>
                  ) : null}
                  {item.meta ? (
                    <p className="mt-1 text-xs text-text-muted">{item.meta}</p>
                  ) : null}
                </div>
                {item.badge}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-surface p-4 lg:col-span-3">
        {selectedId ? (
          <div className="space-y-4">
            {detail}
            {onOpenDetail ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenDetail(selectedId)}
              >
                {openLabel}
              </Button>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            Select an item to preview details.
          </p>
        )}
      </div>
    </div>
  )
}
