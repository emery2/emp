import type { ModuleId } from '@/access/modules'
import type { RoleId } from '@/access/roles'
import {
  FEATURE_KEYS,
  type FeatureKey,
} from '@/modules/feature-keys'
import {
  FEATURE_CONFIG_SCHEMAS,
  featureConfigDefaults,
  type FeatureConfigMap,
} from '@/modules/feature-schemas'

export interface FeatureManifest<K extends FeatureKey = FeatureKey> {
  key: K
  owningService: ModuleId
  description: string
  /** Owner-layer default when the owning service is first enabled. */
  defaultEnabled: boolean
  /** Roles allowed to edit client-layer configuration (within entitled tenants). */
  configureRoles: RoleId[]
  configSchemaVersion: number
}

export const FEATURE_MANIFESTS: { [K in FeatureKey]: FeatureManifest<K> } = {
  'hr.leave': {
    key: 'hr.leave',
    owningService: 'hr',
    description: 'Two-part leave request and verification',
    defaultEnabled: true,
    configureRoles: [
      'super_administrator',
      'system_administrator',
      'hr_officer',
      'hr_head',
    ],
    configSchemaVersion: 1,
  },
  'hr.goals': {
    key: 'hr.goals',
    owningService: 'hr',
    description: 'Employee goal setting with Head of Department approval',
    defaultEnabled: true,
    configureRoles: [
      'super_administrator',
      'system_administrator',
      'hr_officer',
      'hr_head',
    ],
    configSchemaVersion: 1,
  },
  'hr.evaluations': {
    key: 'hr.evaluations',
    owningService: 'hr',
    description: 'Evaluation cycles with self and manager assessment',
    defaultEnabled: true,
    configureRoles: [
      'super_administrator',
      'system_administrator',
      'hr_officer',
      'hr_head',
    ],
    configSchemaVersion: 1,
  },
  'hr.evaluations.appeals': {
    key: 'hr.evaluations.appeals',
    owningService: 'hr',
    description: 'Evaluation dispute, reconsideration, and calibration',
    defaultEnabled: true,
    configureRoles: [
      'super_administrator',
      'system_administrator',
      'hr_officer',
      'hr_head',
    ],
    configSchemaVersion: 1,
  },
  'hr.profile_self_service': {
    key: 'hr.profile_self_service',
    owningService: 'hr',
    description: 'Employee profile edits with sensitivity and HR approval',
    defaultEnabled: true,
    configureRoles: [
      'super_administrator',
      'system_administrator',
      'hr_officer',
      'hr_head',
    ],
    configSchemaVersion: 1,
  },
  'documents.signatures.builtin': {
    key: 'documents.signatures.builtin',
    owningService: 'documents',
    description: 'Built-in electronic approval stamp (not a qualified signature)',
    defaultEnabled: true,
    configureRoles: ['super_administrator', 'system_administrator'],
    configSchemaVersion: 1,
  },
  'documents.signatures.external': {
    key: 'documents.signatures.external',
    owningService: 'documents',
    description: 'External signature provider adapter (DocuSign mock in frontend)',
    defaultEnabled: false,
    configureRoles: ['super_administrator', 'system_administrator'],
    configSchemaVersion: 1,
  },
}

export function listFeatureManifests(): FeatureManifest[] {
  return FEATURE_KEYS.map((key) => FEATURE_MANIFESTS[key])
}

export function featuresForService(service: ModuleId): FeatureManifest[] {
  return listFeatureManifests().filter((m) => m.owningService === service)
}

export function defaultConfigForFeature<K extends FeatureKey>(
  key: K,
): FeatureConfigMap[K] {
  return featureConfigDefaults(key)
}

export { FEATURE_CONFIG_SCHEMAS }
