import { useQuery } from '@tanstack/react-query'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { Contact } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { crmKeys, fetchContacts } from '@/api/crm'
import { CollectionToolbar } from '@/components/shared/CollectionToolbar'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { CustomViewStub } from '@/components/shared/views/CustomViewStub'
import { GridView } from '@/components/shared/views/GridView'
import { SplitView } from '@/components/shared/views/SplitView'
import { TileView } from '@/components/shared/views/TileView'
import { useCollectionView } from '@/hooks/useCollectionView'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { sortCollection } from '@/lib/sort-collection'
import type { Contact as ContactEntity, StatusBadgeVariant } from '@/types'
import type { SortState, ViewMode } from '@/types/views'

const statusMap: Record<ContactEntity['status'], StatusBadgeVariant> = {
  active: 'success',
  inactive: 'neutral',
}

const VIEWS: ViewMode[] = ['list', 'grid', 'tile', 'split', 'custom']

const sortOptions = [
  { field: 'name', label: 'Name' },
  { field: 'company', label: 'Company' },
  { field: 'lifetimeValue', label: 'LTV' },
  { field: 'lastActivityAt', label: 'Last activity' },
]

export function ContactsPage() {
  const navigate = useNavigate()
  const { view, setView, allowed } = useCollectionView(
    'customers/contacts',
    VIEWS,
    'list',
  )
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | ContactEntity['status']>('all')
  const debounced = useDebouncedValue(search)
  const [sort, setSort] = useState<SortState>({
    field: 'name',
    direction: 'asc',
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const query = useQuery({
    queryKey: crmKeys.contacts(`${debounced}:${status}`),
    queryFn: () => fetchContacts({ q: debounced, status }),
  })

  const rows = useMemo(
    () =>
      sortCollection(query.data ?? [], sort, {
        name: (item) => `${item.firstName} ${item.lastName}`,
      }),
    [query.data, sort],
  )

  useEffect(() => {
    if (!selectedId && rows[0]) setSelectedId(rows[0].id)
  }, [rows, selectedId])

  const selected = rows.find((row) => row.id === selectedId) ?? null

  const tableSorting = useMemo<SortingState>(
    () => [
      {
        id: sort.field === 'name' ? 'name' : sort.field,
        desc: sort.direction === 'desc',
      },
    ],
    [sort],
  )

  const columns = useMemo<ColumnDef<ContactEntity>[]>(
    () => [
      {
        id: 'name',
        header: 'Contact',
        cell: ({ row }) => (
          <div>
            <p className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </p>
            <p className="text-xs text-text-muted">{row.original.title}</p>
          </div>
        ),
      },
      { accessorKey: 'company', header: 'Company' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'ownerName', header: 'Owner' },
      {
        accessorKey: 'lifetimeValue',
        header: 'LTV',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatCurrency(row.original.lifetimeValue)}
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
        accessorKey: 'lastActivityAt',
        header: 'Last activity',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatDate(row.original.lastActivityAt)}
          </span>
        ),
      },
    ],
    [],
  )

  const empty = {
    icon: Contact,
    title: 'No contacts yet',
    description: 'Customer contacts will appear here.',
  }

  const activeFilters = (search ? 1 : 0) + (status !== 'all' ? 1 : 0)

  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Customers and key stakeholders."
      />
      <FilterBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search contacts…',
        }}
        facets={[
          {
            id: 'status',
            label: 'Status',
            value: status,
            onChange: (value) => setStatus(value as typeof status),
            options: [
              { value: 'all', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
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
              field: first.id === 'name' ? 'name' : first.id,
              direction: first.desc ? 'desc' : 'asc',
            })
          }}
          onRowClick={(row) => navigate(`/customers/contacts/${row.id}`)}
        />
      ) : null}

      {view === 'grid' ? (
        <GridView
          icon={Contact}
          items={rows.map((row) => ({
            id: row.id,
            title: `${row.firstName} ${row.lastName}`,
            subtitle: `${row.title} · ${row.company}`,
            meta: formatCurrency(row.lifetimeValue),
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
          onItemClick={(id) => navigate(`/customers/contacts/${id}`)}
        />
      ) : null}

      {view === 'tile' ? (
        <TileView
          items={rows.map((row) => ({
            id: row.id,
            label: row.company,
            value: `${row.firstName} ${row.lastName}`,
            meta: formatCurrency(row.lifetimeValue),
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
          onItemClick={(id) => navigate(`/customers/contacts/${id}`)}
        />
      ) : null}

      {view === 'split' ? (
        <SplitView
          items={rows.map((row) => ({
            id: row.id,
            title: `${row.firstName} ${row.lastName}`,
            subtitle: row.company,
            meta: formatCurrency(row.lifetimeValue),
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
          onOpenDetail={(id) => navigate(`/customers/contacts/${id}`)}
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
                  <p className="text-xs text-text-muted">Owner</p>
                  <p>{selected.ownerName}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Notes</p>
                  <p>{selected.notes ?? 'No notes yet.'}</p>
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
