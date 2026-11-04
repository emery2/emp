import { StatusBadge } from '@/components/shared/StatusBadge'
import type { ProfileChangeStatus } from '@/types/profile'
import type { StatusBadgeVariant } from '@/types'

const map: Record<ProfileChangeStatus, StatusBadgeVariant> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  returned: 'info',
  withdrawn: 'neutral',
}

export function ProfileChangeStatusBadge({
  status,
}: {
  status: ProfileChangeStatus
}) {
  return (
    <StatusBadge variant={map[status]} dot>
      {status.replace('_', ' ')}
    </StatusBadge>
  )
}
