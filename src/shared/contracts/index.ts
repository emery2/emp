/**
 * Cross-service typed contracts. Feature folders must not import each other;
 * they may import from `@/shared/contracts` only for shared shapes/events.
 */

export type { EntitlementSnapshot, ModuleEntitlementRecord } from './entitlements'
export type {
  FeatureConfigVersionRecord,
  FeatureEntitlementRecord,
  FeatureConfigAuditEntry,
} from './features'
export type { EpmObjectiveRef } from './epm'
export {
  canConvertOpportunityToQuotation,
  assertOpportunityConversion,
} from './opportunity-quotation'
