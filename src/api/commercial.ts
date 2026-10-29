import { delay } from '@/mocks/delay'
import {
  createDecisionId,
  createOpportunityId,
  createQuotationId,
  getOpportunity,
  getQuotation,
  listOpportunities,
  listQuotations,
  nextQuotationNumber,
  replaceOpportunities,
  replaceQuotations,
} from '@/mocks/commercial'
import {
  assertOpportunityConversion,
  canFinanceApproveQuotation,
  canMarkQuotationSent,
  canSalesSubmitQuotation,
} from '@/features/erp/quotation-rules'
import type { AppUser } from '@/types/access'
import type {
  OpportunityRecord,
  OpportunityStage,
  QuotationRecord,
} from '@/types/commercial'

export const commercialKeys = {
  opportunities: ['commercial', 'opportunities'] as const,
  opportunity: (id: string) => ['commercial', 'opportunity', id] as const,
  quotations: ['commercial', 'quotations'] as const,
  quotation: (id: string) => ['commercial', 'quotation', id] as const,
}

export async function fetchOpportunities(): Promise<OpportunityRecord[]> {
  await delay()
  return listOpportunities()
}

export async function fetchOpportunity(id: string): Promise<OpportunityRecord> {
  await delay()
  const item = getOpportunity(id)
  if (!item) throw new Error('Opportunity not found')
  return item
}

export async function createOpportunity(
  actor: AppUser,
  input: {
    name: string
    accountName: string
    contactName: string
    amount: number
    expectedCloseDate: string
    stage?: OpportunityStage
  },
): Promise<OpportunityRecord> {
  await delay(250)
  const now = new Date().toISOString()
  const created: OpportunityRecord = {
    id: createOpportunityId(),
    organizationId: actor.organizationId,
    name: input.name,
    accountName: input.accountName,
    contactName: input.contactName,
    ownerUserId: actor.id,
    ownerName: `${actor.firstName} ${actor.lastName}`,
    stage: input.stage ?? 'qualify',
    amount: input.amount,
    currency: 'EUR',
    expectedCloseDate: input.expectedCloseDate,
    createdAt: now,
    updatedAt: now,
  }
  replaceOpportunities([created, ...listOpportunities()])
  return created
}

export async function convertOpportunityToQuotation(
  actor: AppUser,
  opportunityId: string,
): Promise<QuotationRecord> {
  await delay(300)
  const opportunity = getOpportunity(opportunityId)
  if (!opportunity) throw new Error('Opportunity not found')
  assertOpportunityConversion(actor, opportunity)

  const now = new Date().toISOString()
  const quotation: QuotationRecord = {
    id: createQuotationId(),
    organizationId: actor.organizationId,
    number: nextQuotationNumber(),
    opportunityId: opportunity.id,
    accountName: opportunity.accountName,
    ownerUserId: actor.id,
    ownerName: `${actor.firstName} ${actor.lastName}`,
    status: 'pending_finance',
    currency: opportunity.currency,
    lines: [
      {
        id: `ql-${Date.now()}`,
        sku: 'PKG-STD',
        description: `${opportunity.name} — proposed package`,
        quantity: 1,
        unitPrice: opportunity.amount,
      },
    ],
    total: opportunity.amount,
    createdAt: now,
    updatedAt: now,
    decisions: [
      {
        id: createDecisionId(),
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        action: 'submit',
        comment: `Converted from opportunity ${opportunity.id}`,
        at: now,
      },
    ],
  }

  replaceQuotations([quotation, ...listQuotations()])
  replaceOpportunities(
    listOpportunities().map((item) =>
      item.id === opportunity.id
        ? { ...item, quotationId: quotation.id, stage: 'propose', updatedAt: now }
        : item,
    ),
  )
  return quotation
}

export async function fetchQuotations(): Promise<QuotationRecord[]> {
  await delay()
  return listQuotations()
}

export async function fetchQuotation(id: string): Promise<QuotationRecord> {
  await delay()
  const item = getQuotation(id)
  if (!item) throw new Error('Quotation not found')
  return item
}

export async function decideQuotation(
  actor: AppUser,
  quotationId: string,
  action: 'approve' | 'reject' | 'return' | 'send',
  comment?: string,
): Promise<QuotationRecord> {
  await delay(250)
  const current = getQuotation(quotationId)
  if (!current) throw new Error('Quotation not found')

  if (action === 'approve') {
    if (!canFinanceApproveQuotation(actor, current)) {
      throw new Error('Not allowed to approve this quotation')
    }
  } else if (action === 'reject' || action === 'return') {
    if (!canFinanceApproveQuotation(actor, current) && !canSalesSubmitQuotation(actor, current)) {
      throw new Error('Not allowed to decide on this quotation')
    }
  } else if (action === 'send') {
    if (!canMarkQuotationSent(actor, current)) {
      throw new Error('Quotation must be approved before sending')
    }
  }

  const now = new Date().toISOString()
  const statusMap = {
    approve: 'approved',
    reject: 'rejected',
    return: 'draft',
    send: 'sent',
  } as const

  const updated: QuotationRecord = {
    ...current,
    status: statusMap[action],
    updatedAt: now,
    decisions: [
      ...current.decisions,
      {
        id: createDecisionId(),
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        action,
        comment,
        at: now,
      },
    ],
  }

  replaceQuotations(
    listQuotations().map((item) => (item.id === quotationId ? updated : item)),
  )

  if (action === 'approve' && updated.opportunityId) {
    replaceOpportunities(
      listOpportunities().map((item) =>
        item.id === updated.opportunityId
          ? { ...item, stage: 'negotiate', updatedAt: now }
          : item,
      ),
    )
  }

  return updated
}
