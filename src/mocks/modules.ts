/**
 * @deprecated Prefer `mockEntitlementsRepository` with an explicit tenantId.
 * These helpers read the current Shell tenant from localStorage for legacy call sites.
 */
import type { ModuleId } from '@/access/modules'
import { mockEntitlementsRepository } from '@/shared/repositories/entitlements-repository'

function currentTenantId(): string {
  try {
    return localStorage.getItem('emp-tenant') ?? 'tenant-norf'
  } catch {
    return 'tenant-norf'
  }
}

export function listEnabledModules(): ModuleId[] {
  return mockEntitlementsRepository.listModules(currentTenantId())
}

export function isModuleEnabled(moduleId: ModuleId): boolean {
  return mockEntitlementsRepository.isModuleEnabled(currentTenantId(), moduleId)
}

export function setEnabledModules(next: ModuleId[]): ModuleId[] {
  mockEntitlementsRepository.setModules(currentTenantId(), next, 'legacy')
  return listEnabledModules()
}

export function isFeatureEnabled(
  featureKey: import('@/modules/feature-keys').FeatureKey,
): boolean {
  return mockEntitlementsRepository.isFeatureEffectivelyEnabled(
    currentTenantId(),
    featureKey,
  )
}
