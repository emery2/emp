import { delay } from '@/mocks/delay'
import type { ModuleId } from '@/access/modules'
import type { FeatureKey } from '@/modules/feature-keys'
import { mockEntitlementsRepository } from '@/shared/repositories/entitlements-repository'
import { mockFeatureConfigRepository } from '@/shared/repositories/feature-config-repository'
import type { FeatureConfigMap } from '@/modules/feature-schemas'
import type { FeatureConfigVersionRecord } from '@/shared/contracts'

export const entitlementKeys = {
  all: ['entitlements'] as const,
  modules: (tenantId: string) =>
    ['entitlements', 'modules', tenantId] as const,
  features: (tenantId: string) =>
    ['entitlements', 'features', tenantId] as const,
  config: (tenantId: string, featureKey: FeatureKey) =>
    ['entitlements', 'config', tenantId, featureKey] as const,
  audit: (tenantId: string, featureKey: FeatureKey) =>
    ['entitlements', 'audit', tenantId, featureKey] as const,
}

export async function fetchTenantModules(tenantId: string): Promise<ModuleId[]> {
  await delay(80)
  return mockEntitlementsRepository.listModules(tenantId)
}

export async function updateTenantModules(
  tenantId: string,
  modules: ModuleId[],
  actorUserId: string,
): Promise<ModuleId[]> {
  await delay(150)
  return mockEntitlementsRepository.setModules(tenantId, modules, actorUserId)
    .modules
}

export async function fetchTenantFeatures(
  tenantId: string,
): Promise<FeatureKey[]> {
  await delay(80)
  return mockEntitlementsRepository.listFeatures(tenantId)
}

export async function updateTenantFeatures(
  tenantId: string,
  features: FeatureKey[],
  actorUserId: string,
): Promise<FeatureKey[]> {
  await delay(150)
  return mockEntitlementsRepository.setFeatures(tenantId, features, actorUserId)
    .features
}

export async function fetchFeatureConfig<K extends FeatureKey>(
  tenantId: string,
  featureKey: K,
): Promise<FeatureConfigVersionRecord<K>> {
  await delay(80)
  return mockFeatureConfigRepository.getCurrentConfig(tenantId, featureKey)
}

export async function previewFeatureConfig<K extends FeatureKey>(
  featureKey: K,
  raw: unknown,
): Promise<FeatureConfigMap[K]> {
  await delay(40)
  return mockFeatureConfigRepository.previewConfig(featureKey, raw)
}

export async function saveFeatureConfig<K extends FeatureKey>(
  tenantId: string,
  featureKey: K,
  raw: unknown,
  actorUserId: string,
): Promise<FeatureConfigVersionRecord<K>> {
  await delay(150)
  return mockFeatureConfigRepository.saveConfig(
    tenantId,
    featureKey,
    raw,
    actorUserId,
  )
}

export async function resetFeatureConfig<K extends FeatureKey>(
  tenantId: string,
  featureKey: K,
  actorUserId: string,
): Promise<FeatureConfigVersionRecord<K>> {
  await delay(150)
  return mockFeatureConfigRepository.resetToDefaults(
    tenantId,
    featureKey,
    actorUserId,
  )
}

export async function fetchFeatureConfigAudit(
  tenantId: string,
  featureKey: FeatureKey,
) {
  await delay(60)
  return mockFeatureConfigRepository.listAudit(tenantId, featureKey)
}
