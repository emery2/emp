import { useQuery } from '@tanstack/react-query'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { Clock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { employeeKeys, fetchAttendance } from '@/api/employees'
import { CollectionToolbar } from '@/components/shared/CollectionToolbar'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChartView } from '@/components/shared/views/ChartView'
import { CustomViewStub } from '@/components/shared/views/CustomViewStub'
import { TileView } from '@/components/shared/views/TileView'
import { useCollectionView } from '@/hooks/useCollectionView'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatDate } from '@/lib/formatters'
import { sortCollection } from '@/lib/sort-collection'
import type { AttendanceRecord, StatusBadgeVariant } from '@/types'
import type { SortState, ViewMode } from '@/types/views'

const statusMap: Record<AttendanceRecord['status'], StatusBadgeVariant> = {
  present: 'success',
  late: 'warning',
  absent: 'danger',
  remote: 'info',
}

const VIEWS: ViewMode[] = ['list', 'tile', 'chart', 'custom']

const sortOptions = [
  { field: 'employeeName', label: 'Employee' },
  { field: 'date', label: 'Date' },
  { field: 'hours', label: 'Hours' },
  { field: 'status', label: 'Status' },
]

export function AttendancePage() {
  const { view, setView, allowed } = useCollectionView(
    'people/attendance',
    VIEWS,
    'list',
  )
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | AttendanceRecord['status']>('all')
  const debounced = useDebouncedValue(search)
  const [sort, setSort] = useState<SortState>({
    field: 'employeeName',
    direction: 'asc',
  })

  const query = useQuery({
    queryKey: employeeKeys.attendance(`${debounced}:${status}`),
    queryFn: () => fetchAttendance({ q: debounced, status }),
  })

  const rows = useMemo(
    () => sortCollection(query.data ?? [], sort),
    [query.data, sort],
  )

  const tableSorting = useMemo<SortingState>(
    () => [{ id: sort.field, desc: sort.direction === 'desc' }],
    [sort],
  )

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      { accessorKey: 'employeeName', header: 'Employee' },
      { accessorKey: 'departmentName', header: 'Department' },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
          <span className="tabular-nums">{formatDate(row.original.date)}</span>
        ),
      },
      {
        accessorKey: 'checkIn',
        header: 'Check in',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.checkIn ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'checkOut',
        header: 'Check out',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.checkOut ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'hours',
        header: 'Hours',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.hours.toFixed(1)}</span>
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
    icon: Clock,
    title: 'No attendance records',
    description: 'Today’s check-ins will appear here.',
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
        title="Attendance"
        description="Daily presence across the organization."
      />
      <FilterBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search attendance…',
        }}
        facets={[
          {
            id: 'status',
            label: 'Status',
            value: status,
            onChange: (value) => setStatus(value as typeof status),
            options: [
              { value: 'all', label: 'All statuses' },
              { value: 'present', label: 'Present' },
              { value: 'late', label: 'Late' },
              { value: 'absent', label: 'Absent' },
              { value: 'remote', label: 'Remote' },
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

      {view === 'tile' ? (
        <TileView
          items={rows.map((row) => ({
            id: row.id,
            label: row.departmentName,
            value: row.employeeName,
            meta: `${row.checkIn ?? '—'} – ${row.checkOut ?? '—'} · ${row.hours.toFixed(1)}h`,
            badge: (
              <StatusBadge variant={statusMap[row.status]}>
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
          title="Attendance by status"
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
