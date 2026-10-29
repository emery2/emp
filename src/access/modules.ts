/** Configurable product modules. Org enablement gates nav + routes alongside permissions. */

export const MODULE_IDS = [
  'hcm',
  'crm',
  'prm',
  'erp',
  'scm',
  'cx',
  'epm',
  'projects',
] as const

export type ModuleId = (typeof MODULE_IDS)[number]

export interface ModuleDefinition {
  id: ModuleId
  label: string
  description: string
}

export const MODULE_DEFINITIONS: Record<ModuleId, ModuleDefinition> = {
  hcm: {
    id: 'hcm',
    label: 'HCM',
    description: 'People, leave, and workforce operations',
  },
  crm: {
    id: 'crm',
    label: 'CRM',
    description: 'Leads, opportunities, and customer pipeline',
  },
  prm: {
    id: 'prm',
    label: 'PRM',
    description: 'Partner referrals and commissions',
  },
  erp: {
    id: 'erp',
    label: 'ERP',
    description: 'Quotations, sales orders, and purchasing',
  },
  scm: {
    id: 'scm',
    label: 'SCM / Manufacturing',
    description: 'Suppliers, inventory, and production',
  },
  cx: {
    id: 'cx',
    label: 'CX',
    description: 'Service cases and customer care',
  },
  epm: {
    id: 'epm',
    label: 'EPM',
    description: 'Budgets, forecasts, and performance',
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    description: 'Delivery portfolio and tasks',
  },
}
