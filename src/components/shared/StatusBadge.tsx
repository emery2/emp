import { cn } from '@/lib/cn'
import type { StatusBadgeVariant } from '@/types'

const variantClasses: Record<StatusBadgeVariant, string> = {
  success: 'bg-success-subtle text-success',
  warning: 'bg-warning-subtle text-warning',
  danger: 'bg-danger-subtle text-danger',
  info: 'bg-info-subtle text-info',
  neutral: 'bg-surface-hover text-text-secondary',
}

const dotClasses: Record<StatusBadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  neutral: 'bg-text-muted',
}

export interface StatusBadgeProps {
  variant: StatusBadgeVariant
  children: React.ReactNode
  dot?: boolean
  className?: string
}

export function StatusBadge({
  variant,
  children,
  dot = false,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {dot ? (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  )
}
