import { PermissionGate } from '@/access/guards'
import type { Permission } from '@/access/permissions'

/**
 * @deprecated Prefer PermissionGate. Kept as a thin adapter for legacy call sites.
 */
export function RoleGate({
  permissions,
  mode = 'hide',
  tooltip = 'You do not have permission for this action',
  fallback = null,
  children,
}: {
  /** Legacy `roles` prop ignored — pass permissions instead. */
  roles?: string[]
  permissions?: Permission[]
  feature?: string
  mode?: 'hide' | 'disable'
  tooltip?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}) {
  if (!permissions?.length) return <>{fallback}</>
  return (
    <PermissionGate
      permissions={permissions}
      mode={mode}
      tooltip={tooltip}
      fallback={fallback}
    >
      {children}
    </PermissionGate>
  )
}
