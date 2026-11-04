import { hasPermission } from '@/access/evaluate'
import type { AppUser } from '@/types/access'
import type { QuotationRecord } from '@/types/commercial'

export {
  assertOpportunityConversion,
  canConvertOpportunityToQuotation,
} from '@/shared/contracts'

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

