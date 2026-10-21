import type { FeatureFlag, User } from '@/types'

export const demoUsers: User[] = [
  {
    id: 'user-1',
    email: 'ava.chen@norf.example',
    firstName: 'Ava',
    lastName: 'Chen',
    role: 'org_admin',
    departmentId: 'dept-people',
    departmentName: 'People Ops',
    tenantId: 'tenant-norf',
  },
  {
    id: 'user-2',
    email: 'marcus.okonkwo@norf.example',
    firstName: 'Marcus',
    lastName: 'Okonkwo',
    role: 'dept_manager',
    departmentId: 'dept-eng',
    departmentName: 'Engineering',
    tenantId: 'tenant-norf',
  },
  {
    id: 'user-3',
    email: 'sofia.alvarez@norf.example',
    firstName: 'Sofia',
    lastName: 'Alvarez',
    role: 'employee',
    departmentId: 'dept-sales',
    departmentName: 'Sales',
    tenantId: 'tenant-norf',
  },
  {
    id: 'user-4',
    email: 'jordan.lee@norf.example',
    firstName: 'Jordan',
    lastName: 'Lee',
    role: 'super_admin',
    departmentId: 'dept-people',
    departmentName: 'People Ops',
    tenantId: 'tenant-norf',
  },
]

export const defaultFeatureFlags: Record<FeatureFlag, boolean> = {
  'crm.enabled': true,
  'hr.leave': true,
  'hr.attendance': true,
  'automation.beta': true,
  'reports.advanced': true,
}
