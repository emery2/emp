import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Contact } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crmKeys, fetchContacts } from '@/api/crm'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { Contact as ContactEntity, StatusBadgeVariant } from '@/types'

const statusMap: Record<ContactEntity['status'], StatusBadgeVariant> = {
  active: 'success',
  inactive: 'neutral',
}

export function ContactsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search)
  const query = useQuery({
    queryKey: crmKeys.contacts(debounced),
    queryFn: () => fetchContacts({ q: debounced }),
  })

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
        activeCount={search ? 1 : 0}
        onClearAll={() => setSearch('')}
      />
      <DataTable
        columns={columns}
        data={query.data ?? []}
        getRowId={(row) => row.id}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={() => void query.refetch()}
        empty={{
          icon: Contact,
          title: 'No contacts yet',
          description: 'Customer contacts will appear here.',
        }}
        onRowClick={(row) => navigate(`/customers/contacts/${row.id}`)}
      />
    </div>
  )
}
