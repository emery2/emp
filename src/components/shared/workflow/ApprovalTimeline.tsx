import type { WorkflowDecision } from '@/types/workflow'

export function ApprovalTimeline({
  decisions,
  emptyLabel = 'No decisions recorded yet.',
}: {
  decisions: WorkflowDecision[]
  emptyLabel?: string
}) {
  if (decisions.length === 0) {
    return <p className="text-sm text-text-secondary">{emptyLabel}</p>
  }

  return (
    <ol className="space-y-3">
      {decisions.map((decision) => (
        <li
          key={decision.id}
          className="border-l-2 border-primary pl-3 text-sm"
        >
          <p className="font-medium">
            {String(decision.action).replaceAll('_', ' ')} · {decision.actorName}
          </p>
          <p className="text-xs text-text-muted">
            {new Date(decision.at).toLocaleString()}
          </p>
          {decision.comment ? (
            <p className="mt-1 text-text-secondary">{decision.comment}</p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
