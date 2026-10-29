import { CUSTOM_ROLES } from '@/access/custom-roles'
import type { Permission } from '@/access/permissions'
import { ROLE_DEFINITIONS, type RoleId } from '@/access/roles'
import type { AppUser, DataScope } from '@/types/access'

export function resolvePermissions(user: AppUser): Set<Permission> {
  const granted = new Set<Permission>()

  for (const roleId of user.roleIds) {
    const base = ROLE_DEFINITIONS[roleId as RoleId]
    if (base) {
      for (const permission of base.permissions) granted.add(permission)
    }
    const custom = CUSTOM_ROLES[roleId]
    if (custom) {
      for (const permission of custom.permissions) granted.add(permission)
    }
  }

  for (const permission of user.permissionOverrides?.grant ?? []) {
    granted.add(permission)
  }
  for (const permission of user.permissionOverrides?.deny ?? []) {
    granted.delete(permission)
  }

  return granted
}

export function hasPermission(user: AppUser | null, permission: Permission): boolean {
  if (!user || !user.isActive) return false
  return resolvePermissions(user).has(permission)
}

export function hasAnyPermission(
  user: AppUser | null,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(user, permission))
}

export function hasAllPermissions(
  user: AppUser | null,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(user, permission))
}

export function getDataScope(user: AppUser): DataScope {
  const permissions = resolvePermissions(user)
  if (
    permissions.has('dashboard.board.view') ||
    permissions.has('dashboard.executive.view') ||
    permissions.has('dashboard.admin.view') ||
    permissions.has('leave.verify.hr') ||
    permissions.has('access.roles.manage')
  ) {
    return {
      organizationId: user.organizationId,
      departmentId: user.departmentId,
      managerId: user.managerId,
      scope: 'org',
    }
  }
  if (permissions.has('leave.approve.department') || permissions.has('dashboard.manager.view')) {
    return {
      organizationId: user.organizationId,
      departmentId: user.departmentId,
      managerId: user.managerId,
      scope: 'department',
    }
  }
  return {
    organizationId: user.organizationId,
    departmentId: user.departmentId,
    managerId: user.managerId,
    scope: 'self',
  }
}

export function primaryDashboardPath(user: AppUser): string {
  const permissions = resolvePermissions(user)
  if (permissions.has('dashboard.board.view')) return '/app/board'
  if (permissions.has('dashboard.executive.view')) return '/app/executive'
  if (permissions.has('dashboard.admin.view')) return '/app/admin'
  if (permissions.has('dashboard.hr.view')) return '/app/hr'
  if (permissions.has('dashboard.finance.view')) return '/app/finance'
  if (permissions.has('dashboard.operations.view')) return '/app/operations'
  if (permissions.has('dashboard.manager.view')) return '/app/manager'
  return '/app/employee'
}
