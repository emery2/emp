import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { FileText } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { commercialKeys, fetchQuotations } from '@/api/commercial'
import { DataTable } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency } from '@/lib/formatters'
import type { QuotationRecord } from '@/types/commercial'
import type { StatusBadgeVariant } from '@/types'

const statusVariant: Record<QuotationRecord['status'], StatusBadgeVariant> = {
  draft: 'neutral',
  pending_finance: 'warning',
  approved: 'success',
  sent: 'info',
  accepted: 'success',
  rejected: 'danger',
  cancelled: 'neutral',
}

export function QuotationsPage() {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: commercialKeys.quotations,
    queryFn: fetchQuotations,
  })

  const columns = useMemo<ColumnDef<QuotationRecord>[]>(
    () => [
      { accessorKey: 'number', header: 'Number' },
      { accessorKey: 'accountName', header: 'Account' },
      { accessorKey: 'ownerName', header: 'Owner' },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) =>
          formatCurrency(row.original.total, row.original.currency),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge variant={statusVariant[row.original.status]} dot>
            {row.original.status.replaceAll('_', ' ')}
          </StatusBadge>
        ),
      },
      {
        id: 'opportunity',
        header: 'Opportunity',
        cell: ({ row }) =>
          row.original.opportunityId ? (
            <Link
              className="text-primary hover:underline"
              to={`/crm/opportunities/${row.original.opportunityId}`}
              onClick={(event) => event.stopPropagation()}
            >
              {row.original.opportunityId}
            </Link>
          ) : (
            '—'
          ),
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Quotations"
        description="ERP quotations linked to CRM opportunities. Finance approves pending quotes."
      />
      <DataTable
        columns={columns}
        data={query.data ?? []}
        getRowId={(row) => row.id}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error instanceof Error ? query.error : null}
        onRetry={() => void query.refetch()}
        onRowClick={(row) => navigate(`/erp/quotations/${row.id}`)}
        empty={{
          icon: FileText,
          title: 'No quotations',
          description: 'Convert a CRM opportunity to create the first quotation.',
        }}
      />
    </div>
  )
}
