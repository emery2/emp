import { AlertCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'

export function QueryError({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <Alert variant="destructive">
      <AlertTitle className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        {title}
      </AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <span>{message ?? 'Please try again.'}</span>
        {onRetry ? (
          <div>
            <Button variant="ghost" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        ) : null}
      </AlertDescription>
    </Alert>
  )
}

export function ListEmpty({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      primaryAction={
        actionLabel && onAction
          ? { label: actionLabel, onClick: onAction }
          : undefined
      }
    />
  )
}
