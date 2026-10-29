import type { Permission } from '@/access/permissions'

export const ROLE_IDS = [
  'board_member',
  'ceo_executive',
  'head_of_department',
  'finance_officer',
  'hr_officer',
  'procurement_officer',
  'warehouse_manufacturing_staff',
  'sales_customer_service_staff',
  'crm_prm_project_member',
  'regular_employee',
  'system_administrator',
] as const

export type RoleId = (typeof ROLE_IDS)[number]

export interface RoleDefinition {
  id: RoleId
  label: string
  description: string
  permissions: Permission[]
}

const employeeBase: Permission[] = [
  'dashboard.employee.view',
  'leave.request',
  'calendar.view',
]

export const ROLE_DEFINITIONS: Record<RoleId, RoleDefinition> = {
  board_member: {
    id: 'board_member',
    label: 'Board Member',
    description: 'Governance overview without operational queues',
    permissions: [
      'dashboard.board.view',
      'reports.organization.view',
      'epm.budgets.view',
      'calendar.view',
    ],
  },
  ceo_executive: {
    id: 'ceo_executive',
    label: 'CEO / Executive',
    description: 'Organization-wide executive visibility',
    permissions: [
      'dashboard.executive.view',
      'employees.view',
      'reports.organization.view',
      'crm.leads.view',
      'crm.opportunities.view',
      'erp.quotations.view',
      'erp.orders.view',
      'epm.budgets.view',
      'epm.forecasts.view',
      'calendar.view',
    ],
  },
  head_of_department: {
    id: 'head_of_department',
    label: 'Head of Department',
    description: 'Department people leadership and leave approval',
    permissions: [
      ...employeeBase,
      'dashboard.manager.view',
      'employees.view',
      'leave.approve.department',
    ],
  },
  finance_officer: {
    id: 'finance_officer',
    label: 'Finance Officer',
    description: 'AR/AP, quotations review, and financial EPM inputs',
    permissions: [
      ...employeeBase,
      'dashboard.finance.view',
      'finance.ap.view',
      'finance.ar.view',
      'erp.quotations.view',
      'erp.quotations.manage',
      'erp.orders.view',
      'epm.budgets.view',
      'epm.forecasts.view',
      'reports.organization.view',
    ],
  },
  hr_officer: {
    id: 'hr_officer',
    label: 'HR Officer',
    description: 'HR operations and leave verification',
    permissions: [
      ...employeeBase,
      'dashboard.hr.view',
      'employees.view',
      'leave.verify.hr',
      'leave.approve.department',
      'settings.view',
    ],
  },
  procurement_officer: {
    id: 'procurement_officer',
    label: 'Procurement Officer',
    description: 'Purchasing, suppliers, and inbound inventory visibility',
    permissions: [
      ...employeeBase,
      'dashboard.operations.view',
      'erp.purchasing.view',
      'scm.suppliers.view',
      'scm.inventory.view',
    ],
  },
  warehouse_manufacturing_staff: {
    id: 'warehouse_manufacturing_staff',
    label: 'Warehouse / Manufacturing Staff',
    description: 'Inventory movements and production work orders',
    permissions: [
      ...employeeBase,
      'dashboard.operations.view',
      'scm.inventory.view',
      'scm.production.view',
      'scm.suppliers.view',
    ],
  },
  sales_customer_service_staff: {
    id: 'sales_customer_service_staff',
    label: 'Sales / Customer Service Staff',
    description: 'CRM pipeline, CX cases, and quotation handoff',
    permissions: [
      ...employeeBase,
      'crm.leads.view',
      'crm.leads.manage',
      'crm.opportunities.view',
      'crm.opportunities.manage',
      'erp.quotations.view',
      'erp.quotations.manage',
      'erp.orders.view',
      'cx.cases.view',
      'cx.cases.manage',
    ],
  },
  crm_prm_project_member: {
    id: 'crm_prm_project_member',
    label: 'CRM / PRM / Project Team Member',
    description: 'Customer, partner, and project delivery work (legacy demo role)',
    permissions: [
      ...employeeBase,
      'crm.leads.view',
      'crm.leads.manage',
      'crm.opportunities.view',
      'crm.opportunities.manage',
      'prm.partners.manage',
      'prm.referrals.manage',
      'erp.quotations.view',
      'projects.manage',
    ],
  },
  regular_employee: {
    id: 'regular_employee',
    label: 'Regular Employee',
    description: 'Self-service employee workspace',
    permissions: [...employeeBase],
  },
  system_administrator: {
    id: 'system_administrator',
    label: 'System Administrator',
    description: 'Platform administration and access control',
    permissions: [
      'dashboard.admin.view',
      'employees.view',
      'access.roles.manage',
      'modules.configure',
      'settings.view',
      'reports.organization.view',
      'calendar.view',
      'leave.request',
    ],
  },
}
