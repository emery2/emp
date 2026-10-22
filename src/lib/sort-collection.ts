import type { SortDirection, SortState } from '@/types/views'

function readValue(item: unknown, field: string): unknown {
  if (item == null || typeof item !== 'object') return undefined
  const record = item as Record<string, unknown>
  if (field.includes('.')) {
    return field.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, item)
  }
  return record[field]
}

export function sortCollection<T>(
  items: T[],
  sort: SortState,
  accessors?: Record<string, (item: T) => string | number | Date | null | undefined>,
): T[] {
  const get =
    accessors?.[sort.field] ??
    ((item: T) => readValue(item, sort.field) as string | number | Date | null | undefined)

  const direction: SortDirection = sort.direction
  const factor = direction === 'asc' ? 1 : -1

  return [...items].sort((a, b) => {
    const av = get(a)
    const bv = get(b)
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * factor
    }
    const as = av instanceof Date ? av.getTime() : String(av).toLowerCase()
    const bs = bv instanceof Date ? bv.getTime() : String(bv).toLowerCase()
    if (typeof as === 'number' && typeof bs === 'number') {
      return (as - bs) * factor
    }
    return String(as).localeCompare(String(bs)) * factor
  })
}
