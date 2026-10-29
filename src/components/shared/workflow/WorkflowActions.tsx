import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WorkflowActionOption, WorkflowDecisionAction } from '@/types/workflow'

export function WorkflowActions({
  actions,
  disabled,
  onAction,
  commentLabel = 'Comment',
}: {
  actions: WorkflowActionOption[]
  disabled?: boolean
  onAction: (action: WorkflowDecisionAction, comment?: string) => void
  commentLabel?: string
}) {
  const [comment, setComment] = useState('')

  if (actions.length === 0) return null

  return (
    <section className="space-y-3 bg-surface p-4">
      <h2 className="text-sm font-semibold">Decision</h2>
      <div className="space-y-2">
        <Label htmlFor="workflow-comment">{commentLabel}</Label>
        <Input
          id="workflow-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Optional comment for the audit trail"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((item) => (
          <Button
            key={item.action}
            variant={item.variant ?? 'default'}
            disabled={disabled}
            onClick={() => {
              onAction(item.action, comment || undefined)
              setComment('')
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </section>
  )
}
