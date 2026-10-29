import type { AppUser } from '@/types/access'
import type { FeatureFlag } from '@/types'

export const defaultFeatureFlags: Record<FeatureFlag, boolean> = {
  'crm.enabled': true,
  'hr.leave': true,
  'hr.attendance': true,
  'automation.beta': false,
  'reports.advanced': true,
}

/**
 * Demo accounts — password for all: `password`
 * Prefer using the login demo switcher during development.
 */
export const demoUsers: AppUser[] = [
  {
    id: 'user-board',
    email: 'board@norf.example',
    firstName: 'Helena',
    lastName: 'Vogel',
    title: 'Board Member',
    organizationId: 'org-norf',
    departmentId: 'dept-exec',
    roleIds: ['board_member'],
    isActive: true,
  },
  {
    id: 'user-ceo',
    email: 'ceo@norf.example',
    firstName: 'Marcus',
    lastName: 'Klein',
    title: 'Chief Executive Officer',
    organizationId: 'org-norf',
    departmentId: 'dept-exec',
    roleIds: ['ceo_executive'],
    isActive: true,
  },
  {
    id: 'user-hod-eng',
    email: 'hod.eng@norf.example',
    firstName: 'Priya',
    lastName: 'Nair',
    title: 'Head of Engineering',
    organizationId: 'org-norf',
    departmentId: 'dept-eng',
    managerId: 'user-ceo',
    roleIds: ['head_of_department'],
    isActive: true,
    requiresSuperiorApproval: true,
  },
  {
    id: 'user-hod-sales',
    email: 'hod.sales@norf.example',
    firstName: 'Carlos',
    lastName: 'Mendez',
    title: 'Head of Sales',
    organizationId: 'org-norf',
    departmentId: 'dept-sales',
    managerId: 'user-ceo',
    roleIds: ['head_of_department'],
    isActive: true,
    requiresSuperiorApproval: true,
  },
  {
    id: 'user-hr',
    email: 'hr@norf.example',
    firstName: 'Mei',
    lastName: 'Tanaka',
    title: 'HR Officer',
    organizationId: 'org-norf',
    departmentId: 'dept-people',
    managerId: 'user-ceo',
    roleIds: ['hr_officer'],
    isActive: true,
    requiresSuperiorApproval: true,
  },
  {
    id: 'user-finance',
    email: 'finance@norf.example',
    firstName: 'Claire',
    lastName: 'Dubois',
    title: 'Finance Officer',
    organizationId: 'org-norf',
    departmentId: 'dept-finance',
    managerId: 'user-ceo',
    roleIds: ['finance_officer'],
    isActive: true,
    requiresSuperiorApproval: true,
  },
  {
    id: 'user-procurement',
    email: 'procurement@norf.example',
    firstName: 'Omar',
    lastName: 'Hassan',
    title: 'Procurement Officer',
    organizationId: 'org-norf',
    departmentId: 'dept-procurement',
    managerId: 'user-ceo',
    roleIds: ['procurement_officer'],
    isActive: true,
    requiresSuperiorApproval: true,
  },
  {
    id: 'user-warehouse',
    email: 'warehouse@norf.example',
    firstName: 'Nina',
    lastName: 'Kovacs',
    title: 'Manufacturing Lead',
    organizationId: 'org-norf',
    departmentId: 'dept-ops',
    managerId: 'user-ceo',
    roleIds: ['warehouse_manufacturing_staff'],
    isActive: true,
  },
  {
    id: 'user-sales',
    email: 'sales@norf.example',
    firstName: 'Elena',
    lastName: 'Rossi',
    title: 'Sales & Customer Service',
    organizationId: 'org-norf',
    departmentId: 'dept-sales',
    managerId: 'user-hod-sales',
    roleIds: ['sales_customer_service_staff'],
    isActive: true,
  },
  {
    id: 'user-crm',
    email: 'crm@norf.example',
    firstName: 'Amara',
    lastName: 'Diallo',
    title: 'Account Executive',
    organizationId: 'org-norf',
    departmentId: 'dept-sales',
    managerId: 'user-hod-sales',
    roleIds: ['crm_prm_project_member'],
    isActive: true,
  },
  {
    id: 'user-employee',
    email: 'employee@norf.example',
    firstName: 'Sofia',
    lastName: 'Alvarez',
    title: 'Software Engineer',
    organizationId: 'org-norf',
    departmentId: 'dept-eng',
    managerId: 'user-hod-eng',
    roleIds: ['regular_employee'],
    isActive: true,
  },
  {
    id: 'user-admin',
    email: 'admin@norf.example',
    firstName: 'Jordan',
    lastName: 'Lee',
    title: 'System Administrator',
    organizationId: 'org-norf',
    departmentId: 'dept-people',
    managerId: 'user-ceo',
    roleIds: ['system_administrator'],
    isActive: true,
  },
  {
    id: 'user-employee-override',
    email: 'auditor@norf.example',
    firstName: 'Lukas',
    lastName: 'Novak',
    title: 'People Partner',
    organizationId: 'org-norf',
    departmentId: 'dept-people',
    managerId: 'user-hr',
    roleIds: ['regular_employee'],
    isActive: true,
    permissionOverrides: {
      grant: ['leave.verify.hr', 'dashboard.hr.view', 'employees.view'],
    },
  },
]

export function findUserById(id: string): AppUser | undefined {
  return demoUsers.find((user) => user.id === id)
}

export function findUserByEmail(email: string): AppUser | undefined {
  return demoUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  )
}

export function getDirectReports(managerId: string): AppUser[] {
  return demoUsers.filter((user) => user.managerId === managerId && user.isActive)
}
