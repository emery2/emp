export type WorkflowDecisionAction =
  | 'submit'
  | 'approve'
  | 'reject'
  | 'return'
  | 'verify'
  | 'cancel'
  | string

export interface WorkflowDecision {
  id: string
  actorId: string
  actorName: string
  action: WorkflowDecisionAction
  comment?: string
  at: string
}

export interface WorkflowActionOption {
  action: WorkflowDecisionAction
  label: string
  variant?: 'default' | 'destructive' | 'ghost'
}
