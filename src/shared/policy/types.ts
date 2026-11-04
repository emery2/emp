import type { ModuleId } from '@/access/modules'
import type { FeatureKey } from '@/modules/feature-keys'

export type PolicyAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'submit'
  | 'configure'
  | 'entitle'
  | string

export type PolicyResource =
  | 'module'
  | 'feature'
  | 'leave'
  | 'goal'
  | 'evaluation'
  | 'profile_change'
  | 'signature'
  | 'feature_config'
  | string

export interface PolicyContext {
  tenantId: string
  moduleId?: ModuleId
  featureKey?: FeatureKey
  /** When set, actor must not equal this id (segregation of duties). */
  subjectUserId?: string
  /** Permission key required in addition to entitlements. */
  permission?: string
  /** Snapshot id for in-progress items (future domain use). */
  configVersionId?: string
}

export interface PolicyDecision {
  allowed: boolean
  reason?: string
}
