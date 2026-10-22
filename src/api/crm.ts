import { delay } from '@/mocks/delay'
import { contacts, deals, leads, pipelineStages } from '@/mocks/crm'
import type { Contact, Deal, Lead, PaginatedResult, PipelineStage } from '@/types'

export const crmKeys = {
  leads: (q: string) => ['leads', q] as const,
  contacts: (q: string) => ['contacts', q] as const,
  contact: (id: string) => ['contacts', 'detail', id] as const,
  pipeline: ['pipeline'] as const,
}

export async function fetchLeads(params: {
  q?: string
  status?: Lead['status'] | 'all'
  page?: number
  pageSize?: number
}): Promise<PaginatedResult<Lead>> {
  await delay()
  const q = (params.q ?? '').toLowerCase()
  const filtered = leads.filter((lead) => {
    if (params.status && params.status !== 'all' && lead.status !== params.status) {
      return false
    }
    if (!q) return true
    return `${lead.name} ${lead.company} ${lead.email} ${lead.status}`
      .toLowerCase()
      .includes(q)
  })
  const page = params.page ?? 0
  const pageSize = params.pageSize ?? 25
  const start = page * pageSize
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  }
}

export async function fetchContacts(params: {
  q?: string
  status?: Contact['status'] | 'all'
}): Promise<Contact[]> {
  await delay()
  const q = (params.q ?? '').toLowerCase()
  return contacts.filter((c) => {
    if (params.status && params.status !== 'all' && c.status !== params.status) {
      return false
    }
    if (!q) return true
    return `${c.firstName} ${c.lastName} ${c.company} ${c.email}`
      .toLowerCase()
      .includes(q)
  })
}

export async function fetchContact(id: string): Promise<Contact> {
  await delay()
  const contact = contacts.find((c) => c.id === id)
  if (!contact) throw new Error('Contact not found')
  return contact
}

export async function fetchPipeline(): Promise<{
  stages: PipelineStage[]
  deals: Deal[]
}> {
  await delay()
  return { stages: pipelineStages, deals: [...deals] }
}

export async function moveDeal(
  dealId: string,
  stageId: string,
): Promise<Deal> {
  await delay(200)
  const deal = deals.find((d) => d.id === dealId)
  if (!deal) throw new Error('Deal not found')
  deal.stageId = stageId
  return { ...deal }
}
