export type LeaveType = 'vacation' | 'sick' | 'personal' | 'unpaid'

export type LeaveStatus =
  | 'draft'
  | 'submitted'
  | 'manager_approved'
  | 'manager_rejected'
  | 'returned'
  | 'hr_verified'
  | 'hr_rejected'
  | 'completed'

export type LeaveDecisionAction =
  | 'submit'
  | 'manager_approve'
  | 'manager_reject'
  | 'return'
  | 'hr_verify'
  | 'hr_reject'

export interface LeaveDecision {
  id: string
  actorId: string
  actorName: string
  action: LeaveDecisionAction
  comment?: string
  at: string
}

export interface LeaveRequestRecord {
  id: string
  requesterId: string
  requesterName: string
  departmentId: string
  type: LeaveType
  startDate: string
  endDate: string
  days: number
  reason?: string
  status: LeaveStatus
  approverId?: string
  createdAt: string
  updatedAt: string
  decisions: LeaveDecision[]
}
