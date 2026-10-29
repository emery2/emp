import { describe, expect, it } from 'vitest'
import {
  assertTransition,
  canHrAct,
  canManagerAct,
  canSubmitLeave,
  nextStatusForAction,
  resolveLeaveApproverId,
} from '@/features/leave/leave-rules'
import { findUserById } from '@/mocks/users'
import type { LeaveRequestRecord } from '@/types/leave'

function baseRequest(
  overrides: Partial<LeaveRequestRecord> = {},
): LeaveRequestRecord {
  return {
    id: 'leave-test',
    requesterId: 'user-employee',
    requesterName: 'Sofia Alvarez',
    departmentId: 'dept-eng',
    type: 'vacation',
    startDate: '2026-11-10',
    endDate: '2026-11-11',
    days: 2,
    status: 'submitted',
    approverId: 'user-hod-eng',
    createdAt: '2026-10-20T09:00:00.000Z',
    updatedAt: '2026-10-20T09:00:00.000Z',
    decisions: [],
    ...overrides,
  }
}

describe('leave rules', () => {
  it('allows employees with leave.request to submit', () => {
    const employee = findUserById('user-employee')!
    expect(canSubmitLeave(employee)).toBe(true)
  })

  it('bans self-approval for managers', () => {
    const manager = findUserById('user-hod-eng')!
    const ownRequest = baseRequest({
      requesterId: manager.id,
      requesterName: 'Priya Nair',
      departmentId: manager.departmentId,
      approverId: 'user-ceo',
    })
    expect(canManagerAct(manager, ownRequest)).toBe(false)
  })

  it('allows department manager to approve submitted leave', () => {
    const manager = findUserById('user-hod-eng')!
    const request = baseRequest()
    expect(canManagerAct(manager, request)).toBe(true)
  })

  it('routes superior approval for managers to their managerId', () => {
    const hod = findUserById('user-hod-eng')!
    expect(resolveLeaveApproverId(hod)).toBe('user-ceo')
  })

  it('allows HR only after manager approval and never on own request', () => {
    const hr = findUserById('user-hr')!
    const awaitingHr = baseRequest({ status: 'manager_approved' })
    const submitted = baseRequest({ status: 'submitted' })
    const own = baseRequest({
      requesterId: hr.id,
      status: 'manager_approved',
    })

    expect(canHrAct(hr, awaitingHr)).toBe(true)
    expect(canHrAct(hr, submitted)).toBe(false)
    expect(canHrAct(hr, own)).toBe(false)
  })

  it('maps actions to statuses including HR verify → completed', () => {
    expect(nextStatusForAction('manager_approve')).toBe('manager_approved')
    expect(nextStatusForAction('hr_verify')).toBe('completed')
    expect(nextStatusForAction('hr_reject')).toBe('hr_rejected')
  })

  it('assertTransition throws for illegal manager action', () => {
    const employee = findUserById('user-employee')!
    expect(() =>
      assertTransition(employee, baseRequest(), 'manager_approve'),
    ).toThrow(/Not allowed/)
  })
})
