import { describe, expect, it } from 'vitest'
import {
  assertOpportunityConversion,
  canConvertOpportunityToQuotation,
  canFinanceApproveQuotation,
} from '@/features/erp/quotation-rules'
import { findUserById } from '@/mocks/users'
import type { OpportunityRecord, QuotationRecord } from '@/types/commercial'

const opportunity: OpportunityRecord = {
  id: 'opp-t',
  organizationId: 'org-norf',
  name: 'Test deal',
  accountName: 'Acme',
  contactName: 'Pat',
  ownerUserId: 'user-sales',
  ownerName: 'Elena Rossi',
  stage: 'qualify',
  amount: 10000,
  currency: 'EUR',
  expectedCloseDate: '2026-12-01',
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
}

const pendingQuote: QuotationRecord = {
  id: 'quot-t',
  organizationId: 'org-norf',
  number: 'Q-TEST',
  opportunityId: 'opp-t',
  accountName: 'Acme',
  ownerUserId: 'user-sales',
  ownerName: 'Elena Rossi',
  status: 'pending_finance',
  currency: 'EUR',
  lines: [],
  total: 10000,
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
  decisions: [],
}

describe('quotation rules', () => {
  it('allows sales to convert open opportunities without an existing quote', () => {
    const sales = findUserById('user-sales')!
    expect(canConvertOpportunityToQuotation(sales, opportunity)).toBe(true)
  })

  it('blocks conversion when quotation already exists', () => {
    const sales = findUserById('user-sales')!
    expect(
      canConvertOpportunityToQuotation(sales, {
        ...opportunity,
        quotationId: 'quot-existing',
      }),
    ).toBe(false)
  })

  it('blocks employees without quotation manage permission', () => {
    const employee = findUserById('user-employee')!
    expect(canConvertOpportunityToQuotation(employee, opportunity)).toBe(false)
    expect(() => assertOpportunityConversion(employee, opportunity)).toThrow(
      /Not allowed/,
    )
  })

  it('allows finance to approve pending quotations only', () => {
    const finance = findUserById('user-finance')!
    expect(canFinanceApproveQuotation(finance, pendingQuote)).toBe(true)
    expect(
      canFinanceApproveQuotation(finance, {
        ...pendingQuote,
        status: 'approved',
      }),
    ).toBe(false)
  })

  it('does not let sales finance-approve without finance permissions', () => {
    const sales = findUserById('user-sales')!
    expect(canFinanceApproveQuotation(sales, pendingQuote)).toBe(false)
  })
})
