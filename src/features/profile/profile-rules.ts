import { hasPermission } from '@/access/evaluate'
import type { AppUser } from '@/types/access'
import type {
  ProfileChangeRequest,
  ProfileDecisionAction,
  ProfileFieldKey,
  ProfileFieldValues,
} from '@/types/profile'
import { PROFILE_EDITABLE_FIELDS } from '@/types/profile'
import type { ProfileFieldSensitivity } from '@/modules/feature-schemas'
import { findUserById } from '@/mocks/users'

export type FieldSensitivityMap = Record<string, ProfileFieldSensitivity>

export function sensitivityFor(
  fields: FieldSensitivityMap,
  key: ProfileFieldKey,
): ProfileFieldSensitivity {
  return fields[key] ?? 'locked'
}

export function isHrStaff(user: AppUser): boolean {
  return (
    user.roleIds.includes('hr_officer') ||
    user.roleIds.includes('hr_head') ||
    hasPermission(user, 'leave.verify.hr') ||
    hasPermission(user, 'profile.approve.hr')
  )
}

export function isHrHead(user: AppUser): boolean {
  return user.roleIds.includes('hr_head')
}

/** HR staff changes go to HR Head; otherwise any HR approver. Fallback: CEO. */
export function resolveProfileApproverId(requester: AppUser): string {
  if (isHrStaff(requester) && !isHrHead(requester)) {
    const head = findUserById('user-hr-head')
    if (head) return head.id
    const ceo = findUserById('user-ceo')
    if (ceo) return ceo.id
    return 'user-admin'
  }
  if (isHrHead(requester)) {
    const ceo = findUserById('user-ceo')
    if (ceo) return ceo.id
    return 'user-admin'
  }
  const hr = findUserById('user-hr')
  if (hr) return hr.id
  const head = findUserById('user-hr-head')
  if (head) return head.id
  return 'user-admin'
}

export function buildFieldChanges(
  current: ProfileFieldValues,
  proposed: Partial<ProfileFieldValues>,
  fields: FieldSensitivityMap,
): {
  direct: Array<{ field: ProfileFieldKey; fromValue: string; toValue: string }>
  needsApproval: Array<{
    field: ProfileFieldKey
    fromValue: string
    toValue: string
  }>
  lockedAttempts: ProfileFieldKey[]
} {
  const direct: Array<{
    field: ProfileFieldKey
    fromValue: string
    toValue: string
  }> = []
  const needsApproval: Array<{
    field: ProfileFieldKey
    fromValue: string
    toValue: string
  }> = []
  const lockedAttempts: ProfileFieldKey[] = []

  for (const field of PROFILE_EDITABLE_FIELDS) {
    if (!(field in proposed) || proposed[field] === undefined) continue
    const toValue = String(proposed[field])
    const fromValue = current[field]
    if (toValue === fromValue) continue
    const sensitivity = sensitivityFor(fields, field)
    if (sensitivity === 'locked') {
      lockedAttempts.push(field)
      continue
    }
    if (sensitivity === 'direct') {
      direct.push({ field, fromValue, toValue })
    } else {
      needsApproval.push({ field, fromValue, toValue })
    }
  }

  return { direct, needsApproval, lockedAttempts }
}

export function canSubmitProfileChange(actor: AppUser): boolean {
  return hasPermission(actor, 'profile.edit.self')
}

export function canWithdrawProfileChange(
  actor: AppUser,
  request: ProfileChangeRequest,
): boolean {
  if (actor.id !== request.requesterId) return false
  return request.status === 'pending' || request.status === 'returned'
}

export function canHrDecideProfileChange(
  actor: AppUser,
  request: ProfileChangeRequest,
): boolean {
  if (!hasPermission(actor, 'profile.approve.hr')) return false
  if (actor.id === request.requesterId) return false
  if (request.status !== 'pending' && request.status !== 'returned') return false

  // Assigned approver wins when set (HR Head path)
  if (request.assignedApproverId) {
    return request.assignedApproverId === actor.id
  }

  // Generic HR queue: any profile.approve.hr except self
  return true
}

export function nextStatusForProfileAction(
  action: ProfileDecisionAction,
): ProfileChangeRequest['status'] | null {
  switch (action) {
    case 'submit':
      return 'pending'
    case 'approve':
      return 'approved'
    case 'reject':
      return 'rejected'
    case 'return':
      return 'returned'
    case 'withdraw':
      return 'withdrawn'
    default:
      return null
  }
}

export function assertProfileTransition(
  actor: AppUser,
  request: ProfileChangeRequest,
  action: ProfileDecisionAction,
): void {
  if (action === 'submit') {
    if (!canSubmitProfileChange(actor)) {
      throw new Error('Missing profile.edit.self permission')
    }
    if (actor.id !== request.requesterId) {
      throw new Error('Only the requester can submit this change')
    }
    return
  }

  if (action === 'withdraw') {
    if (!canWithdrawProfileChange(actor, request)) {
      throw new Error('Cannot withdraw this request')
    }
    return
  }

  if (action === 'approve' || action === 'reject' || action === 'return') {
    if (!canHrDecideProfileChange(actor, request)) {
      throw new Error('Not allowed to decide this profile change')
    }
    if (action === 'reject' || action === 'return') {
      // reason required at API layer
    }
    return
  }

  throw new Error('Unknown profile action')
}
