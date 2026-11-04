import type { ModuleId } from '@/access/modules'

export interface ModuleEntitlementRecord {
  tenantId: string
  modules: ModuleId[]
  updatedAt: string
  updatedByUserId: string
}

/** Immutable snapshot used so in-progress work keeps the rules it started under. */
export interface EntitlementSnapshot {
  tenantId: string
  modules: ModuleId[]
  featureKeys: string[]
  capturedAt: string
}
