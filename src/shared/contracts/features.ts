import type { FeatureKey } from '@/modules/feature-keys'
import type { FeatureConfigMap } from '@/modules/feature-schemas'

export interface FeatureEntitlementRecord {
  tenantId: string
  features: FeatureKey[]
  updatedAt: string
  updatedByUserId: string
}

export interface FeatureConfigVersionRecord<K extends FeatureKey = FeatureKey> {
  id: string
  tenantId: string
  featureKey: K
  version: number
  schemaVersion: number
  config: FeatureConfigMap[K]
  createdAt: string
  createdByUserId: string
  /** True for the active version used by new work. */
  isCurrent: boolean
}

export interface FeatureConfigAuditEntry {
  id: string
  tenantId: string
  featureKey: FeatureKey
  versionId: string
  action: 'create' | 'update' | 'reset'
  actorUserId: string
  at: string
  summary: string
}
