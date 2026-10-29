import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { ClipboardList } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchLeaveRequests, filterMyLeave, leaveKeys } from '@/api/leave'
import { DataTable } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { LeaveStatusBadge } from '@/features/leave/leave-status'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import type { LeaveRequestRecord } from '@/types/leave'

export function LeaveHistoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: leaveKeys.list('mine'),
    queryFn: fetchLeaveRequests,
  })

  const rows = user ? filterMyLeave(query.data ?? [], user.id) : []

  const columns = useMemo<ColumnDef<LeaveRequestRecord>[]>(
    () => [
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
            <Link to={`/leave/${row.original.id}`}>Open</Link>
          </Button>
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="My leave"
        description="History of leave requests you submitted."
        actions={
          <Button asChild>
            <Link to="/leave/request">Request leave</Link>
          </Button>
        }
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
          icon: ClipboardList,
          title: 'No leave requests',
          description: 'Submit your first leave request to see it here.',
          primaryAction: {
            label: 'Request leave',
            onClick: () => navigate('/leave/request'),
          },
        }}
      />
    </div>
  )
}
