import { hasPermission } from '@/access/evaluate'
import { findUserById } from '@/mocks/users'
import type { AppUser } from '@/types/access'
import type {
  LeaveDecisionAction,
  LeaveRequestRecord,
  LeaveStatus,
} from '@/types/leave'

export function resolveLeaveApproverId(requester: AppUser): string | undefined {
  // Configurable superior-approval: managers/HR route to their manager
  if (requester.requiresSuperiorApproval) {
    return requester.managerId
  }
  return requester.managerId
}

export function canSubmitLeave(actor: AppUser): boolean {
  return hasPermission(actor, 'leave.request')
}

export function canManagerAct(
  actor: AppUser,
  request: LeaveRequestRecord,
): boolean {
  if (!hasPermission(actor, 'leave.approve.department')) return false
  if (actor.id === request.requesterId) return false
  if (request.status !== 'submitted' && request.status !== 'returned') return false

  if (request.approverId && request.approverId === actor.id) return true

  const requester = findUserById(request.requesterId)
  if (!requester) return false
  return (
    requester.departmentId === actor.departmentId ||
    requester.managerId === actor.id
  )
}

export function canHrAct(actor: AppUser, request: LeaveRequestRecord): boolean {
  if (!hasPermission(actor, 'leave.verify.hr')) return false
  if (actor.id === request.requesterId) return false
  return request.status === 'manager_approved'
}

export function nextStatusForAction(
  action: LeaveDecisionAction,
): LeaveStatus | null {
  switch (action) {
    case 'submit':
      return 'submitted'
    case 'manager_approve':
      return 'manager_approved'
    case 'manager_reject':
      return 'manager_rejected'
    case 'return':
      return 'returned'
    case 'hr_verify':
      return 'completed'
    case 'hr_reject':
      return 'hr_rejected'
    default:
      return null
  }
}

export function assertTransition(
  actor: AppUser,
  request: LeaveRequestRecord,
  action: LeaveDecisionAction,
): void {
  if (action === 'submit') {
    if (!canSubmitLeave(actor)) throw new Error('Missing leave.request permission')
    if (actor.id !== request.requesterId) {
      throw new Error('Only the requester can submit this leave request')
    }
    if (request.status !== 'draft' && request.status !== 'returned') {
      throw new Error('Leave request cannot be submitted in its current status')
    }
    return
  }

  if (
    action === 'manager_approve' ||
    action === 'manager_reject' ||
    action === 'return'
  ) {
    if (!canManagerAct(actor, request)) {
      throw new Error('Not allowed to perform manager leave actions on this request')
    }
    return
  }

  if (action === 'hr_verify' || action === 'hr_reject') {
    if (!canHrAct(actor, request)) {
      throw new Error('Not allowed to perform HR verification on this request')
    }
    return
  }

  throw new Error('Unknown leave action')
}

export function isTerminalStatus(status: LeaveStatus): boolean {
  return (
    status === 'completed' ||
    status === 'manager_rejected' ||
    status === 'hr_rejected'
  )
}
