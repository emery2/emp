import type { Permission } from '@/access/permissions'

export interface CustomRoleDefinition {
  id: string
  label: string
  description: string
  permissions: Permission[]
}

/** Example custom roles that can be assigned alongside or instead of base roles. */
export const CUSTOM_ROLES: Record<string, CustomRoleDefinition> = {
  leave_auditor: {
    id: 'leave_auditor',
    label: 'Leave Auditor',
    description: 'Read leave queues for compliance review',
    permissions: ['leave.verify.hr', 'employees.view', 'dashboard.hr.view'],
  },
}
