import { useQuery } from '@tanstack/react-query'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { UserPlus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { crmKeys, fetchLeads } from '@/api/crm'
import { CollectionToolbar } from '@/components/shared/CollectionToolbar'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { KanbanBoard } from '@/components/shared/KanbanBoard'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChartView } from '@/components/shared/views/ChartView'
import { CustomViewStub } from '@/components/shared/views/CustomViewStub'
import { GridView } from '@/components/shared/views/GridView'
import { SplitView } from '@/components/shared/views/SplitView'
import { Button } from '@/components/ui/button'
import { useCollectionView } from '@/hooks/useCollectionView'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { sortCollection } from '@/lib/sort-collection'
import type { Lead, StatusBadgeVariant } from '@/types'
import type { SortState, ViewMode } from '@/types/views'

const statusMap: Record<Lead['status'], StatusBadgeVariant> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  disqualified: 'neutral',
}

const VIEWS: ViewMode[] = [
  'list',
  'grid',
  'kanban',
  'chart',
  'split',
  'custom',
]

const sortOptions = [
  { field: 'name', label: 'Name' },
  { field: 'estimatedValue', label: 'Est. value' },
  { field: 'createdAt', label: 'Created' },
  { field: 'status', label: 'Status' },
]

const leadStages = [
  { id: 'new', title: 'New' },
  { id: 'contacted', title: 'Contacted' },
  { id: 'qualified', title: 'Qualified' },
  { id: 'disqualified', title: 'Disqualified' },
]

export function LeadsPage() {
  const { view, setView, allowed } = useCollectionView(
    'customers/leads',
    VIEWS,
    'list',
  )
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | Lead['status']>('all')
  const debounced = useDebouncedValue(search)
  const [pageIndex, setPageIndex] = useState(0)
  const [sort, setSort] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc',
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const pageSize = view === 'list' ? 25 : 100

  const query = useQuery({
    queryKey: crmKeys.leads(
      `${debounced}:${status}:${pageIndex}:${pageSize}:${view}`,
    ),
    queryFn: () =>
      fetchLeads({
        q: debounced,
        status,
        page: view === 'list' ? pageIndex : 0,
        pageSize,
      }),
  })

  const rows = useMemo(
    () => sortCollection(query.data?.data ?? [], sort),
    [query.data?.data, sort],
  )

  useEffect(() => {
    if (!selectedId && rows[0]) setSelectedId(rows[0].id)
  }, [rows, selectedId])

  const selected = rows.find((row) => row.id === selectedId) ?? null

  const tableSorting = useMemo<SortingState>(
    () => [{ id: sort.field, desc: sort.direction === 'desc' }],
    [sort],
  )

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Lead',
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-text-muted">{row.original.company}</p>
          </div>
        ),
      },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'source', header: 'Source' },
      { accessorKey: 'ownerName', header: 'Owner' },
      {
        accessorKey: 'estimatedValue',
        header: 'Est. value',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatCurrency(row.original.estimatedValue)}
          </span>
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
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
    ],
    [],
  )

  const empty = {
    icon: UserPlus,
    title: 'No leads yet',
    description: 'Import or create leads to fill the pipeline.',
    primaryAction: {
      label: 'Create lead',
      onClick: () => toast.message('Create lead coming soon'),
    },
  }

  const chartData = useMemo(() => {
    const totals = new Map<string, number>()
    for (const row of rows) {
      totals.set(
        row.status,
        (totals.get(row.status) ?? 0) + row.estimatedValue,
      )
    }
    return [...totals.entries()].map(([label, value]) => ({ label, value }))
  }, [rows])

  const activeFilters = (search ? 1 : 0) + (status !== 'all' ? 1 : 0)

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Inbound and outbound sales leads."
        actions={
          <Button onClick={() => toast.message('Create lead coming soon')}>
            Create lead
          </Button>
        }
      />
      <FilterBar
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value)
            setPageIndex(0)
          },
          placeholder: 'Search leads…',
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
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'qualified', label: 'Qualified' },
              { value: 'disqualified', label: 'Disqualified' },
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
              field: first.id,
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
        />
      ) : null}

      {view === 'grid' ? (
        <GridView
          icon={UserPlus}
          items={rows.map((row) => ({
            id: row.id,
            title: row.name,
            subtitle: row.company,
            meta: `${row.ownerName} · ${formatCurrency(row.estimatedValue)}`,
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

      {view === 'kanban' ? (
        <KanbanBoard
          columns={leadStages}
          cards={rows.map((row) => ({
            id: row.id,
            columnId: row.status,
            title: row.name,
            subtitle: `${row.company} · ${row.ownerName}`,
            value: row.estimatedValue,
            status: statusMap[row.status],
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
          title="Estimated value by status"
          data={chartData}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          onRetry={() => void query.refetch()}
          empty={empty}
          valueFormatter={(value) => formatCurrency(value)}
        />
      ) : null}

      {view === 'split' ? (
        <SplitView
          items={rows.map((row) => ({
            id: row.id,
            title: row.name,
            subtitle: row.company,
            meta: formatCurrency(row.estimatedValue),
            badge: (
              <StatusBadge variant={statusMap[row.status]} dot>
                {row.status}
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
                  <p className="text-xs text-text-muted">Source</p>
                  <p>{selected.source}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Owner</p>
                  <p>{selected.ownerName}</p>
                </div>
              </div>
            ) : null
          }
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
