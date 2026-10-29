import { hasPermission } from '@/access/evaluate'
import type { AppUser } from '@/types/access'
import type { OpportunityRecord, QuotationRecord } from '@/types/commercial'

export function canConvertOpportunityToQuotation(
  actor: AppUser,
  opportunity: OpportunityRecord,
): boolean {
  if (!hasPermission(actor, 'erp.quotations.manage')) return false
  if (opportunity.stage === 'lost' || opportunity.stage === 'won') return false
  if (opportunity.quotationId) return false
  return true
}

export function canFinanceApproveQuotation(
  actor: AppUser,
  quotation: QuotationRecord,
): boolean {
  if (!hasPermission(actor, 'erp.quotations.manage')) return false
  if (!hasPermission(actor, 'dashboard.finance.view') && !hasPermission(actor, 'finance.ar.view')) {
    // Sales can create/submit; finance approves pending
    return false
  }
  return quotation.status === 'pending_finance'
}

export function canSalesSubmitQuotation(
  actor: AppUser,
  quotation: QuotationRecord,
): boolean {
  if (!hasPermission(actor, 'erp.quotations.manage')) return false
  return quotation.status === 'draft'
}

export function canMarkQuotationSent(
  actor: AppUser,
  quotation: QuotationRecord,
): boolean {
  if (!hasPermission(actor, 'erp.quotations.manage')) return false
  return quotation.status === 'approved'
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
