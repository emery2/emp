import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ModuleId } from '@/access/modules'
import { isModuleEnabled } from '@/mocks/modules'
import { useAuth } from '@/hooks/useAuth'

/** Soft module gate — org must enable the module. Permissions still apply separately. */
export function RequireModule({ moduleId }: { moduleId: ModuleId }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!isModuleEnabled(moduleId)) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ from: `${location.pathname} (module ${moduleId} disabled)` }}
      />
    )
  }

  return <Outlet />
}
