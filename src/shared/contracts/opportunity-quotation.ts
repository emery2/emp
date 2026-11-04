import { hasPermission } from '@/access/evaluate'
import type { AppUser } from '@/types/access'
import type { OpportunityRecord } from '@/types/commercial'

/** CRM ↔ ERP bridge: conversion eligibility without feature→feature imports. */
export function canConvertOpportunityToQuotation(
  actor: AppUser,
  opportunity: OpportunityRecord,
): boolean {
  if (!hasPermission(actor, 'erp.quotations.manage')) return false
  if (opportunity.stage === 'lost' || opportunity.stage === 'won') return false
  if (opportunity.quotationId) return false
  return true
}

export function assertOpportunityConversion(
  actor: AppUser,
  opportunity: OpportunityRecord,
): void {
  if (!canConvertOpportunityToQuotation(actor, opportunity)) {
    throw new Error(
      'Not allowed to convert this opportunity to a quotation (permission, stage, or already converted)',
    )
  }
}
