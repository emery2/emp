import type { WorkflowDecision } from '@/types/workflow'

export type OpportunityStage =
  | 'qualify'
  | 'propose'
  | 'negotiate'
  | 'won'
  | 'lost'

export type QuotationStatus =
  | 'draft'
  | 'pending_finance'
  | 'approved'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'cancelled'

export interface OpportunityRecord {
  id: string
  organizationId: string
  name: string
  accountName: string
  contactName: string
  ownerUserId: string
  ownerName: string
  stage: OpportunityStage
  amount: number
  currency: string
  expectedCloseDate: string
  leadId?: string
  quotationId?: string
  createdAt: string
  updatedAt: string
}

export interface QuotationLine {
  id: string
  sku: string
  description: string
  quantity: number
  unitPrice: number
}

export interface QuotationRecord {
  id: string
  organizationId: string
  number: string
  opportunityId?: string
  accountName: string
  ownerUserId: string
  ownerName: string
  status: QuotationStatus
  currency: string
  lines: QuotationLine[]
  total: number
  createdAt: string
  updatedAt: string
  decisions: WorkflowDecision[]
}
