import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import {
  entitlementKeys,
  fetchTenantFeatures,
  fetchTenantModules,
  updateTenantFeatures,
} from '@/api/entitlements'
import { MODULE_DEFINITIONS } from '@/access/modules'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { listFeatureManifests } from '@/modules/feature-manifests'
import type { FeatureKey } from '@/modules/feature-keys'
import { tenants } from '@/mocks/tenants'
import { can } from '@/shared/policy/can'
import { ACCESS_CONTROL_DISCLAIMER } from '@/types/access'

/** Owner layer: Super Admin toggles features per tenant. */
export function FeatureEntitlementsPage() {
  const { user } = useAuth()
  const { tenant, setTenantId } = useTenant()
  const [targetTenantId, setTargetTenantId] = useState(tenant.id)
  const queryClient = useQueryClient()

  const modulesQuery = useQuery({
    queryKey: entitlementKeys.modules(targetTenantId),
    queryFn: () => fetchTenantModules(targetTenantId),
  })
  const featuresQuery = useQuery({
    queryKey: entitlementKeys.features(targetTenantId),
    queryFn: () => fetchTenantFeatures(targetTenantId),
  })

  const [draft, setDraft] = useState<FeatureKey[] | null>(null)
  const selected = draft ?? featuresQuery.data ?? []

  const mayEntitle = can(user, 'entitle', 'feature', {
    tenantId: targetTenantId,
  })

  const manifests = useMemo(() => listFeatureManifests(), [])

  const mutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Not signed in')
      return updateTenantFeatures(targetTenantId, selected, user.id)
    },
    onSuccess: (next) => {
      queryClient.setQueryData(entitlementKeys.features(targetTenantId), next)
      setDraft(null)
      toast.success('Feature entitlements updated')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  if (modulesQuery.isLoading || featuresQuery.isLoading) {
    return <Skeleton className="h-64 w-full max-w-2xl" />
  }
  if (modulesQuery.isError || featuresQuery.isError) {
    return (
      <QueryError
        message="Failed to load entitlements"
        onRetry={() => {
          void modulesQuery.refetch()
          void featuresQuery.refetch()
        }}
      />
    )
  }

  const enabledModules = modulesQuery.data ?? []

  const toggle = (key: FeatureKey, checked: boolean) => {
    setDraft((current) => {
      const base = current ?? featuresQuery.data ?? []
      return checked
        ? [...new Set([...base, key])]
        : base.filter((id) => id !== key)
    })
  }

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader
        title="Feature entitlements"
        description="Platform owner: choose which features each tenant may use. Client configuration is separate."
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-text-secondary" htmlFor="entitle-tenant">
          Tenant
        </label>
        <select
          id="entitle-tenant"
          className="h-9 min-w-[14rem] bg-surface-hover px-2 text-sm"
          value={targetTenantId}
          onChange={(event) => {
            const id = event.target.value
            setTargetTenantId(id)
            setDraft(null)
            setTenantId(id)
          }}
        >
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <ul className="space-y-3">
        {manifests.map((manifest) => {
          const serviceOn = enabledModules.includes(manifest.owningService)
          const checked = selected.includes(manifest.key)
          return (
            <li
              key={manifest.key}
              className="flex items-start gap-3 bg-surface px-3 py-3"
            >
              <Checkbox
                checked={checked}
                disabled={!mayEntitle || !serviceOn}
                onCheckedChange={(value) =>
                  toggle(manifest.key, Boolean(value))
                }
                aria-label={manifest.key}
              />
              <div>
                <p className="text-sm font-medium">{manifest.key}</p>
                <p className="text-xs text-text-muted">{manifest.description}</p>
                <p className="mt-1 text-[11px] text-text-muted">
                  Service: {MODULE_DEFINITIONS[manifest.owningService].label}
                  {!serviceOn ? ' (service off — enable module first)' : ''}
                </p>
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
          Save entitlements
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
