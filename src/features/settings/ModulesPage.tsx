import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  fetchEnabledModules,
  moduleKeys,
  updateEnabledModules,
} from '@/api/modules'
import { MODULE_DEFINITIONS, MODULE_IDS, type ModuleId } from '@/access/modules'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { ACCESS_CONTROL_DISCLAIMER } from '@/types/access'

export function ModulesPage() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: moduleKeys.enabled,
    queryFn: fetchEnabledModules,
  })
  const [draft, setDraft] = useState<ModuleId[] | null>(null)
  const selected = draft ?? query.data ?? []

  const mutation = useMutation({
    mutationFn: () => updateEnabledModules(selected),
    onSuccess: (next) => {
      queryClient.setQueryData(moduleKeys.enabled, next)
      setDraft(null)
      toast.success('Enabled modules updated')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  if (query.isLoading) return <Skeleton className="h-64 w-full max-w-2xl" />
  if (query.isError) {
    return (
      <QueryError
        message={query.error instanceof Error ? query.error.message : undefined}
        onRetry={() => void query.refetch()}
      />
    )
  }

  const toggle = (moduleId: ModuleId, checked: boolean) => {
    setDraft((current) => {
      const base = current ?? query.data ?? []
      return checked
        ? [...new Set([...base, moduleId])]
        : base.filter((id) => id !== moduleId)
    })
  }

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader
        title="Modules"
        description="Enable or disable product modules for this organization. Nav and routes respect these flags."
      />
      <ul className="space-y-2 bg-surface p-4">
        {MODULE_IDS.map((moduleId) => {
          const def = MODULE_DEFINITIONS[moduleId]
          const checked = selected.includes(moduleId)
          return (
            <li
              key={moduleId}
              className="flex items-start gap-3 bg-surface-hover px-3 py-3"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(value) => toggle(moduleId, Boolean(value))}
                aria-label={def.label}
              />
              <div>
                <p className="text-sm font-medium">{def.label}</p>
                <p className="text-xs text-text-muted">{def.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="text-[11px] text-text-muted">{ACCESS_CONTROL_DISCLAIMER}</p>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          type="button"
          onClick={() => setDraft(null)}
          disabled={!draft}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={mutation.isPending || !draft}
          onClick={() => mutation.mutate()}
        >
          Save modules
        </Button>
      </div>
    </div>
  )
}
