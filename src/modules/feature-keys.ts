/** Feature keys extend module entitlements (owner toggle + client config). */

export const FEATURE_KEYS = [
  'hr.leave',
  'hr.goals',
  'hr.evaluations',
  'hr.evaluations.appeals',
  'hr.profile_self_service',
  'documents.signatures.builtin',
  'documents.signatures.external',
] as const

export type FeatureKey = (typeof FEATURE_KEYS)[number]
