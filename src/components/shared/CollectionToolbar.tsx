import {
  ArrowDownAZ,
  ArrowUpAZ,
  LayoutGrid,
  LayoutList,
  Columns2,
  GanttChart,
  Kanban,
  BarChart3,
  RefreshCw,
  Rows3,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/cn'
import {
  VIEW_MODE_META,
  type SortOption,
  type SortState,
  type ViewMode,
} from '@/types/views'

const viewIcons: Record<ViewMode, typeof LayoutList> = {
  list: LayoutList,
  grid: LayoutGrid,
  tile: Rows3,
  kanban: Kanban,
  chart: BarChart3,
  timeline: GanttChart,
  split: Columns2,
  custom: Sparkles,
}

export interface CollectionToolbarProps {
  sort: SortState
  sortOptions: SortOption[]
  onSortChange: (sort: SortState) => void
  onRefresh: () => void
  isRefreshing?: boolean
  view: ViewMode
  views: ViewMode[]
  onViewChange: (view: ViewMode) => void
}

export function CollectionToolbar({
  sort,
  sortOptions,
  onSortChange,
  onRefresh,
  isRefreshing,
  view,
  views,
  onViewChange,
}: CollectionToolbarProps) {
  const activeSortLabel =
    sortOptions.find((option) => option.field === sort.field)?.label ?? 'Sort'

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {sort.direction === 'asc' ? (
                <ArrowUpAZ className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              ) : (
                <ArrowDownAZ className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              )}
              {activeSortLabel}
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.field}
                onClick={() =>
                  onSortChange({
                    field: option.field,
                    direction:
                      sort.field === option.field && sort.direction === 'asc'
                        ? 'desc'
                        : 'asc',
                  })
                }
              >
                {option.label}
                {sort.field === option.field
                  ? sort.direction === 'asc'
                    ? ' · Asc'
                    : ' · Desc'
                  : ''}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                onSortChange({
                  ...sort,
                  direction: sort.direction === 'asc' ? 'desc' : 'asc',
                })
              }
            >
              Toggle {sort.direction === 'asc' ? 'descending' : 'ascending'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh data"
        >
          <RefreshCw
            className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
            strokeWidth={1.5}
            aria-hidden
          />
          Refresh
        </Button>
      </div>

      <div
        className="flex flex-wrap items-center gap-1"
        role="group"
        aria-label="View mode"
      >
        {views.map((mode) => {
          const Icon = viewIcons[mode]
          const active = view === mode
          return (
            <Button
              key={mode}
              variant="ghost"
              size="sm"
              aria-pressed={active}
              className={cn(
                active && 'bg-sidebar-active text-primary',
              )}
              onClick={() => onViewChange(mode)}
              title={VIEW_MODE_META[mode].label}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              <span className="hidden lg:inline">
                {VIEW_MODE_META[mode].label}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
