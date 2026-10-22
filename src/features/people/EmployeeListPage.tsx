import { useQuery } from '@tanstack/react-query'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { employeeKeys, fetchEmployees } from '@/api/employees'
import { CollectionToolbar } from '@/components/shared/CollectionToolbar'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { RoleGate } from '@/components/shared/RoleGate'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChartView } from '@/components/shared/views/ChartView'
import { CustomViewStub } from '@/components/shared/views/CustomViewStub'
import { GridView } from '@/components/shared/views/GridView'
import { SplitView } from '@/components/shared/views/SplitView'
import { TileView } from '@/components/shared/views/TileView'
import { Button } from '@/components/ui/button'
import { useCollectionView } from '@/hooks/useCollectionView'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatDate } from '@/lib/formatters'
import { sortCollection } from '@/lib/sort-collection'
import type { Employee, StatusBadgeVariant } from '@/types'
import type { SortState, ViewMode } from '@/types/views'

const statusMap: Record<Employee['status'], StatusBadgeVariant> = {
  active: 'success',
  on_leave: 'warning',
  inactive: 'neutral',
}

const EMPLOYEE_VIEWS: ViewMode[] = [
  'list',
  'grid',
  'tile',
  'split',
  'chart',
  'custom',
]

const sortOptions = [
  { field: 'name', label: 'Name' },
  { field: 'departmentName', label: 'Department' },
  { field: 'title', label: 'Title' },
  { field: 'hireDate', label: 'Hire date' },
  { field: 'status', label: 'Status' },
]

