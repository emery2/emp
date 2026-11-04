import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import {
  entitlementKeys,
  fetchFeatureConfig,
  fetchFeatureConfigAudit,
  fetchTenantFeatures,
  previewFeatureConfig,
  resetFeatureConfig,
  saveFeatureConfig,
} from '@/api/entitlements'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { FEATURE_MANIFESTS } from '@/modules/feature-manifests'
import type { FeatureKey } from '@/modules/feature-keys'
import { can } from '@/shared/policy/can'
import { ACCESS_CONTROL_DISCLAIMER } from '@/types/access'

export function FeatureConfigPage() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const queryClient = useQueryClient()

  const featuresQuery = useQuery({
    queryKey: entitlementKeys.features(tenant.id),
    queryFn: () => fetchTenantFeatures(tenant.id),
  })

  const entitled = featuresQuery.data ?? []
  const [featureKey, setFeatureKey] = useState<FeatureKey | ''>('')
  const activeKey = (featureKey || entitled[0] || '') as FeatureKey | ''

  const configQuery = useQuery({
    queryKey: entitlementKeys.config(tenant.id, activeKey || 'hr.leave'),
    queryFn: () => fetchFeatureConfig(tenant.id, activeKey as FeatureKey),
    enabled: Boolean(activeKey),
  })

  const auditQuery = useQuery({
    queryKey: entitlementKeys.audit(tenant.id, activeKey || 'hr.leave'),
    queryFn: () => fetchFeatureConfigAudit(tenant.id, activeKey as FeatureKey),
    enabled: Boolean(activeKey),
  })

  const [draftJson, setDraftJson] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const sourceJson = useMemo(() => {
    if (draftJson !== null) return draftJson
    if (!configQuery.data) return ''
    return JSON.stringify(configQuery.data.config, null, 2)
  }, [draftJson, configQuery.data])

  const mayConfigure =
    Boolean(activeKey) &&
    can(user, 'configure', 'feature_config', {
      tenantId: tenant.id,
      featureKey: activeKey || undefined,
    })

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !activeKey) throw new Error('Nothing to save')
      const raw = JSON.parse(sourceJson) as unknown
      return saveFeatureConfig(tenant.id, activeKey, raw, user.id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: entitlementKeys.config(tenant.id, activeKey as FeatureKey),
      })
      void queryClient.invalidateQueries({
        queryKey: entitlementKeys.audit(tenant.id, activeKey as FeatureKey),
      })
      setDraftJson(null)
      setPreview(null)
      toast.success('Configuration saved (new version)')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!user || !activeKey) throw new Error('Nothing to reset')
      return resetFeatureConfig(tenant.id, activeKey, user.id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: entitlementKeys.config(tenant.id, activeKey as FeatureKey),
      })
      void queryClient.invalidateQueries({
        queryKey: entitlementKeys.audit(tenant.id, activeKey as FeatureKey),
      })
      setDraftJson(null)
      setPreview(null)
      toast.success('Reset to defaults')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const runPreview = async () => {
    if (!activeKey) return
    try {
      const raw = JSON.parse(sourceJson) as unknown
      const result = await previewFeatureConfig(activeKey, raw)
      setPreview(JSON.stringify(result, null, 2))
      toast.message('Preview valid — not saved yet')
    } catch (error) {
      setPreview(null)
      toast.error(error instanceof Error ? error.message : 'Invalid config')
    }
  }

  if (featuresQuery.isLoading) {
    return <Skeleton className="h-64 w-full max-w-3xl" />
  }
  if (featuresQuery.isError) {
    return (
      <QueryError
        message="Failed to load features"
        onRetry={() => void featuresQuery.refetch()}
      />
    )
  }

  const manifest = activeKey ? FEATURE_MANIFESTS[activeKey] : null

  return (
    <div className="max-w-3xl space-y-4">
      <PageHeader
        title="Feature configuration"
        description="Client options for entitled features. Changes are versioned; in-progress work keeps the config version it started under."
      />
      {entitled.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No features entitled for {tenant.name}. Ask the platform owner to
          enable features first.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="feature-select">
              Feature
            </label>
            <select
              id="feature-select"
              className="h-9 w-full max-w-md bg-surface-hover px-2 text-sm"
              value={activeKey}
              onChange={(event) => {
                setFeatureKey(event.target.value as FeatureKey)
                setDraftJson(null)
                setPreview(null)
              }}
            >
              {entitled.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            {manifest ? (
              <p className="text-xs text-text-muted">{manifest.description}</p>
            ) : null}
          </div>

          {configQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : configQuery.isError ? (
            <QueryError
              message="Failed to load config"
              onRetry={() => void configQuery.refetch()}
            />
          ) : (
            <>
              <p className="text-xs text-text-muted">
                Current version {configQuery.data?.version} · schema v
                {configQuery.data?.schemaVersion} · id {configQuery.data?.id}
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="config-json">
                  Configuration (JSON)
                </label>
                <textarea
                  id="config-json"
                  className="min-h-48 w-full bg-surface-hover p-3 font-mono text-xs focus:outline-none focus:ring-0 focus:border-b-2 focus:border-primary"
                  value={sourceJson}
                  disabled={!mayConfigure}
                  onChange={(event) => setDraftJson(event.target.value)}
                />
              </div>
              {preview ? (
                <div className="space-y-1 bg-surface-hover p-3">
                  <p className="text-overline uppercase text-text-muted">
                    Preview (validated)
                  </p>
                  <pre className="overflow-auto text-xs">{preview}</pre>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  disabled={!mayConfigure}
                  onClick={() => void runPreview()}
                >
                  Preview
                </Button>
                <Button
                  disabled={!mayConfigure || saveMutation.isPending}
                  onClick={() => {
                    if (
                      window.confirm(
                        'Save creates a new config version. In-progress items keep their old version. Continue?',
                      )
                    ) {
                      saveMutation.mutate()
                    }
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  disabled={!mayConfigure || resetMutation.isPending}
                  onClick={() => {
                    if (
                      window.confirm(
                        'Reset to defaults and create a new version?',
                      )
                    ) {
                      resetMutation.mutate()
                    }
                  }}
                >
                  Reset to defaults
                </Button>
                <Button
                  variant="ghost"
                  disabled={draftJson === null}
                  onClick={() => {
                    setDraftJson(null)
                    setPreview(null)
                  }}
                >
                  Discard
                </Button>
              </div>
            </>
          )}

          <section className="space-y-2">
            <h2 className="text-sm font-semibold">Audit log</h2>
            {auditQuery.isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <ul className="space-y-1">
                {(auditQuery.data ?? []).slice(0, 8).map((entry) => (
                  <li
                    key={entry.id}
                    className="bg-surface px-3 py-2 text-xs text-text-secondary"
                  >
                    <span className="font-medium text-text-primary">
                      {entry.action}
                    </span>{' '}
                    — {entry.summary}{' '}
                    <span className="text-text-muted">({entry.at})</span>
                  </li>
                ))}
                {(auditQuery.data ?? []).length === 0 ? (
                  <li className="text-xs text-text-muted">No changes yet.</li>
                ) : null}
              </ul>
            )}
          </section>
        </>
      )}
      <p className="text-[11px] text-text-muted">{ACCESS_CONTROL_DISCLAIMER}</p>
    </div>
  )
}
