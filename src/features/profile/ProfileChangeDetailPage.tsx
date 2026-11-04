import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  decideProfileChange,
  fetchProfileRequest,
  profileKeys,
} from '@/api/profile'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { ApprovalTimeline } from '@/components/shared/workflow/ApprovalTimeline'
import { WorkflowActions } from '@/components/shared/workflow/WorkflowActions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  canHrDecideProfileChange,
  canWithdrawProfileChange,
} from '@/features/profile/profile-rules'
import { ProfileChangeStatusBadge } from '@/features/profile/profile-status'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { PROFILE_FIELD_LABELS } from '@/types/profile'
import type { WorkflowActionOption } from '@/types/workflow'

export function ProfileChangeDetailPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const { tenant } = useTenant()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: profileKeys.request(tenant.id, id),
    queryFn: () => fetchProfileRequest(tenant.id, id, user!),
    enabled: Boolean(id && user),
  })

  const mutation = useMutation({
    mutationFn: ({
      action,
      comment,
    }: {
      action: 'approve' | 'reject' | 'return' | 'withdraw'
      comment?: string
    }) => {
      if (!user) throw new Error('Not signed in')
      return decideProfileChange(tenant.id, user, id, action, comment)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all })
      toast.success('Decision recorded')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  if (query.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <QueryError
        message={query.error instanceof Error ? query.error.message : undefined}
        onRetry={() => void query.refetch()}
      />
    )
  }

  const request = query.data
  const hrCan = user ? canHrDecideProfileChange(user, request) : false
  const canWithdraw = user ? canWithdrawProfileChange(user, request) : false

  const actions: WorkflowActionOption[] = []
  if (hrCan) {
    actions.push(
      { action: 'approve', label: 'Approve' },
      { action: 'return', label: 'Return for info', variant: 'ghost' },
      { action: 'reject', label: 'Reject', variant: 'destructive' },
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Profile change request"
        description={request.requesterName}
        actions={<ProfileChangeStatusBadge status={request.status} />}
      />
      <p className="text-xs text-text-muted">
        Config version: {request.configVersionId} (rules frozen at submit)
      </p>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Current vs proposed</h2>
        <ul className="space-y-2">
          {request.fieldChanges.map((change) => (
            <li key={change.field} className="bg-surface px-3 py-3 text-sm">
              <p className="font-medium">
                {PROFILE_FIELD_LABELS[change.field]}
              </p>
              <div className="mt-1 grid gap-2 sm:grid-cols-2">
                <p className="text-text-secondary">
                  <span className="text-overline uppercase text-text-muted">
                    Current
                  </span>
                  <br />
                  {change.fromValue || '—'}
                </p>
                <p className="text-text-secondary">
                  <span className="text-overline uppercase text-text-muted">
                    Proposed
                  </span>
                  <br />
                  {change.toValue || '—'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {request.attachments.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold">Attachments</h2>
          <ul className="text-sm text-text-secondary">
            {request.attachments.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold">Audit trail</h2>
        <ApprovalTimeline decisions={request.decisions} />
      </section>

      <WorkflowActions
        actions={actions}
        disabled={mutation.isPending}
        onAction={(action, comment) => {
          if (
            (action === 'reject' || action === 'return') &&
            !comment?.trim()
          ) {
            toast.error('A reason is required')
            return
          }
          if (
            window.confirm(
              `Confirm ${String(action)} for this profile change request?`,
            )
          ) {
            mutation.mutate({
              action: action as 'approve' | 'reject' | 'return',
              comment,
            })
          }
        }}
      />

      {canWithdraw ? (
        <Button
          variant="ghost"
          disabled={mutation.isPending}
          onClick={() => {
            if (window.confirm('Withdraw this pending request?')) {
              mutation.mutate({ action: 'withdraw' })
            }
          }}
        >
          Withdraw request
        </Button>
      ) : null}

      <Button variant="ghost" asChild>
        <Link to={hrCan ? '/profile/hr-queue' : '/profile'}>Back</Link>
      </Button>
    </div>
  )
}
