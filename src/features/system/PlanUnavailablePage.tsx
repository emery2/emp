import { PackageX } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { MODULE_DEFINITIONS, type ModuleId } from '@/access/modules'
import { FEATURE_MANIFESTS } from '@/modules/feature-manifests'
import type { FeatureKey } from '@/modules/feature-keys'
import { Button } from '@/components/ui/button'
import { ACCESS_CONTROL_DISCLAIMER } from '@/types/access'

interface PlanState {
  kind?: 'module' | 'feature'
  id?: string
  from?: string
}

export function PlanUnavailablePage() {
  const location = useLocation()
  const state = (location.state as PlanState | null) ?? {}

  let title = 'Not available on your plan'
  let detail =
    'This capability is not included in your organization’s current entitlements.'

  if (state.kind === 'module' && state.id) {
    const def = MODULE_DEFINITIONS[state.id as ModuleId]
    title = `${def?.label ?? state.id} is not on your plan`
    detail = def
      ? `${def.description}. Ask your platform owner to enable this service.`
      : detail
  }

  if (state.kind === 'feature' && state.id) {
    const manifest = FEATURE_MANIFESTS[state.id as FeatureKey]
    title = 'Feature not available on your plan'
    detail = manifest
      ? `${manifest.description}. Enable it under Feature entitlements (owner) or ask your administrator.`
      : detail
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 py-16">
      <PackageX className="h-10 w-10 text-warning" strokeWidth={1.5} />
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
        <p className="mt-2 text-sm text-text-secondary">{detail}</p>
        {state.from ? (
          <p className="mt-2 text-xs text-text-muted">Requested: {state.from}</p>
        ) : null}
        <p className="mt-3 text-[11px] text-text-muted">
          {ACCESS_CONTROL_DISCLAIMER}
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/app">Go to dashboard</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/settings/modules">View modules</Link>
        </Button>
      </div>
    </div>
  )
}
