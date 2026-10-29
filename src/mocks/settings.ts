import type {
  BrandingSettings,
  Department,
  OrgSettings,
  OrgUser,
} from '@/types'

export const orgSettings: OrgSettings = {
  name: 'NORF Industries',
  legalName: 'NORF Industries GmbH',
  website: 'https://norf.example',
  industry: 'Enterprise Software',
  timezone: 'Europe/Berlin',
  address: 'Friedrichstraße 88, 10117 Berlin, Germany',
}

export const brandingSettings: BrandingSettings = {
  primaryColor: '#0070F2',
  logoUrl: '',
  headerText: 'NORF Industries — Enterprise Management Platform',
  footerText: '© NORF Industries GmbH · Confidential',
}

export const departments: Department[] = [
  {
    id: 'dept-eng',
    name: 'Engineering',
    managerName: 'Marcus Okonkwo',
    employeeCount: 42,
  },
  {
    id: 'dept-sales',
    name: 'Sales',
    managerName: 'Helena Fischer',
    employeeCount: 18,
  },
  {
    id: 'dept-people',
    name: 'People Ops',
    managerName: 'Ava Chen',
    employeeCount: 8,
  },
  {
    id: 'dept-finance',
    name: 'Finance',
    managerName: 'Claire Dubois',
    employeeCount: 11,
  },
  {
    id: 'dept-cs',
    name: 'Customer Success',
    managerName: 'Elena Rossi',
    employeeCount: 14,
  },
]

export const orgUsers: OrgUser[] = [
  {
    id: 'ou-1',
    name: 'Ava Chen',
    email: 'ava.chen@norf.example',
    role: 'org_admin',
    departmentName: 'People Ops',
    status: 'active',
  },
  {
    id: 'ou-2',
    name: 'Marcus Okonkwo',
    email: 'marcus.okonkwo@norf.example',
    role: 'dept_manager',
    departmentName: 'Engineering',
    status: 'active',
  },
  {
    id: 'ou-3',
    name: 'Sofia Alvarez',
    email: 'sofia.alvarez@norf.example',
    role: 'employee',
    departmentName: 'Sales',
    status: 'active',
  },
  {
    id: 'ou-4',
    name: 'Jordan Lee',
    email: 'jordan.lee@norf.example',
    role: 'super_admin',
    departmentName: 'People Ops',
    status: 'active',
  },
  {
    id: 'ou-5',
    name: 'Riley Quinn',
    email: 'riley.quinn@partner.example',
    role: 'external',
    departmentName: '—',
    status: 'invited',
  },
]
