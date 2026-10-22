import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { EmptyState, type EmptyStateProps } from '@/components/shared/EmptyState'
import { QueryError } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/cn'

export interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  getRowId: (row: T) => string
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  empty: EmptyStateProps
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  pagination?: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
  onPaginationChange?: OnChangeFn<PaginationState>
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  onRowClick?: (row: T) => void
  enableSelection?: boolean
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading,
  isError,
  error,
  onRetry,
  empty,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  rowSelection,
  onRowSelectionChange,
  onRowClick,
  enableSelection,
}: DataTableProps<T>) {
  const selectionColumn: ColumnDef<T, unknown>[] = enableSelection
    ? [
        {
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(Boolean(value))
              }
              aria-label="Select all"
              onClick={(event) => event.stopPropagation()}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
              aria-label="Select row"
              onClick={(event) => event.stopPropagation()}
            />
          ),
          enableSorting: false,
        },
      ]
    : []

  const table = useReactTable({
    data,
    columns: [...selectionColumn, ...columns],
    getRowId: (row) => getRowId(row),
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: Boolean(pagination),
    state: {
      // Always provide objects — undefined controlled state crashes when
      // TanStack Table indexes by row id (e.g. rowSelection['emp-1']).
      sorting: sorting ?? [],
      rowSelection: rowSelection ?? {},
      ...(pagination
        ? {
            pagination: {
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            },
          }
        : {}),
    },
    onSortingChange,
    onRowSelectionChange,
    onPaginationChange,
    pageCount: pagination?.pageCount,
  })

  if (isError) {
    return (
      <QueryError
        message={error?.message}
        onRetry={onRetry}
      />
    )
  }

  return (
    <div className="bg-surface">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    scope="col"
                    aria-sort={
                      sorted === 'asc'
                        ? 'ascending'
                        : sorted === 'desc'
                          ? 'descending'
                          : canSort
                            ? 'none'
                            : undefined
                    }
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-text-primary"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {sorted === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                        ) : sorted === 'desc' ? (
                          <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                  {table.getVisibleFlatColumns().map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full max-w-[12rem]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
          {!isLoading && table.getRowModel().rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={table.getVisibleFlatColumns().length}>
                <EmptyState {...empty} />
              </TableCell>
            </TableRow>
          ) : null}
          {!isLoading
            ? table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className={cn(onRowClick && 'cursor-pointer')}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
      {pagination ? (
        <div className="flex items-center justify-between border-t border-divider px-3 py-2">
          <p className="text-xs text-text-secondary tabular-nums">
            {isLoading
              ? 'Loading…'
              : pagination.total === 0
                ? '0 results'
                : `${pagination.pageIndex * pagination.pageSize + 1}–${Math.min(
                    (pagination.pageIndex + 1) * pagination.pageSize,
                    pagination.total,
                  )} of ${pagination.total}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.pageIndex <= 0}
              onClick={() =>
                onPaginationChange?.({
                  pageIndex: pagination.pageIndex - 1,
                  pageSize: pagination.pageSize,
                })
              }
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.pageIndex + 1 >= pagination.pageCount}
              onClick={() =>
                onPaginationChange?.({
                  pageIndex: pagination.pageIndex + 1,
                  pageSize: pagination.pageSize,
                })
              }
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
