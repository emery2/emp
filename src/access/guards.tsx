import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Permission } from '@/access/permissions'
import { hasAnyPermission, hasPermission } from '@/access/evaluate'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/useAuth'

export function RequirePermission({
  permission,
  permissions,
}: {
  permission?: Permission
  permissions?: Permission[]
}) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const allowed = permission
    ? hasPermission(user, permission)
    : hasAnyPermission(user, permissions ?? [])

  if (!allowed) {
    return <Navigate to="/access-denied" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function PermissionGate({
  permission,
  permissions,
  mode = 'hide',
  tooltip = 'You do not have permission for this action',
  fallback = null,
  children,
}: {
  permission?: Permission
  permissions?: Permission[]
  mode?: 'hide' | 'disable'
  tooltip?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const allowed = permission
    ? hasPermission(user, permission)
    : hasAnyPermission(user, permissions ?? [])

  if (allowed) return <>{children}</>
  if (mode === 'hide') return <>{fallback}</>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-not-allowed opacity-50">
          <span className="pointer-events-none">{children}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
