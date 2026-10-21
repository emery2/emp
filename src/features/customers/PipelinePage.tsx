import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Kanban } from 'lucide-react'
import { toast } from 'sonner'
import { crmKeys, fetchPipeline, moveDeal } from '@/api/crm'
import { KanbanBoard } from '@/components/shared/KanbanBoard'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'

export function PipelinePage() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: crmKeys.pipeline,
    queryFn: fetchPipeline,
  })

  const moveMutation = useMutation({
    mutationFn: ({ dealId, stageId }: { dealId: string; stageId: string }) =>
      moveDeal(dealId, stageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: crmKeys.pipeline })
      toast.success('Deal moved')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Configurable sales stages. Drag deals between columns."
        actions={
          <Button onClick={() => toast.message('Add deal coming soon')}>
            Add deal
          </Button>
        }
      />
      <KanbanBoard
        columns={query.data?.stages ?? []}
        cards={(query.data?.deals ?? []).map((deal) => ({
          id: deal.id,
          columnId: deal.stageId,
          title: deal.title,
          subtitle: `${deal.company} · ${deal.ownerName}`,
          value: deal.value,
          status: deal.status,
        }))}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={() => void query.refetch()}
        onCardMove={(cardId, _from, to) =>
          moveMutation.mutate({ dealId: cardId, stageId: to })
        }
        empty={{
          icon: Kanban,
          title: 'Pipeline is empty',
          description: 'Add deals or move leads into stages.',
          primaryAction: {
            label: 'Add deal',
            onClick: () => toast.message('Add deal coming soon'),
          },
        }}
      />
    </div>
  )
}
