import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <Icon
        className="h-10 w-10 text-text-muted"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="max-w-sm space-y-1">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description ? (
          <p className="text-sm text-text-secondary">{description}</p>
        ) : null}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="mt-2 flex items-center gap-2">
          {secondaryAction ? (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          ) : null}
          {primaryAction ? (
            <Button onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
