import { delay } from '@/mocks/delay'
import type { ModuleId } from '@/access/modules'
import { mockEntitlementsRepository } from '@/shared/repositories/entitlements-repository'

/** @deprecated Prefer entitlementKeys + fetchTenantModules(tenantId). */
export const moduleKeys = {
  all: ['modules'] as const,
  enabled: ['modules', 'enabled'] as const,
}

function currentTenantId(): string {
  try {
    return localStorage.getItem('emp-tenant') ?? 'tenant-norf'
  } catch {
    return 'tenant-norf'
  }
}

export async function fetchEnabledModules(): Promise<ModuleId[]> {
  await delay(100)
  return mockEntitlementsRepository.listModules(currentTenantId())
}

export async function updateEnabledModules(
  next: ModuleId[],
): Promise<ModuleId[]> {
  await delay(200)
  return mockEntitlementsRepository.setModules(
    currentTenantId(),
    next,
    'legacy',
  ).modules
}

export async function checkModuleEnabled(moduleId: ModuleId): Promise<boolean> {
  await delay(50)
  return mockEntitlementsRepository.isModuleEnabled(
    currentTenantId(),
    moduleId,
  )
}
