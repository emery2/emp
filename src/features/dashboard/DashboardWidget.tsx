import {
  GripVertical,
  Info,
  MoreVertical,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function FilterPill({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[#dfe3eb] bg-[#f5f8fa] px-2.5 py-1 text-xs font-medium text-[#516f90]',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function DashboardWidget({
  title,
  filters,
  updatedAt = 'Just now',
  className,
  bodyClassName,
  children,
  empty,
}: {
  title: string
  filters?: string[]
  updatedAt?: string
  className?: string
  bodyClassName?: string
  children?: ReactNode
  empty?: boolean
}) {
  return (
    <article
      className={cn(
        'flex min-h-[16rem] flex-col rounded-xl border border-[#eaf0f6] bg-white shadow-none',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 px-4 pb-1 pt-3">
        <div className="flex min-w-0 items-start gap-1.5">
          <button
            type="button"
            className="mt-0.5 rounded p-0.5 text-[#99acc2] hover:bg-[#f5f8fa] hover:text-[#516f90]"
            aria-label={`Reorder ${title}`}
          >
            <GripVertical className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-[#33475b]">
                {title}
              </h3>
              <Info
                className="h-3.5 w-3.5 shrink-0 text-[#99acc2]"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
            {filters && filters.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {filters.map((filter) => (
                  <FilterPill key={filter}>{filter}</FilterPill>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 text-[#99acc2]">
          <button
            type="button"
            className="rounded p-1.5 hover:bg-[#f5f8fa] hover:text-[#516f90]"
            aria-label={`Refresh ${title}`}
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 hover:bg-[#f5f8fa] hover:text-[#516f90]"
            aria-label={`${title} filters`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 hover:bg-[#f5f8fa] hover:text-[#516f90]"
            aria-label={`${title} options`}
          >
            <MoreVertical className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div className={cn('relative flex flex-1 flex-col px-4 pb-3 pt-2', bodyClassName)}>
        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
            <div
              className="h-16 w-16 rounded-full border-4 border-[#eaf0f6] border-t-[#cbd6e2]"
              aria-hidden
            />
            <p className="max-w-[14rem] text-sm text-[#516f90]">
              No data yet. Once you add data, you&apos;ll see it here.
            </p>
          </div>
        ) : (
          children
        )}
      </div>

      <footer className="mt-auto flex items-center justify-end px-4 pb-3">
        <p className="text-[11px] text-[#99acc2]">{updatedAt}</p>
      </footer>
    </article>
  )
}
