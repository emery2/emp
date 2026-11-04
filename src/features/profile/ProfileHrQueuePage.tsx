import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { ClipboardList } from 'lucide-react'
import { fetchHrProfileQueue, profileKeys } from '@/api/profile'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { ProfileChangeStatusBadge } from '@/features/profile/profile-status'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import type { ProfileChangeRequest } from '@/types/profile'

export function ProfileHrQueuePage() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const navigate = useNavigate()

  const query = useQuery({
    queryKey: profileKeys.requests(tenant.id, `hr:${user?.id ?? ''}`),
    queryFn: () => fetchHrProfileQueue(tenant.id, user!),
    enabled: Boolean(user),
  })

  const columns: ColumnDef<ProfileChangeRequest, unknown>[] = [
    {
      accessorKey: 'requesterName',
      header: 'Employee',
    },
    {
      id: 'fields',
      header: 'Fields',
      cell: ({ row }) =>
        row.original.fieldChanges.map((c) => c.field).join(', '),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <ProfileChangeStatusBadge status={row.original.status} />
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Profile change approvals"
        description="Review employee profile change requests. You cannot approve your own changes."
      />
      <DataTable
        columns={columns}
        data={query.data ?? []}
        getRowId={(row) => row.id}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error instanceof Error ? query.error : null}
        onRetry={() => void query.refetch()}
        empty={{
          icon: ClipboardList,
          title: 'Queue empty',
          description: 'No profile changes waiting on you.',
        }}
        onRowClick={(row) => navigate(`/profile/changes/${row.id}`)}
      />
    </div>
  )
}
