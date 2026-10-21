import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Building2 } from 'lucide-react'
import { useMemo } from 'react'
import { fetchDepartments, settingsKeys } from '@/api/settings'
import { DataTable } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import type { Department } from '@/types'

export function DepartmentsPage() {
  const query = useQuery({
    queryKey: settingsKeys.departments,
    queryFn: fetchDepartments,
  })

  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      { accessorKey: 'name', header: 'Department' },
      { accessorKey: 'managerName', header: 'Manager' },
      {
        accessorKey: 'employeeCount',
        header: 'Employees',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.employeeCount}</span>
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Organizational units used for scoping People and Reports."
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
          icon: Building2,
          title: 'No departments',
          description: 'Create departments to structure your organization.',
        }}
      />
    </div>
  )
}
