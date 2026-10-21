import { useMemo, useState } from 'react'
import { EmptyState, type EmptyStateProps } from '@/components/shared/EmptyState'
import { QueryError } from '@/components/shared/QueryState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/formatters'
import type { StatusBadgeVariant } from '@/types'

export interface KanbanColumn {
  id: string
  title: string
  wipLimit?: number
}

export interface KanbanCard {
  id: string
  columnId: string
  title: string
  subtitle?: string
  value?: number
  status?: StatusBadgeVariant
}

export interface KanbanBoardProps {
  columns: KanbanColumn[]
  cards: KanbanCard[]
  onCardMove?: (cardId: string, from: string, to: string) => void
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  empty: EmptyStateProps
  onCardClick?: (cardId: string) => void
}

export function KanbanBoard({
  columns,
  cards,
  onCardMove,
  isLoading,
  isError,
  error,
  onRetry,
  empty,
  onCardClick,
}: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const cardsByColumn = useMemo(() => {
    const map = new Map<string, KanbanCard[]>()
    for (const column of columns) map.set(column.id, [])
    for (const card of cards) {
      const list = map.get(card.columnId)
      if (list) list.push(card)
    }
    return map
  }, [columns, cards])

  if (isError) {
    return <QueryError message={error?.message} onRetry={onRetry} />
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-3 bg-surface p-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (cards.length === 0) {
    return <EmptyState {...empty} />
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {columns.map((column) => {
        const columnCards = cardsByColumn.get(column.id) ?? []
        return (
          <section
            key={column.id}
            className="flex min-h-[20rem] flex-col bg-surface"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (!draggingId || !onCardMove) return
              const card = cards.find((item) => item.id === draggingId)
              if (!card || card.columnId === column.id) return
              onCardMove(draggingId, card.columnId, column.id)
              setDraggingId(null)
            }}
          >
            <header className="flex items-center justify-between border-b border-divider px-3 py-2">
              <h3 className="text-sm font-semibold text-text-primary">
                {column.title}
              </h3>
              <span className="text-xs tabular-nums text-text-muted">
                {columnCards.length}
                {column.wipLimit ? ` / ${column.wipLimit}` : ''}
              </span>
            </header>
            <div className="flex flex-1 flex-col gap-2 p-2">
              {columnCards.map((card) => (
                <article
                  key={card.id}
                  draggable={Boolean(onCardMove)}
                  onDragStart={() => setDraggingId(card.id)}
                  onDragEnd={() => setDraggingId(null)}
                  onClick={() => onCardClick?.(card.id)}
                  className="cursor-pointer bg-background p-3 transition-opacity hover:bg-surface-hover"
                  style={{ opacity: draggingId === card.id ? 0.6 : 1 }}
                >
                  <p className="text-sm font-medium text-text-primary">
                    {card.title}
                  </p>
                  {card.subtitle ? (
                    <p className="mt-1 text-xs text-text-secondary">
                      {card.subtitle}
                    </p>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {typeof card.value === 'number' ? (
                      <span className="text-xs font-medium tabular-nums text-text-primary">
                        {formatCurrency(card.value)}
                      </span>
                    ) : (
                      <span />
                    )}
                    {card.status ? (
                      <StatusBadge variant={card.status}>Deal</StatusBadge>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
