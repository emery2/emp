import {
  assertCanDisableModule,
  assertCanEnableModule,
  MODULE_IDS,
  type ModuleId,
} from '@/access/modules'
import {
  FEATURE_MANIFESTS,
  featuresForService,
} from '@/modules/feature-manifests'
import { FEATURE_KEYS, type FeatureKey } from '@/modules/feature-keys'
import type {
  FeatureEntitlementRecord,
  ModuleEntitlementRecord,
} from '@/shared/contracts'
import { tenants } from '@/mocks/tenants'
import { storageGet, storageRemove, storageSet } from '@/shared/repositories/storage'

const STORAGE_MODULES = 'emp-tenant-modules-v1'
const STORAGE_FEATURES = 'emp-tenant-features-v1'

function defaultModules(): ModuleId[] {
  return [...MODULE_IDS]
}

function defaultFeaturesForModules(modules: ModuleId[]): FeatureKey[] {
  const set = new Set<FeatureKey>()
  for (const moduleId of modules) {
    for (const manifest of featuresForService(moduleId)) {
      if (manifest.defaultEnabled) set.add(manifest.key)
    }
  }
  return [...set]
}

function readJson<T>(key: string): T | null {
  try {
    const raw = storageGet(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  storageSet(key, JSON.stringify(value))
}

type ModuleStore = Record<string, ModuleId[]>
type FeatureStore = Record<string, FeatureKey[]>

function loadModules(): ModuleStore {
  const stored = readJson<ModuleStore>(STORAGE_MODULES)
  if (stored) return stored
  const seed: ModuleStore = {}
  for (const tenant of tenants) {
    seed[tenant.id] = defaultModules()
  }
  return seed
}

function loadFeatures(): FeatureStore {
  const stored = readJson<FeatureStore>(STORAGE_FEATURES)
  if (stored) return stored
  const modules = loadModules()
  const seed: FeatureStore = {}
  for (const tenant of tenants) {
    seed[tenant.id] = defaultFeaturesForModules(modules[tenant.id] ?? defaultModules())
  }
  return seed
}

let moduleStore: ModuleStore = loadModules()
let featureStore: FeatureStore = loadFeatures()

function persistModules(): void {
  writeJson(STORAGE_MODULES, moduleStore)
}

function persistFeatures(): void {
  writeJson(STORAGE_FEATURES, featureStore)
}

/** Migrate legacy global `emp-enabled-modules-v1` once if present. */
function migrateLegacyGlobalModules(): void {
  try {
    const legacy = storageGet('emp-enabled-modules-v1')
    if (!legacy) return
    const parsed = JSON.parse(legacy) as string[]
    const migrated = parsed
      .map((id) => (id === 'hcm' ? 'hr' : id))
      .filter((id): id is ModuleId =>
        (MODULE_IDS as readonly string[]).includes(id),
      )
    if (migrated.length > 0) {
      for (const tenant of tenants) {
        if (!moduleStore[tenant.id]) moduleStore[tenant.id] = migrated
      }
      persistModules()
    }
    storageRemove('emp-enabled-modules-v1')
  } catch {
    /* ignore */
  }
}

migrateLegacyGlobalModules()

export interface EntitlementsRepository {
  listModules(tenantId: string): ModuleId[]
  isModuleEnabled(tenantId: string, moduleId: ModuleId): boolean
  setModules(
    tenantId: string,
    modules: ModuleId[],
    actorUserId: string,
  ): ModuleEntitlementRecord
  listFeatures(tenantId: string): FeatureKey[]
  isFeatureEnabled(tenantId: string, featureKey: FeatureKey): boolean
  setFeatures(
    tenantId: string,
    features: FeatureKey[],
    actorUserId: string,
  ): FeatureEntitlementRecord
  /** Features whose owning service is not entitled are treated as off. */
  isFeatureEffectivelyEnabled(tenantId: string, featureKey: FeatureKey): boolean
}

function ensureTenantModules(tenantId: string): ModuleId[] {
  if (!moduleStore[tenantId]) {
    moduleStore[tenantId] = defaultModules()
    persistModules()
  }
  return moduleStore[tenantId]
}

function ensureTenantFeatures(tenantId: string): FeatureKey[] {
  if (!featureStore[tenantId]) {
    featureStore[tenantId] = defaultFeaturesForModules(ensureTenantModules(tenantId))
    persistFeatures()
  }
  return featureStore[tenantId]
}

export const mockEntitlementsRepository: EntitlementsRepository = {
  listModules(tenantId) {
    return [...ensureTenantModules(tenantId)]
  },

  isModuleEnabled(tenantId, moduleId) {
    return ensureTenantModules(tenantId).includes(moduleId)
  },

  setModules(tenantId, modules, actorUserId) {
    const unique = [...new Set(modules)].filter((id) =>
      (MODULE_IDS as readonly string[]).includes(id),
    )
    const previous = ensureTenantModules(tenantId)

    for (const id of unique) {
      if (!previous.includes(id)) assertCanEnableModule(id, unique)
    }
    for (const id of previous) {
      if (!unique.includes(id)) assertCanDisableModule(id, previous)
    }

    moduleStore[tenantId] = unique
    persistModules()

    // Drop features whose owning service was disabled; seed defaults for newly enabled services.
    const currentFeatures = ensureTenantFeatures(tenantId).filter((key) =>
      unique.includes(FEATURE_MANIFESTS[key].owningService),
    )
    for (const moduleId of unique) {
      if (!previous.includes(moduleId)) {
        for (const manifest of featuresForService(moduleId)) {
          if (manifest.defaultEnabled && !currentFeatures.includes(manifest.key)) {
            currentFeatures.push(manifest.key)
          }
        }
      }
    }
    featureStore[tenantId] = currentFeatures
    persistFeatures()

    return {
      tenantId,
      modules: [...unique],
      updatedAt: new Date().toISOString(),
      updatedByUserId: actorUserId,
    }
  },

  listFeatures(tenantId) {
    return [...ensureTenantFeatures(tenantId)]
  },

  isFeatureEnabled(tenantId, featureKey) {
    return ensureTenantFeatures(tenantId).includes(featureKey)
  },

  setFeatures(tenantId, features, actorUserId) {
    const modules = ensureTenantModules(tenantId)
    const unique = [...new Set(features)].filter((key) =>
      (FEATURE_KEYS as readonly string[]).includes(key),
    )

    for (const key of unique) {
      const owning = FEATURE_MANIFESTS[key].owningService
      if (!modules.includes(owning)) {
        throw new Error(
          `Cannot entitle ${key}: owning service ${owning} is not enabled for this tenant`,
        )
      }
    }

    featureStore[tenantId] = unique
    persistFeatures()

    return {
      tenantId,
      features: [...unique],
      updatedAt: new Date().toISOString(),
      updatedByUserId: actorUserId,
    }
  },

  isFeatureEffectivelyEnabled(tenantId, featureKey) {
    const manifest = FEATURE_MANIFESTS[featureKey]
    if (!this.isModuleEnabled(tenantId, manifest.owningService)) return false
    return this.isFeatureEnabled(tenantId, featureKey)
  },
}

/** Test helper — reset in-memory + storage. */
export function __resetEntitlementsForTests(): void {
  moduleStore = {}
  featureStore = {}
  for (const tenant of tenants) {
    moduleStore[tenant.id] = defaultModules()
    featureStore[tenant.id] = defaultFeaturesForModules(moduleStore[tenant.id])
  }
  persistModules()
  persistFeatures()
}
