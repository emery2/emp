/**
 * Optional EPM link. Present only when the EPM module is entitled.
 * HR goals/evaluations may reference this without importing the EPM feature folder.
 */
export interface EpmObjectiveRef {
  objectiveId: string
  scope: 'company' | 'department'
  label: string
}
