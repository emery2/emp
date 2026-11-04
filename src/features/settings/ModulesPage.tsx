import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  entitlementKeys,
  fetchTenantModules,
  updateTenantModules,
} from '@/api/entitlements'
import { MODULE_DEFINITIONS, MODULE_IDS, type ModuleId } from '@/access/modules'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { can } from '@/shared/policy/can'
import { ACCESS_CONTROL_DISCLAIMER } from '@/types/access'

export function ModulesPage() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: entitlementKeys.modules(tenant.id),
    queryFn: () => fetchTenantModules(tenant.id),
  })
  const [draft, setDraft] = useState<ModuleId[] | null>(null)
  const selected = draft ?? query.data ?? []

  const mayEntitle = can(user, 'entitle', 'module', { tenantId: tenant.id })

  const mutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Not signed in')
      return updateTenantModules(tenant.id, selected, user.id)
    },
    onSuccess: (next) => {
      queryClient.setQueryData(entitlementKeys.modules(tenant.id), next)
      void queryClient.invalidateQueries({
        queryKey: entitlementKeys.features(tenant.id),
      })
      setDraft(null)
      toast.success(`Modules updated for ${tenant.name}`)
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
        description={`Enable or disable services for ${tenant.name}. Nav, routes, and can() respect these flags.`}
      />
      <ul className="space-y-3">
        {MODULE_IDS.map((moduleId) => {
          const def = MODULE_DEFINITIONS[moduleId]
          const checked = selected.includes(moduleId)
          return (
            <li
              key={moduleId}
              className="flex items-start gap-3 bg-surface px-3 py-3"
            >
              <Checkbox
                checked={checked}
                disabled={!mayEntitle}
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
      <div className="flex gap-2">
        <Button
          disabled={!mayEntitle || !draft || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          Save
        </Button>
        <Button
          variant="ghost"
          disabled={!draft}
          onClick={() => setDraft(null)}
        >
          Discard
        </Button>
      </div>
      <p className="text-[11px] text-text-muted">{ACCESS_CONTROL_DISCLAIMER}</p>
    </div>
  )
}
