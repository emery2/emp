/** Product services (optional modules). Org enablement gates nav + routes alongside permissions. */

export const MODULE_IDS = [
  'hr',
  'crm',
  'prm',
  'erp',
  'scm',
  'cx',
  'epm',
  'projects',
  'documents',
] as const

export type ModuleId = (typeof MODULE_IDS)[number]

export interface ModuleDefinition {
  id: ModuleId
  label: string
  description: string
  /** Hard dependencies that must be enabled first. */
  hardRequires: ModuleId[]
  /** Soft peers — adapters activate only when both sides entitled. */
  optionalIntegrations: ModuleId[]
}

export const MODULE_DEFINITIONS: Record<ModuleId, ModuleDefinition> = {
  hr: {
    id: 'hr',
    label: 'HR',
    description: 'People, leave, goals, evaluations, and workforce operations',
    hardRequires: [],
    optionalIntegrations: ['projects', 'epm'],
  },
  crm: {
    id: 'crm',
    label: 'CRM',
    description: 'Leads, opportunities, and customer pipeline',
    hardRequires: [],
    optionalIntegrations: ['prm', 'cx', 'epm'],
  },
  prm: {
    id: 'prm',
    label: 'PRM',
    description: 'Partner referrals and commissions',
    hardRequires: [],
    optionalIntegrations: ['crm', 'epm'],
  },
  erp: {
    id: 'erp',
    label: 'ERP',
    description: 'Quotations, sales orders, and purchasing',
    hardRequires: [],
    optionalIntegrations: ['crm'],
  },
  scm: {
    id: 'scm',
    label: 'SCM / Manufacturing',
    description: 'Suppliers, inventory, and production',
    hardRequires: [],
    optionalIntegrations: ['hr'],
  },
  cx: {
    id: 'cx',
    label: 'CX',
    description: 'Service cases and customer care',
    hardRequires: [],
    optionalIntegrations: ['crm'],
  },
  epm: {
    id: 'epm',
    label: 'EPM',
    description: 'Objectives, KPIs, budgets, and performance',
    hardRequires: [],
    optionalIntegrations: ['hr', 'crm', 'prm', 'projects'],
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    description: 'Delivery portfolio and tasks',
    hardRequires: [],
    optionalIntegrations: ['hr', 'epm'],
  },
  documents: {
    id: 'documents',
    label: 'Documents',
    description: 'Document store, versions, and digital signatures',
    hardRequires: [],
    optionalIntegrations: ['hr', 'crm', 'prm'],
  },
}

export function assertCanEnableModule(
  moduleId: ModuleId,
  enabled: readonly ModuleId[],
): void {
  const def = MODULE_DEFINITIONS[moduleId]
  for (const dep of def.hardRequires) {
    if (!enabled.includes(dep)) {
      throw new Error(
        `Cannot enable ${def.label}: requires ${MODULE_DEFINITIONS[dep].label}`,
      )
    }
  }
}

export function assertCanDisableModule(
  moduleId: ModuleId,
  enabled: readonly ModuleId[],
): void {
  const dependents = MODULE_IDS.filter(
    (id) =>
      enabled.includes(id) &&
      MODULE_DEFINITIONS[id].hardRequires.includes(moduleId),
  )
  if (dependents.length > 0) {
    const labels = dependents.map((id) => MODULE_DEFINITIONS[id].label).join(', ')
    throw new Error(
      `Cannot disable ${MODULE_DEFINITIONS[moduleId].label}: required by ${labels}`,
    )
  }
}
