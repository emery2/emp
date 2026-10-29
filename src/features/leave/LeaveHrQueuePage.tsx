import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { FileWarning } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchLeaveRequests, filterHrQueue, leaveKeys } from '@/api/leave'
import { DataTable } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { LeaveStatusBadge } from '@/features/leave/leave-status'
import { Button } from '@/components/ui/button'
import type { LeaveRequestRecord } from '@/types/leave'

export function LeaveHrQueuePage() {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: leaveKeys.list('hr'),
    queryFn: fetchLeaveRequests,
  })

  const rows = filterHrQueue(query.data ?? [])

  const columns = useMemo<ColumnDef<LeaveRequestRecord>[]>(
    () => [
      { accessorKey: 'requesterName', header: 'Employee' },
      { accessorKey: 'type', header: 'Type' },
      { accessorKey: 'startDate', header: 'Start' },
      { accessorKey: 'endDate', header: 'End' },
      { accessorKey: 'days', header: 'Days' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <LeaveStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/leave/${row.original.id}`}>Verify</Link>
          </Button>
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="HR verification"
        description="Manager-approved leave awaiting HR verification."
      />
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={() => void query.refetch()}
        onRowClick={(row) => navigate(`/leave/${row.id}`)}
        empty={{
          icon: FileWarning,
          title: 'Nothing to verify',
          description: 'No manager-approved leave is waiting on HR.',
        }}
      />
    </div>
  )
}
