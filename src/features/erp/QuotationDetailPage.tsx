import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  commercialKeys,
  decideQuotation,
  fetchQuotation,
} from '@/api/commercial'
import { ApprovalTimeline } from '@/components/shared/workflow/ApprovalTimeline'
import { WorkflowActions } from '@/components/shared/workflow/WorkflowActions'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  canFinanceApproveQuotation,
  canMarkQuotationSent,
} from '@/features/erp/quotation-rules'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/formatters'
import type { WorkflowActionOption } from '@/types/workflow'

export function QuotationDetailPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: commercialKeys.quotation(id),
    queryFn: () => fetchQuotation(id),
    enabled: Boolean(id),
  })

  const mutation = useMutation({
    mutationFn: ({
      action,
      comment,
    }: {
      action: 'approve' | 'reject' | 'return' | 'send'
      comment?: string
    }) => {
      if (!user) throw new Error('Not signed in')
      return decideQuotation(user, id, action, comment)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: commercialKeys.quotations })
      void queryClient.invalidateQueries({ queryKey: commercialKeys.opportunities })
      toast.success('Quotation updated')
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

  const quotation = query.data
  const actions: WorkflowActionOption[] = []
  if (user && canFinanceApproveQuotation(user, quotation)) {
    actions.push(
      { action: 'approve', label: 'Approve (Finance)' },
      { action: 'reject', label: 'Reject', variant: 'destructive' },
      { action: 'return', label: 'Return to draft', variant: 'ghost' },
    )
  }
  if (user && canMarkQuotationSent(user, quotation)) {
    actions.push({ action: 'send', label: 'Mark sent to customer' })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={quotation.number}
        description={`${quotation.accountName} · ${formatCurrency(quotation.total, quotation.currency)}`}
        actions={
          <StatusBadge variant="warning" dot>
            {quotation.status.replaceAll('_', ' ')}
          </StatusBadge>
        }
      />

      {quotation.opportunityId ? (
        <p className="text-sm text-text-secondary">
          Source opportunity:{' '}
          <Link
            className="text-primary hover:underline"
            to={`/crm/opportunities/${quotation.opportunityId}`}
          >
            {quotation.opportunityId}
          </Link>
        </p>
      ) : null}

      <section className="bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold">Lines</h2>
        <ul className="space-y-2">
          {quotation.lines.map((line) => (
            <li
              key={line.id}
              className="flex items-center justify-between bg-surface-hover px-3 py-2 text-sm"
            >
              <span>
                {line.sku} · {line.description} × {line.quantity}
              </span>
              <span className="tabular-nums">
                {formatCurrency(line.unitPrice * line.quantity, quotation.currency)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold">Approval history</h2>
        <ApprovalTimeline decisions={quotation.decisions} />
      </section>

      <WorkflowActions
        actions={actions}
        disabled={mutation.isPending}
        onAction={(action, comment) =>
          mutation.mutate({
            action: action as 'approve' | 'reject' | 'return' | 'send',
            comment,
          })
        }
      />
    </div>
  )
}
