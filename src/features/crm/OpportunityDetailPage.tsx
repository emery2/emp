import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  commercialKeys,
  convertOpportunityToQuotation,
  fetchOpportunity,
} from '@/api/commercial'
import { PermissionGate } from '@/access/guards'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { canConvertOpportunityToQuotation } from '@/features/erp/quotation-rules'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/formatters'

export function OpportunityDetailPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: commercialKeys.opportunity(id),
    queryFn: () => fetchOpportunity(id),
    enabled: Boolean(id),
  })

  const convertMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Not signed in')
      return convertOpportunityToQuotation(user, id)
    },
    onSuccess: (quotation) => {
      void queryClient.invalidateQueries({ queryKey: commercialKeys.opportunities })
      void queryClient.invalidateQueries({ queryKey: commercialKeys.quotations })
      toast.success('Quotation created from opportunity')
      navigate(`/erp/quotations/${quotation.id}`)
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

  const opportunity = query.data
  const canConvert = user
    ? canConvertOpportunityToQuotation(user, opportunity)
    : false

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={opportunity.name}
        description={`${opportunity.accountName} · ${opportunity.contactName}`}
        actions={
          <StatusBadge variant="info" dot>
            {opportunity.stage}
          </StatusBadge>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">Amount</p>
          <p className="text-sm font-medium">
            {formatCurrency(opportunity.amount, opportunity.currency)}
          </p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">Owner</p>
          <p className="text-sm font-medium">{opportunity.ownerName}</p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">Expected close</p>
          <p className="text-sm font-medium">{opportunity.expectedCloseDate}</p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">ERP quotation</p>
          <p className="text-sm font-medium">
            {opportunity.quotationId ? (
              <Link
                className="text-primary hover:underline"
                to={`/erp/quotations/${opportunity.quotationId}`}
              >
                {opportunity.quotationId}
              </Link>
            ) : (
              'Not converted'
            )}
          </p>
        </div>
      </div>

      <PermissionGate permission="erp.quotations.manage">
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={!canConvert || convertMutation.isPending}
            onClick={() => convertMutation.mutate()}
          >
            {convertMutation.isPending
              ? 'Converting…'
              : 'Convert to ERP quotation'}
          </Button>
          {!canConvert && opportunity.quotationId ? (
            <Button variant="ghost" asChild>
              <Link to={`/erp/quotations/${opportunity.quotationId}`}>
                Open quotation
              </Link>
            </Button>
          ) : null}
        </div>
      </PermissionGate>
    </div>
  )
}
