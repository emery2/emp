import type { OrgDepartment, Organization } from '@/types/access'

export const organization: Organization = {
  id: 'org-norf',
  name: 'NORF Industries',
  legalName: 'NORF Industries GmbH',
}

export const departments: OrgDepartment[] = [
  {
    id: 'dept-exec',
    organizationId: 'org-norf',
    name: 'Executive Office',
    managerUserId: 'user-ceo',
  },
  {
    id: 'dept-people',
    organizationId: 'org-norf',
    name: 'People Ops',
    managerUserId: 'user-hr',
  },
  {
    id: 'dept-eng',
    organizationId: 'org-norf',
    name: 'Engineering',
    managerUserId: 'user-hod-eng',
  },
  {
    id: 'dept-sales',
    organizationId: 'org-norf',
    name: 'Sales',
    managerUserId: 'user-hod-sales',
  },
  {
    id: 'dept-finance',
    organizationId: 'org-norf',
    name: 'Finance',
    managerUserId: 'user-finance',
  },
  {
    id: 'dept-procurement',
    organizationId: 'org-norf',
    name: 'Procurement',
    managerUserId: 'user-procurement',
  },
  {
    id: 'dept-ops',
    organizationId: 'org-norf',
    name: 'Operations / Manufacturing',
    managerUserId: 'user-warehouse',
  },
]

export function getDepartmentName(departmentId: string): string {
  return departments.find((d) => d.id === departmentId)?.name ?? 'Unknown'
}
