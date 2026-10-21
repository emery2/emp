import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Users } from 'lucide-react'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { fetchOrgUsers, settingsKeys } from '@/api/settings'
import { DataTable } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { roleLabels } from '@/lib/rbac'
import type { OrgUser, StatusBadgeVariant } from '@/types'

const statusMap: Record<OrgUser['status'], StatusBadgeVariant> = {
  active: 'success',
  invited: 'warning',
  disabled: 'neutral',
}

export function UsersRolesPage() {
  const query = useQuery({
    queryKey: settingsKeys.users,
    queryFn: fetchOrgUsers,
  })

  const columns = useMemo<ColumnDef<OrgUser>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => roleLabels[row.original.role],
      },
      { accessorKey: 'departmentName', header: 'Department' },
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
        title="Users & roles"
        description="Invite colleagues and assign EMP roles."
        actions={
          <Button onClick={() => toast.message('Invite user coming soon')}>
            Invite user
          </Button>
        }
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
          icon: Users,
          title: 'No users',
          description: 'Invite colleagues and assign roles.',
          primaryAction: {
            label: 'Invite user',
            onClick: () => toast.message('Invite user coming soon'),
          },
        }}
      />
    </div>
  )
}
