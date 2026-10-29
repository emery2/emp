import { StatusBadge } from '@/components/shared/StatusBadge'
import type { StatusBadgeVariant } from '@/types'
import type { LeaveStatus } from '@/types/leave'

const statusVariant: Record<LeaveStatus, StatusBadgeVariant> = {
  draft: 'neutral',
  submitted: 'info',
  manager_approved: 'info',
  manager_rejected: 'danger',
  returned: 'warning',
  hr_verified: 'success',
  hr_rejected: 'danger',
  completed: 'success',
}

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <StatusBadge variant={statusVariant[status]} dot>
      {status.replaceAll('_', ' ')}
    </StatusBadge>
  )
}

export function leaveStatusLabel(status: LeaveStatus): string {
  return status.replaceAll('_', ' ')
}
