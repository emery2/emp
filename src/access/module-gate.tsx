import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ModuleId } from '@/access/modules'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { mockEntitlementsRepository } from '@/shared/repositories/entitlements-repository'

/** Soft module gate — tenant must entitle the module. Permissions still apply separately. */
export function RequireModule({ moduleId }: { moduleId: ModuleId }) {
  const { isAuthenticated } = useAuth()
  const { tenant } = useTenant()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!mockEntitlementsRepository.isModuleEnabled(tenant.id, moduleId)) {
    return (
      <Navigate
        to="/plan-unavailable"
        replace
        state={{ kind: 'module', id: moduleId, from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
