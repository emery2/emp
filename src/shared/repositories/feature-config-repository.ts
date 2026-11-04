import { FEATURE_MANIFESTS } from '@/modules/feature-manifests'
import { FEATURE_KEYS, type FeatureKey } from '@/modules/feature-keys'
import {
  featureConfigDefaults,
  parseFeatureConfig,
  type FeatureConfigMap,
} from '@/modules/feature-schemas'
import type {
  FeatureConfigAuditEntry,
  FeatureConfigVersionRecord,
} from '@/shared/contracts'
import { storageGet, storageSet } from '@/shared/repositories/storage'
import { tenants } from '@/mocks/tenants'

const STORAGE_VERSIONS = 'emp-feature-config-versions-v1'
const STORAGE_AUDIT = 'emp-feature-config-audit-v1'

type VersionStore = FeatureConfigVersionRecord[]
type AuditStore = FeatureConfigAuditEntry[]

function readVersions(): VersionStore {
  try {
    const raw = storageGet(STORAGE_VERSIONS)
    if (!raw) return []
    return JSON.parse(raw) as VersionStore
  } catch {
    return []
  }
}

function readAudit(): AuditStore {
  try {
    const raw = storageGet(STORAGE_AUDIT)
    if (!raw) return []
    return JSON.parse(raw) as AuditStore
  } catch {
    return []
  }
}

let versions: VersionStore = readVersions()
let auditLog: AuditStore = readAudit()

function persist(): void {
  storageSet(STORAGE_VERSIONS, JSON.stringify(versions))
  storageSet(STORAGE_AUDIT, JSON.stringify(auditLog))
}

function seedTenantIfNeeded(tenantId: string): void {
  const hasAny = versions.some((v) => v.tenantId === tenantId)
  if (hasAny) return
  const now = new Date().toISOString()
  for (const key of FEATURE_KEYS) {
    versions.push({
      id: `${tenantId}:${key}:v1`,
      tenantId,
      featureKey: key,
      version: 1,
      schemaVersion: FEATURE_MANIFESTS[key].configSchemaVersion,
      config: featureConfigDefaults(key),
      createdAt: now,
      createdByUserId: 'system',
      isCurrent: true,
    })
  }
  persist()
}

for (const tenant of tenants) {
  seedTenantIfNeeded(tenant.id)
}

export interface FeatureConfigRepository {
  getCurrentConfig<K extends FeatureKey>(
    tenantId: string,
    featureKey: K,
  ): FeatureConfigVersionRecord<K>
  getConfigByVersionId(
    tenantId: string,
    versionId: string,
  ): FeatureConfigVersionRecord | undefined
  /** Validates, versions, audit-logs. Does not mutate prior versions. */
  saveConfig<K extends FeatureKey>(
    tenantId: string,
    featureKey: K,
    rawConfig: unknown,
    actorUserId: string,
  ): FeatureConfigVersionRecord<K>
  resetToDefaults<K extends FeatureKey>(
    tenantId: string,
    featureKey: K,
    actorUserId: string,
  ): FeatureConfigVersionRecord<K>
  listAudit(tenantId: string, featureKey?: FeatureKey): FeatureConfigAuditEntry[]
  /** Preview = validated config without persisting. */
  previewConfig<K extends FeatureKey>(
    featureKey: K,
    rawConfig: unknown,
  ): FeatureConfigMap[K]
}

export const mockFeatureConfigRepository: FeatureConfigRepository = {
  getCurrentConfig(tenantId, featureKey) {
    seedTenantIfNeeded(tenantId)
    const current = versions.find(
      (v) =>
        v.tenantId === tenantId &&
        v.featureKey === featureKey &&
        v.isCurrent,
    )
    if (!current) {
      throw new Error(`No config for ${featureKey} on ${tenantId}`)
    }
    return current as FeatureConfigVersionRecord<typeof featureKey>
  },

  getConfigByVersionId(tenantId, versionId) {
    return versions.find((v) => v.tenantId === tenantId && v.id === versionId)
  },

  previewConfig(featureKey, rawConfig) {
    return parseFeatureConfig(featureKey, rawConfig)
  },

  saveConfig(tenantId, featureKey, rawConfig, actorUserId) {
    seedTenantIfNeeded(tenantId)
    const parsed = parseFeatureConfig(featureKey, rawConfig)
    const prior = versions.filter(
      (v) => v.tenantId === tenantId && v.featureKey === featureKey,
    )
    const nextVersion =
      prior.reduce((max, v) => Math.max(max, v.version), 0) + 1

    for (const v of prior) {
      if (v.isCurrent) v.isCurrent = false
    }

    const record: FeatureConfigVersionRecord<typeof featureKey> = {
      id: `${tenantId}:${featureKey}:v${nextVersion}`,
      tenantId,
      featureKey,
      version: nextVersion,
      schemaVersion: FEATURE_MANIFESTS[featureKey].configSchemaVersion,
      config: parsed,
      createdAt: new Date().toISOString(),
      createdByUserId: actorUserId,
      isCurrent: true,
    }
    versions.push(record)

    auditLog.push({
      id: `audit-${record.id}`,
      tenantId,
      featureKey,
      versionId: record.id,
      action: prior.length === 0 ? 'create' : 'update',
      actorUserId,
      at: record.createdAt,
      summary: `Saved ${featureKey} config as version ${nextVersion}`,
    })
    persist()
    return record
  },

  resetToDefaults(tenantId, featureKey, actorUserId) {
    const record = this.saveConfig(
      tenantId,
      featureKey,
      featureConfigDefaults(featureKey),
      actorUserId,
    )
    const last = auditLog[auditLog.length - 1]
    if (last && last.versionId === record.id) {
      last.action = 'reset'
      last.summary = `Reset ${featureKey} to defaults (version ${record.version})`
      persist()
    }
    return record
  },

  listAudit(tenantId, featureKey) {
    return auditLog
      .filter(
        (e) =>
          e.tenantId === tenantId &&
          (featureKey === undefined || e.featureKey === featureKey),
      )
      .slice()
      .reverse()
  },
}

export function __resetFeatureConfigForTests(): void {
  versions = []
  auditLog = []
  for (const tenant of tenants) {
    seedTenantIfNeeded(tenant.id)
  }
}
