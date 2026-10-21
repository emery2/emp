import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { crmKeys, fetchLeads } from '@/api/crm'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { Lead, StatusBadgeVariant } from '@/types'

const statusMap: Record<Lead['status'], StatusBadgeVariant> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  disqualified: 'neutral',
}

export function LeadsPage() {
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search)
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 25

  const query = useQuery({
    queryKey: crmKeys.leads(`${debounced}:${pageIndex}`),
    queryFn: () => fetchLeads({ q: debounced, page: pageIndex, pageSize }),
  })

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
        activeCount={search ? 1 : 0}
        onClearAll={() => setSearch('')}
      />
      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        getRowId={(row) => row.id}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={() => void query.refetch()}
        empty={{
          icon: UserPlus,
          title: 'No leads yet',
          description: 'Import or create leads to fill the pipeline.',
          primaryAction: {
            label: 'Create lead',
            onClick: () => toast.message('Create lead coming soon'),
          },
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
    </div>
  )
}