export function EmployeeListPage() {
  const navigate = useNavigate()
  const { view, setView, allowed } = useCollectionView(
    'people/employees',
    EMPLOYEE_VIEWS,
    'list',
  )
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | Employee['status']>('all')
  const debounced = useDebouncedValue(search)
  const [pageIndex, setPageIndex] = useState(0)
  const [sort, setSort] = useState<SortState>({
    field: 'name',
    direction: 'asc',
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const pageSize = view === 'list' ? 25 : 100

  const query = useQuery({
    queryKey: employeeKeys.list(
      `${debounced}:${status}:${pageIndex}:${pageSize}:${view}`,
    ),
    queryFn: () =>
      fetchEmployees({
        q: debounced,
        status,
        page: view === 'list' ? pageIndex : 0,
        pageSize,
      }),
  })

  const rows = useMemo(
    () =>
      sortCollection(query.data?.data ?? [], sort, {
        name: (item) => `${item.firstName} ${item.lastName}`,
      }),
    [query.data?.data, sort],
  )

  useEffect(() => {
    if (!selectedId && rows[0]) setSelectedId(rows[0].id)
  }, [rows, selectedId])

  const selected = rows.find((row) => row.id === selectedId) ?? null

  const tableSorting = useMemo<SortingState>(
    () => [{ id: sort.field === 'name' ? 'name' : sort.field, desc: sort.direction === 'desc' }],
    [sort],
  )

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'employeeNumber',
        header: 'ID',
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.employeeNumber}</span>
        ),
      },
      {
        id: 'name',
        header: 'Name',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => (
          <div>
            <p className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </p>
            <p className="text-xs text-text-muted">{row.original.email}</p>
          </div>
        ),
      },
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'departmentName', header: 'Department' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge variant={statusMap[row.original.status]} dot>
            {row.original.status.replace('_', ' ')}
          </StatusBadge>
        ),
      },
      {
        accessorKey: 'hireDate',
        header: 'Hire date',
        cell: ({ row }) => (
          <span className="tabular-nums">{formatDate(row.original.hireDate)}</span>
        ),
      },
    ],
    [],
  )

  const empty = {
    icon: Users,
    title: 'No employees yet',
    description: 'Add people to unlock leave, attendance, and org charts.',
    primaryAction: {
      label: 'Add employee',
      onClick: () => toast.message('Add employee coming soon'),
    },
  }

  const chartData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of rows) {
      counts.set(row.departmentName, (counts.get(row.departmentName) ?? 0) + 1)
    }
    return [...counts.entries()].map(([label, value]) => ({ label, value }))
  }, [rows])

  const activeFilters =
    (search ? 1 : 0) + (status !== 'all' ? 1 : 0)

  return (
    <div>
      <PageHeader
        title="Employees"
        description="People directory across departments."
        actions={
          <RoleGate roles={['super_admin', 'org_admin', 'dept_manager']}>
            <Button onClick={() => toast.message('Add employee coming soon')}>
              Add employee
            </Button>
          </RoleGate>
        }
      />
      <FilterBar
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value)
            setPageIndex(0)
          },
          placeholder: 'Search employees…',
        }}
        facets={[
          {
            id: 'status',
            label: 'Status',
            value: status,
            onChange: (value) => {
              setStatus(value as typeof status)
              setPageIndex(0)
            },
            options: [
              { value: 'all', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'on_leave', label: 'On leave' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
        ]}
        activeCount={activeFilters}
        onClearAll={() => {
          setSearch('')
          setStatus('all')
          setPageIndex(0)
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
              field: first.id === 'name' ? 'name' : first.id,
              direction: first.desc ? 'desc' : 'asc',
            })
          }}
          pagination={{
            pageIndex,
            pageSize,
            total: query.data?.total ?? 0,
            pageCount: Math.max(
              1,
              Math.ceil((query.data?.total ?? 0) / pageSize),
            ),
          }}
          onPaginationChange={(updater) => {
            const next =
              typeof updater === 'function'
                ? updater({ pageIndex, pageSize })
                : updater
            setPageIndex(next.pageIndex)
          }}
          onRowClick={(row) => navigate(`/people/employees/${row.id}`)}
        />
      ) : null}

      {view === 'grid' ? (
        <GridView
          icon={Users}
          items={rows.map((row) => ({
            id: row.id,
            title: `${row.firstName} ${row.lastName}`,
            subtitle: row.title,
            meta: `${row.departmentName} · ${row.location}`,
            badge: (
              <StatusBadge variant={statusMap[row.status]} dot>
                {row.status.replace('_', ' ')}
              </StatusBadge>
            ),
          }))}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          onRetry={() => void query.refetch()}
          empty={empty}
          onItemClick={(id) => navigate(`/people/employees/${id}`)}
        />
      ) : null}

      {view === 'tile' ? (
        <TileView
          items={rows.map((row) => ({
            id: row.id,
            label: row.departmentName,
            value: `${row.firstName} ${row.lastName}`,
            meta: row.title,
            badge: (
              <StatusBadge variant={statusMap[row.status]}>
                {row.status.replace('_', ' ')}
              </StatusBadge>
            ),
          }))}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          onRetry={() => void query.refetch()}
          empty={empty}
          onItemClick={(id) => navigate(`/people/employees/${id}`)}
        />
      ) : null}

      {view === 'split' ? (
        <SplitView
          items={rows.map((row) => ({
            id: row.id,
            title: `${row.firstName} ${row.lastName}`,
            subtitle: row.title,
            meta: row.departmentName,
            badge: (
              <StatusBadge variant={statusMap[row.status]} dot>
                {row.status.replace('_', ' ')}
              </StatusBadge>
            ),
          }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          onRetry={() => void query.refetch()}
          empty={empty}
          onOpenDetail={(id) => navigate(`/people/employees/${id}`)}
          detail={
            selected ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p>{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Phone</p>
                  <p>{selected.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Hire date</p>
                  <p className="tabular-nums">{formatDate(selected.hireDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Location</p>
                  <p>{selected.location}</p>
                </div>
              </div>
            ) : null
          }
        />
      ) : null}

      {view === 'chart' ? (
        <ChartView
          title="Headcount by department"
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
