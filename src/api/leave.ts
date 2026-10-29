import { delay } from '@/mocks/delay'
import {
  createDecisionId,
  createLeaveId,
  getLeaveRequest,
  listLeaveRequests,
  replaceLeaveStore,
} from '@/mocks/leave'
import { findUserById } from '@/mocks/users'
import {
  assertTransition,
  nextStatusForAction,
  resolveLeaveApproverId,
} from '@/features/leave/leave-rules'
import type { AppUser } from '@/types/access'
import type {
  LeaveDecisionAction,
  LeaveRequestRecord,
  LeaveType,
} from '@/types/leave'

export const leaveKeys = {
  all: ['leave'] as const,
  list: (scope: string) => [...leaveKeys.all, 'list', scope] as const,
  detail: (id: string) => [...leaveKeys.all, 'detail', id] as const,
}

export async function fetchLeaveRequests(): Promise<LeaveRequestRecord[]> {
  await delay()
  return listLeaveRequests()
}

export async function fetchLeaveRequest(id: string): Promise<LeaveRequestRecord> {
  await delay()
  const item = getLeaveRequest(id)
  if (!item) throw new Error('Leave request not found')
  return item
}

export async function submitLeaveRequest(
  actor: AppUser,
  input: {
    type: LeaveType
    startDate: string
    endDate: string
    days: number
    reason?: string
  },
): Promise<LeaveRequestRecord> {
  await delay(250)
  const now = new Date().toISOString()
  const draft: LeaveRequestRecord = {
    id: createLeaveId(),
    requesterId: actor.id,
    requesterName: `${actor.firstName} ${actor.lastName}`,
    departmentId: actor.departmentId,
    type: input.type,
    startDate: input.startDate,
    endDate: input.endDate,
    days: input.days,
    reason: input.reason,
    status: 'draft',
    approverId: resolveLeaveApproverId(actor),
    createdAt: now,
    updatedAt: now,
    decisions: [],
  }
  assertTransition(actor, draft, 'submit')
  const submitted: LeaveRequestRecord = {
    ...draft,
    status: 'submitted',
    decisions: [
      {
        id: createDecisionId(),
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        action: 'submit',
        comment: input.reason,
        at: now,
      },
    ],
  }
  replaceLeaveStore([submitted, ...listLeaveRequests()])
  return submitted
}

export async function decideLeaveRequest(
  actor: AppUser,
  requestId: string,
  action: LeaveDecisionAction,
  comment?: string,
): Promise<LeaveRequestRecord> {
  await delay(250)
  const current = getLeaveRequest(requestId)
  if (!current) throw new Error('Leave request not found')
  assertTransition(actor, current, action)
  const nextStatus = nextStatusForAction(action)
  if (!nextStatus) throw new Error('Invalid action')

  const now = new Date().toISOString()
  const updated: LeaveRequestRecord = {
    ...current,
    status: nextStatus === 'hr_verified' ? 'completed' : nextStatus,
    updatedAt: now,
    decisions: [
      ...current.decisions,
      {
        id: createDecisionId(),
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        action,
        comment,
        at: now,
      },
    ],
  }

  replaceLeaveStore(
    listLeaveRequests().map((item) => (item.id === requestId ? updated : item)),
  )
  return updated
}

export function filterMyLeave(
  items: LeaveRequestRecord[],
  userId: string,
): LeaveRequestRecord[] {
  return items.filter((item) => item.requesterId === userId)
}

export function filterManagerQueue(
  items: LeaveRequestRecord[],
  actor: AppUser,
): LeaveRequestRecord[] {
  return items.filter((item) => {
    if (item.status !== 'submitted' && item.status !== 'returned') return false
    if (item.requesterId === actor.id) return false
    if (item.approverId === actor.id) return true
    const requester = findUserById(item.requesterId)
    return (
      Boolean(requester) &&
      (requester!.departmentId === actor.departmentId ||
        requester!.managerId === actor.id)
    )
  })
}

export function filterHrQueue(items: LeaveRequestRecord[]): LeaveRequestRecord[] {
  return items.filter((item) => item.status === 'manager_approved')
}
