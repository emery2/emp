import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { FeatureKey } from '@/modules/feature-keys'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { mockEntitlementsRepository } from '@/shared/repositories/entitlements-repository'

/** Feature entitlement gate — disabled features show the plan-unavailable screen. */
export function RequireFeature({ featureKey }: { featureKey: FeatureKey }) {
  const { isAuthenticated } = useAuth()
  const { tenant } = useTenant()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (
    !mockEntitlementsRepository.isFeatureEffectivelyEnabled(
      tenant.id,
      featureKey,
    )
  ) {
    return (
      <Navigate
        to="/plan-unavailable"
        replace
        state={{ kind: 'feature', id: featureKey, from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
