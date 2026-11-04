export const PROFILE_EDITABLE_FIELDS = [
  'phone',
  'personalEmail',
  'address',
  'emergencyContact',
  'legalName',
  'nationalId',
  'bankDetails',
  'jobTitle',
  'salary',
  'departmentId',
  'managerId',
  'roleIds',
] as const

export type ProfileFieldKey = (typeof PROFILE_EDITABLE_FIELDS)[number]

export const PROFILE_FIELD_LABELS: Record<ProfileFieldKey, string> = {
  phone: 'Phone',
  personalEmail: 'Personal email',
  address: 'Address',
  emergencyContact: 'Emergency contact',
  legalName: 'Legal name',
  nationalId: 'National ID',
  bankDetails: 'Bank details',
  jobTitle: 'Job title',
  salary: 'Salary',
  departmentId: 'Department',
  managerId: 'Manager',
  roleIds: 'Roles',
}

export type ProfileChangeStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'withdrawn'

export type ProfileDecisionAction =
  | 'submit'
  | 'approve'
  | 'reject'
  | 'return'
  | 'withdraw'

export interface ProfileFieldValues {
  phone: string
  personalEmail: string
  address: string
  emergencyContact: string
  legalName: string
  nationalId: string
  bankDetails: string
  jobTitle: string
  salary: string
  departmentId: string
  managerId: string
  roleIds: string
}

export interface EmployeeProfileRecord {
  id: string
  tenantId: string
  userId: string
  values: ProfileFieldValues
  updatedAt: string
  /** Config version active when this profile last started an in-progress request. */
  configVersionId?: string
}

export interface ProfileFieldChange {
  field: ProfileFieldKey
  fromValue: string
  toValue: string
  sensitivity: 'direct' | 'needs_approval' | 'locked'
}

export interface ProfileDecision {
  id: string
  actorId: string
  actorName: string
  action: ProfileDecisionAction
  comment?: string
  at: string
}

export interface ProfileChangeRequest {
  id: string
  tenantId: string
  requesterId: string
  requesterName: string
  status: ProfileChangeStatus
  /** Snapshot of config rules this request started under. */
  configVersionId: string
  fieldChanges: ProfileFieldChange[]
  /** Proof filenames (mock only — no real upload). */
  attachments: string[]
  assignedApproverId?: string
  createdAt: string
  updatedAt: string
  decisions: ProfileDecision[]
}

export interface ProfileFieldHistoryEntry {
  id: string
  tenantId: string
  profileId: string
  userId: string
  field: ProfileFieldKey
  fromValue: string
  toValue: string
  actorId: string
  actorName: string
  reason: string
  at: string
  changeRequestId?: string
}
