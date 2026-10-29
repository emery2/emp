import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { ClipboardCheck } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  fetchLeaveRequests,
  filterManagerQueue,
  leaveKeys,
} from '@/api/leave'
import { DataTable } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { LeaveStatusBadge } from '@/features/leave/leave-status'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import type { LeaveRequestRecord } from '@/types/leave'

export function LeaveManagerQueuePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: leaveKeys.list('manager'),
    queryFn: fetchLeaveRequests,
  })

  const rows = user ? filterManagerQueue(query.data ?? [], user) : []

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
            <Link to={`/leave/${row.original.id}`}>Review</Link>
          </Button>
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Manager approvals"
        description="Leave requests awaiting your department approval."
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
          icon: ClipboardCheck,
          title: 'Queue empty',
          description: 'No leave is waiting on your approval.',
        }}
      />
    </div>
  )
}
