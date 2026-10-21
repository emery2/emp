import type { FeatureFlag, Role } from '@/types'

export const roleLabels: Record<Role, string> = {
  super_admin: 'Super Admin',
  org_admin: 'Org Admin',
  dept_manager: 'Department Manager',
  supervisor: 'Supervisor',
  employee: 'Employee',
  external: 'External User',
}

export function canAccessNav(
  role: Role,
  item:
    | 'dashboard'
    | 'people'
    | 'crm'
    | 'work'
    | 'support'
    | 'automation'
    | 'documents'
    | 'reports'
    | 'settings',
  flags: Record<FeatureFlag, boolean>,
): boolean {
  if (item === 'crm' && !flags['crm.enabled']) return false
  if (item === 'automation' && !flags['automation.beta']) return false

  switch (item) {
    case 'dashboard':
      return true
    case 'people':
      return role !== 'external'
    case 'crm':
      return (
        role === 'super_admin' ||
        role === 'org_admin' ||
        role === 'dept_manager' ||
        role === 'external'
      )
    case 'work':
    case 'support':
    case 'documents':
      return role !== 'external' || item === 'support' || item === 'documents'
    case 'automation':
      return role === 'super_admin' || role === 'org_admin'
    case 'reports':
      return (
        role === 'super_admin' ||
        role === 'org_admin' ||
        role === 'dept_manager' ||
        role === 'supervisor'
      )
    case 'settings':
      return role === 'super_admin' || role === 'org_admin'
    default:
      return false
  }
}
