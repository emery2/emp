import type { LeaveDecision, LeaveRequestRecord, LeaveType } from '@/types/leave'

let leaveStore: LeaveRequestRecord[] = [
  {
    id: 'leave-100',
    requesterId: 'user-employee',
    requesterName: 'Sofia Alvarez',
    departmentId: 'dept-eng',
    type: 'vacation',
    startDate: '2026-11-10',
    endDate: '2026-11-14',
    days: 5,
    reason: 'Family travel',
    status: 'submitted',
    approverId: 'user-hod-eng',
    createdAt: '2026-10-20T09:00:00.000Z',
    updatedAt: '2026-10-20T09:00:00.000Z',
    decisions: [
      {
        id: 'dec-1',
        actorId: 'user-employee',
        actorName: 'Sofia Alvarez',
        action: 'submit',
        comment: 'Submitted for manager review',
        at: '2026-10-20T09:00:00.000Z',
      },
    ],
  },
  {
    id: 'leave-101',
    requesterId: 'user-crm',
    requesterName: 'Amara Diallo',
    departmentId: 'dept-sales',
    type: 'personal',
    startDate: '2026-11-03',
    endDate: '2026-11-03',
    days: 1,
    reason: 'Personal appointment',
    status: 'manager_approved',
    approverId: 'user-hod-sales',
    createdAt: '2026-10-18T11:00:00.000Z',
    updatedAt: '2026-10-19T08:30:00.000Z',
    decisions: [
      {
        id: 'dec-2',
        actorId: 'user-crm',
        actorName: 'Amara Diallo',
        action: 'submit',
        at: '2026-10-18T11:00:00.000Z',
      },
      {
        id: 'dec-3',
        actorId: 'user-hod-sales',
        actorName: 'Carlos Mendez',
        action: 'manager_approve',
        comment: 'Coverage confirmed',
        at: '2026-10-19T08:30:00.000Z',
      },
    ],
  },
  {
    id: 'leave-102',
    requesterId: 'user-employee',
    requesterName: 'Sofia Alvarez',
    departmentId: 'dept-eng',
    type: 'sick',
    startDate: '2026-09-12',
    endDate: '2026-09-12',
    days: 1,
    status: 'completed',
    approverId: 'user-hod-eng',
    createdAt: '2026-09-12T07:00:00.000Z',
    updatedAt: '2026-09-13T10:00:00.000Z',
    decisions: [
      {
        id: 'dec-4',
        actorId: 'user-employee',
        actorName: 'Sofia Alvarez',
        action: 'submit',
        at: '2026-09-12T07:00:00.000Z',
      },
      {
        id: 'dec-5',
        actorId: 'user-hod-eng',
        actorName: 'Priya Nair',
        action: 'manager_approve',
        at: '2026-09-12T12:00:00.000Z',
      },
      {
        id: 'dec-6',
        actorId: 'user-hr',
        actorName: 'Mei Tanaka',
        action: 'hr_verify',
        comment: 'Verified',
        at: '2026-09-13T10:00:00.000Z',
      },
    ],
  },
]

export function listLeaveRequests(): LeaveRequestRecord[] {
  return leaveStore.map((item) => ({
    ...item,
    decisions: [...item.decisions],
  }))
}

export function getLeaveRequest(id: string): LeaveRequestRecord | undefined {
  const found = leaveStore.find((item) => item.id === id)
  return found
    ? { ...found, decisions: [...found.decisions] }
    : undefined
}

export function replaceLeaveStore(next: LeaveRequestRecord[]): void {
  leaveStore = next.map((item) => ({
    ...item,
    decisions: [...item.decisions],
  }))
}

export function createLeaveId(): string {
  return `leave-${Date.now()}`
}

export function createDecisionId(): string {
  return `dec-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export type { LeaveType, LeaveDecision }
