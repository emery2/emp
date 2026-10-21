import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Clock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { employeeKeys, fetchAttendance } from '@/api/employees'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatDate } from '@/lib/formatters'
import type { AttendanceRecord, StatusBadgeVariant } from '@/types'

const statusMap: Record<AttendanceRecord['status'], StatusBadgeVariant> = {
  present: 'success',
  late: 'warning',
  absent: 'danger',
  remote: 'info',
}

export function AttendancePage() {
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search)
  const query = useQuery({
    queryKey: employeeKeys.attendance(debounced),
    queryFn: () => fetchAttendance({ q: debounced }),
  })

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      { accessorKey: 'employeeName', header: 'Employee' },
      { accessorKey: 'departmentName', header: 'Department' },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
          <span className="tabular-nums">{formatDate(row.original.date)}</span>
        ),
      },
      {
        accessorKey: 'checkIn',
        header: 'Check in',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.checkIn ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'checkOut',
        header: 'Check out',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.checkOut ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'hours',
        header: 'Hours',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.hours.toFixed(1)}</span>
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
        title="Attendance"
        description="Daily presence across the organization."
      />
      <FilterBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search attendance…',
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
          icon: Clock,
          title: 'No attendance records',
          description: 'Today’s check-ins will appear here.',
        }}
      />
    </div>
  )
}
