import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { employeeKeys, fetchEmployees } from '@/api/employees'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { RoleGate } from '@/components/shared/RoleGate'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatDate } from '@/lib/formatters'
import type { Employee, StatusBadgeVariant } from '@/types'

const statusMap: Record<Employee['status'], StatusBadgeVariant> = {
  active: 'success',
  on_leave: 'warning',
  inactive: 'neutral',
}

export function EmployeeListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search)
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 25

  const query = useQuery({
    queryKey: employeeKeys.list(`${debounced}:${pageIndex}`),
    queryFn: () =>
      fetchEmployees({ q: debounced, page: pageIndex, pageSize }),
  })

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'employeeNumber',
        header: 'ID',
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.employeeNumber}</span>
        ),
      },
      {
        id: 'name',
        header: 'Name',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => (
          <div>
            <p className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </p>
            <p className="text-xs text-text-muted">{row.original.email}</p>
          </div>
        ),
      },
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'departmentName', header: 'Department' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge variant={statusMap[row.original.status]} dot>
            {row.original.status.replace('_', ' ')}
          </StatusBadge>
        ),
      },
      {
        accessorKey: 'hireDate',
        header: 'Hire date',
        cell: ({ row }) => (
          <span className="tabular-nums">{formatDate(row.original.hireDate)}</span>
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Employees"
        description="People directory across departments."
        actions={
          <RoleGate roles={['super_admin', 'org_admin', 'dept_manager']}>
            <Button onClick={() => toast.message('Add employee coming soon')}>
              Add employee
            </Button>
          </RoleGate>
        }
      />
      <FilterBar
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value)
            setPageIndex(0)
          },
          placeholder: 'Search employees…',
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
          icon: Users,
          title: 'No employees yet',
          description:
            'Add people to unlock leave, attendance, and org charts.',
          primaryAction: {
            label: 'Add employee',
            onClick: () => toast.message('Add employee coming soon'),
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
        onRowClick={(row) => navigate(`/people/employees/${row.id}`)}
      />
    </div>
  )
}
