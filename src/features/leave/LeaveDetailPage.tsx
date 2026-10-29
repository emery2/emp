import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  decideLeaveRequest,
  fetchLeaveRequest,
  leaveKeys,
} from '@/api/leave'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { ApprovalTimeline } from '@/components/shared/workflow/ApprovalTimeline'
import { WorkflowActions } from '@/components/shared/workflow/WorkflowActions'
import { LeaveStatusBadge } from '@/features/leave/leave-status'
import { Skeleton } from '@/components/ui/skeleton'
import {
  canHrAct,
  canManagerAct,
  isTerminalStatus,
} from '@/features/leave/leave-rules'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { getDepartmentName } from '@/mocks/organization'
import type { LeaveDecisionAction } from '@/types/leave'
import type { WorkflowActionOption } from '@/types/workflow'

export function LeaveDetailPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: leaveKeys.detail(id),
    queryFn: () => fetchLeaveRequest(id),
    enabled: Boolean(id),
  })

  const mutation = useMutation({
    mutationFn: ({
      action,
      comment,
    }: {
      action: LeaveDecisionAction
      comment?: string
    }) => {
      if (!user) throw new Error('Not signed in')
      return decideLeaveRequest(user, id, action, comment)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leaveKeys.all })
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
  const managerCanAct = user ? canManagerAct(user, request) : false
  const hrCanAct = user ? canHrAct(user, request) : false

  const actions: WorkflowActionOption[] = []
  if (!isTerminalStatus(request.status)) {
    if (managerCanAct) {
      actions.push(
        { action: 'manager_approve', label: 'Approve' },
        { action: 'manager_reject', label: 'Reject', variant: 'destructive' },
        { action: 'return', label: 'Return', variant: 'ghost' },
      )
    }
    if (hrCanAct) {
      actions.push(
        { action: 'hr_verify', label: 'Verify (HR)' },
        { action: 'hr_reject', label: 'Reject (HR)', variant: 'destructive' },
      )
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={`Leave · ${request.requesterName}`}
        description={`${request.type} · ${request.startDate} → ${request.endDate} (${request.days} days)`}
        actions={<LeaveStatusBadge status={request.status} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">Department</p>
          <p className="text-sm font-medium">
            {getDepartmentName(request.departmentId)}
          </p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">Reason</p>
          <p className="text-sm font-medium">
            {request.reason || 'No reason provided'}
          </p>
        </div>
      </div>

      <section className="bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold">Status timeline</h2>
        <ApprovalTimeline decisions={request.decisions} />
      </section>

      <WorkflowActions
        actions={actions}
        disabled={mutation.isPending}
        onAction={(action, comment) =>
          mutation.mutate({
            action: action as LeaveDecisionAction,
            comment,
          })
        }
      />

      <div className="flex gap-2">
        <Button variant="ghost" asChild>
          <Link to="/leave/mine">My leave</Link>
        </Button>
        {managerCanAct || user?.roleIds.includes('head_of_department') ? (
          <Button variant="ghost" asChild>
            <Link to="/leave/manager">Manager queue</Link>
          </Button>
        ) : null}
        {hrCanAct || user?.roleIds.includes('hr_officer') ? (
          <Button variant="ghost" asChild>
            <Link to="/leave/hr">HR queue</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
