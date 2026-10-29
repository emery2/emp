import type { OpportunityRecord, QuotationRecord } from '@/types/commercial'

let opportunityStore: OpportunityRecord[] = [
  {
    id: 'opp-100',
    organizationId: 'org-norf',
    name: 'Atlas line automation',
    accountName: 'Atlas Manufacturing',
    contactName: 'Tomás Silva',
    ownerUserId: 'user-sales',
    ownerName: 'Elena Rossi',
    stage: 'propose',
    amount: 88000,
    currency: 'EUR',
    expectedCloseDate: '2026-12-15',
    leadId: 'lead-2',
    createdAt: '2026-10-06T10:00:00.000Z',
    updatedAt: '2026-10-20T09:00:00.000Z',
  },
  {
    id: 'opp-101',
    organizationId: 'org-norf',
    name: 'Helios energy retrofit',
    accountName: 'Helios Energy',
    contactName: 'Ingrid Bauer',
    ownerUserId: 'user-crm',
    ownerName: 'Amara Diallo',
    stage: 'negotiate',
    amount: 125000,
    currency: 'EUR',
    expectedCloseDate: '2026-11-30',
    leadId: 'lead-3',
    quotationId: 'quot-200',
    createdAt: '2026-09-23T08:00:00.000Z',
    updatedAt: '2026-10-18T14:00:00.000Z',
  },
]

let quotationStore: QuotationRecord[] = [
  {
    id: 'quot-200',
    organizationId: 'org-norf',
    number: 'Q-2026-0200',
    opportunityId: 'opp-101',
    accountName: 'Helios Energy',
    ownerUserId: 'user-crm',
    ownerName: 'Amara Diallo',
    status: 'pending_finance',
    currency: 'EUR',
    lines: [
      {
        id: 'ql-1',
        sku: 'INV-CTRL-01',
        description: 'Inverter control package',
        quantity: 4,
        unitPrice: 18500,
      },
      {
        id: 'ql-2',
        sku: 'SVC-COMM',
        description: 'Commissioning services',
        quantity: 1,
        unitPrice: 15000,
      },
    ],
    total: 89000,
    createdAt: '2026-10-18T14:00:00.000Z',
    updatedAt: '2026-10-18T14:00:00.000Z',
    decisions: [
      {
        id: 'wd-1',
        actorId: 'user-crm',
        actorName: 'Amara Diallo',
        action: 'submit',
        comment: 'Converted from opportunity opp-101',
        at: '2026-10-18T14:00:00.000Z',
      },
    ],
  },
]

export function listOpportunities(): OpportunityRecord[] {
  return opportunityStore.map((item) => ({ ...item }))
}

export function getOpportunity(id: string): OpportunityRecord | undefined {
  const found = opportunityStore.find((item) => item.id === id)
  return found ? { ...found } : undefined
}

export function replaceOpportunities(next: OpportunityRecord[]): void {
  opportunityStore = next.map((item) => ({ ...item }))
}

export function listQuotations(): QuotationRecord[] {
  return quotationStore.map((item) => ({
    ...item,
    lines: item.lines.map((line) => ({ ...line })),
    decisions: [...item.decisions],
  }))
}

export function getQuotation(id: string): QuotationRecord | undefined {
  const found = quotationStore.find((item) => item.id === id)
  return found
    ? {
        ...found,
        lines: found.lines.map((line) => ({ ...line })),
        decisions: [...found.decisions],
      }
    : undefined
}

export function replaceQuotations(next: QuotationRecord[]): void {
  quotationStore = next.map((item) => ({
    ...item,
    lines: item.lines.map((line) => ({ ...line })),
    decisions: [...item.decisions],
  }))
}

export function createOpportunityId(): string {
  return `opp-${Date.now()}`
}

export function createQuotationId(): string {
  return `quot-${Date.now()}`
}

export function createDecisionId(): string {
  return `wd-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function nextQuotationNumber(): string {
  return `Q-2026-${String(200 + quotationStore.length + 1).padStart(4, '0')}`
}
