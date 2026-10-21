import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { CalendarOff } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { employeeKeys, fetchLeaveRequests } from '@/api/employees'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatDate } from '@/lib/formatters'
import type { LeaveRequest, StatusBadgeVariant } from '@/types'

const statusMap: Record<LeaveRequest['status'], StatusBadgeVariant> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

export function LeaveRequestsPage() {
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search)
  const query = useQuery({
    queryKey: employeeKeys.leave(debounced),
    queryFn: () => fetchLeaveRequests({ q: debounced }),
  })

  const columns = useMemo<ColumnDef<LeaveRequest>[]>(
    () => [
      { accessorKey: 'employeeName', header: 'Employee' },
      { accessorKey: 'departmentName', header: 'Department' },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <span className="capitalize">{row.original.type}</span>
        ),
      },
      {
        id: 'dates',
        header: 'Dates',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatDate(row.original.startDate)} –{' '}
            {formatDate(row.original.endDate)}
          </span>
        ),
      },
      {
        accessorKey: 'days',
        header: 'Days',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.days}</span>
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
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Leave"
        description="Vacation, sick, and personal leave requests."
        actions={
          <Button onClick={() => toast.message('Request leave coming soon')}>
            Request leave
          </Button>
        }
      />
      <FilterBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search leave requests…',
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
          icon: CalendarOff,
          title: 'No leave requests',
          description: 'Requests from your team will show up here.',
          primaryAction: {
            label: 'Request leave',
            onClick: () => toast.message('Request leave coming soon'),
          },
        }}
      />
    </div>
  )
}
