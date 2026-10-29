import type { Permission } from '@/access/permissions'
import type { RoleId } from '@/access/roles'

export type DataScopeLevel = 'org' | 'department' | 'self'

export interface DataScope {
  organizationId: string
  departmentId: string
  managerId?: string
  scope: DataScopeLevel
}

export interface PermissionOverrides {
  grant?: Permission[]
  deny?: Permission[]
}

export interface AppUser {
  id: string
  email: string
  firstName: string
  lastName: string
  title: string
  organizationId: string
  departmentId: string
  managerId?: string
  roleIds: Array<RoleId | string>
  isActive: boolean
  permissionOverrides?: PermissionOverrides
  requiresSuperiorApproval?: boolean
}

export interface Organization {
  id: string
  name: string
  legalName: string
}

export interface OrgDepartment {
  id: string
  organizationId: string
  name: string
  managerUserId?: string
}

/**
 * SECURITY NOTE (prototype only):
 * Client-side permission checks guide UX (nav, buttons, route guards).
 * Production FastAPI must independently enforce every permission and
 * record-level access rule. Never trust the browser for authorization.
 */
export const ACCESS_CONTROL_DISCLAIMER =
  'UI permission checks are prototype-only. FastAPI must enforce every permission and record scope in production.'
