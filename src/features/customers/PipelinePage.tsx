import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { Kanban } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { crmKeys, fetchPipeline, moveDeal } from '@/api/crm'
import { CollectionToolbar } from '@/components/shared/CollectionToolbar'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { KanbanBoard } from '@/components/shared/KanbanBoard'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChartView } from '@/components/shared/views/ChartView'
import { CustomViewStub } from '@/components/shared/views/CustomViewStub'
import { Button } from '@/components/ui/button'
import { useCollectionView } from '@/hooks/useCollectionView'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { sortCollection } from '@/lib/sort-collection'
import type { Deal } from '@/types'
import type { SortState, ViewMode } from '@/types/views'

const VIEWS: ViewMode[] = ['kanban', 'list', 'chart', 'custom']

const sortOptions = [
  { field: 'title', label: 'Deal' },
  { field: 'value', label: 'Value' },
  { field: 'expectedCloseDate', label: 'Close date' },
  { field: 'probability', label: 'Probability' },
]

export function PipelinePage() {
  const queryClient = useQueryClient()
  const { view, setView, allowed } = useCollectionView(
    'customers/pipeline',
    VIEWS,
    'kanban',
  )
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search)
  const [sort, setSort] = useState<SortState>({
    field: 'value',
    direction: 'desc',
  })

  const query = useQuery({
    queryKey: crmKeys.pipeline,
    queryFn: fetchPipeline,
  })

  const filteredDeals = useMemo(() => {
    const q = debounced.toLowerCase()
    const deals = query.data?.deals ?? []
    const filtered = !q
      ? deals
      : deals.filter((deal) =>
          `${deal.title} ${deal.company} ${deal.ownerName}`
            .toLowerCase()
            .includes(q),
        )
    return sortCollection(filtered, sort)
  }, [query.data?.deals, debounced, sort])

  const stageName = useMemo(() => {
    const map = new Map(
      (query.data?.stages ?? []).map((stage) => [stage.id, stage.title]),
    )
    return (stageId: string) => map.get(stageId) ?? stageId
  }, [query.data?.stages])

  const moveMutation = useMutation({
    mutationFn: ({ dealId, stageId }: { dealId: string; stageId: string }) =>
      moveDeal(dealId, stageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: crmKeys.pipeline })
      toast.success('Deal moved')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const tableSorting = useMemo<SortingState>(
    () => [{ id: sort.field, desc: sort.direction === 'desc' }],
    [sort],
  )

  const columns = useMemo<ColumnDef<Deal>[]>(
    () => [
      { accessorKey: 'title', header: 'Deal' },
      { accessorKey: 'company', header: 'Company' },
      {
        id: 'stage',
        header: 'Stage',
        cell: ({ row }) => stageName(row.original.stageId),
      },
      {
        accessorKey: 'value',
        header: 'Value',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatCurrency(row.original.value)}
          </span>
        ),
      },
      {
        accessorKey: 'probability',
        header: 'Probability',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.probability}%</span>
        ),
      },
      { accessorKey: 'ownerName', header: 'Owner' },
      {
        accessorKey: 'expectedCloseDate',
        header: 'Close date',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatDate(row.original.expectedCloseDate)}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Signal',
        cell: ({ row }) =>
          row.original.status ? (
            <StatusBadge variant={row.original.status}>Signal</StatusBadge>
          ) : (
            '—'
          ),
      },
    ],
    [stageName],
  )

  const empty = {
    icon: Kanban,
    title: 'Pipeline is empty',
    description: 'Add deals or move leads into stages.',
    primaryAction: {
      label: 'Add deal',
      onClick: () => toast.message('Add deal coming soon'),
    },
  }

  const chartData = useMemo(() => {
    const totals = new Map<string, number>()
    for (const deal of filteredDeals) {
      const label = stageName(deal.stageId)
      totals.set(label, (totals.get(label) ?? 0) + deal.value)
    }
    return [...totals.entries()].map(([label, value]) => ({ label, value }))
  }, [filteredDeals, stageName])

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Configurable sales stages. Switch views anytime."
        actions={
          <Button onClick={() => toast.message('Add deal coming soon')}>
            Add deal
          </Button>
        }
      />
      <FilterBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search deals…',
        }}
        activeCount={search ? 1 : 0}
        onClearAll={() => setSearch('')}
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

      {view === 'kanban' ? (
        <KanbanBoard
          columns={query.data?.stages ?? []}
          cards={filteredDeals.map((deal) => ({
            id: deal.id,
            columnId: deal.stageId,
            title: deal.title,
            subtitle: `${deal.company} · ${deal.ownerName}`,
            value: deal.value,
            status: deal.status,
          }))}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          onRetry={() => void query.refetch()}
          onCardMove={(cardId, _from, to) =>
            moveMutation.mutate({ dealId: cardId, stageId: to })
          }
          empty={empty}
        />
      ) : null}

      {view === 'list' ? (
        <DataTable
          columns={columns}
          data={filteredDeals}
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

      {view === 'chart' ? (
        <ChartView
          title="Pipeline value by stage"
          data={chartData}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          onRetry={() => void query.refetch()}
          empty={empty}
          valueFormatter={(value) => formatCurrency(value)}
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
