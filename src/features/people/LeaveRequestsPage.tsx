import { useQuery } from '@tanstack/react-query'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { CalendarOff } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { employeeKeys, fetchLeaveRequests } from '@/api/employees'
import { CollectionToolbar } from '@/components/shared/CollectionToolbar'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChartView } from '@/components/shared/views/ChartView'
import { CustomViewStub } from '@/components/shared/views/CustomViewStub'
import { TimelineView } from '@/components/shared/views/TimelineView'
import { Button } from '@/components/ui/button'
import { useCollectionView } from '@/hooks/useCollectionView'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatDate } from '@/lib/formatters'
import { sortCollection } from '@/lib/sort-collection'
import type { LeaveRequest, StatusBadgeVariant } from '@/types'
import type { SortState, ViewMode } from '@/types/views'

const statusMap: Record<LeaveRequest['status'], StatusBadgeVariant> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

const VIEWS: ViewMode[] = ['list', 'timeline', 'chart', 'custom']

const sortOptions = [
  { field: 'startDate', label: 'Start date' },
  { field: 'employeeName', label: 'Employee' },
  { field: 'days', label: 'Days' },
  { field: 'status', label: 'Status' },
]

export function LeaveRequestsPage() {
  const { view, setView, allowed } = useCollectionView(
    'people/leave',
    VIEWS,
    'list',
  )
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | LeaveRequest['status']>('all')
  const debounced = useDebouncedValue(search)
  const [sort, setSort] = useState<SortState>({
    field: 'startDate',
    direction: 'desc',
  })

  const query = useQuery({
    queryKey: employeeKeys.leave(`${debounced}:${status}`),
    queryFn: () => fetchLeaveRequests({ q: debounced, status }),
  })

  const rows = useMemo(
    () => sortCollection(query.data ?? [], sort),
    [query.data, sort],
  )

  const tableSorting = useMemo<SortingState>(
    () => [{ id: sort.field, desc: sort.direction === 'desc' }],
    [sort],
  )

  const columns = useMemo<ColumnDef<LeaveRequest>[]>(
    () => [
      { accessorKey: 'employeeName', header: 'Employee' },
      { accessorKey: 'departmentName', header: 'Department' },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <span className="capitalize">{row.original.type}</span>
        ),
      },
      {
        id: 'dates',
        header: 'Dates',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatDate(row.original.startDate)} –{' '}
            {formatDate(row.original.endDate)}
          </span>
        ),
      },
      {
        accessorKey: 'days',
        header: 'Days',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.days}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge variant={statusMap[row.original.status]} dot>
            {row.original.status}
          </StatusBadge>
        ),
      },
    ],
    [],
  )

  const empty = {
    icon: CalendarOff,
    title: 'No leave requests',
    description: 'Requests from your team will show up here.',
    primaryAction: {
      label: 'Request leave',
      onClick: () => toast.message('Request leave coming soon'),
    },
  }

  const chartData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of rows) {
      counts.set(row.status, (counts.get(row.status) ?? 0) + 1)
    }
    return [...counts.entries()].map(([label, value]) => ({ label, value }))
  }, [rows])

  const activeFilters = (search ? 1 : 0) + (status !== 'all' ? 1 : 0)

  return (
    <div>
      <PageHeader
        title="Leave"
        description="Vacation, sick, and personal leave requests."
        actions={
          <Button onClick={() => toast.message('Request leave coming soon')}>
            Request leave
          </Button>
        }
      />
      <FilterBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search leave requests…',
        }}
        facets={[
          {
            id: 'status',
            label: 'Status',
            value: status,
            onChange: (value) => setStatus(value as typeof status),
            options: [
              { value: 'all', label: 'All statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ],
          },
        ]}
        activeCount={activeFilters}
        onClearAll={() => {
          setSearch('')
          setStatus('all')
        }}
      />
      <CollectionToolbar
        sort={sort}
        sortOptions={sortOptions}
        onSortChange={setSort}
        onRefresh={() => void query.refetch()}
        isRefreshing={query.isFetching}
        view={view}
        views={allowed}
        onViewChange={setView}
      />

      {view === 'list' ? (
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          onRetry={() => void query.refetch()}
          empty={empty}
          sorting={tableSorting}
          onSortingChange={(updater) => {
            const next =
              typeof updater === 'function' ? updater(tableSorting) : updater
            const first = next[0]
            if (!first) return
            setSort({
              field: first.id,
              direction: first.desc ? 'desc' : 'asc',
            })
          }}
        />
      ) : null}

      {view === 'timeline' ? (
        <TimelineView
          items={rows.map((row) => ({
            id: row.id,
            title: `${row.employeeName} · ${row.type}`,
            description: `${row.departmentName} · ${row.days} day(s)`,
            dateLabel: `${formatDate(row.startDate)} – ${formatDate(row.endDate)}`,
            badge: (
              <StatusBadge variant={statusMap[row.status]} dot>
                {row.status}
              </StatusBadge>
            ),
          }))}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          onRetry={() => void query.refetch()}
          empty={empty}
        />
      ) : null}

      {view === 'chart' ? (
        <ChartView
          title="Leave by status"
          data={chartData}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          onRetry={() => void query.refetch()}
          empty={empty}
        />
      ) : null}

      {view === 'custom' ? (
        <CustomViewStub
          onConfigure={() => toast.message('Custom layout editor coming soon')}
        />
      ) : null}
    </div>
  )
}
