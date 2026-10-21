import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: string): string {
  return format(parseISO(value), 'MMM d, yyyy')
}

export function formatRelative(value: string): string {
  return formatDistanceToNow(parseISO(value), { addSuffix: true })
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}
