import {
  getDataScope,
  resolvePermissions,
} from '@/access/evaluate'
import { PERMISSION_LABELS } from '@/access/permissions'
import { ROLE_DEFINITIONS, type RoleId } from '@/access/roles'
import { PageHeader } from '@/components/shared/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { getDepartmentName, organization } from '@/mocks/organization'
import { ACCESS_CONTROL_DISCLAIMER } from '@/types/access'

export function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  const permissions = [...resolvePermissions(user)].sort()
  const scope = getDataScope(user)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        description={user.title}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">Email</p>
          <p className="text-sm font-medium">{user.email}</p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">Organization</p>
          <p className="text-sm font-medium">{organization.name}</p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">Department</p>
          <p className="text-sm font-medium">
            {getDepartmentName(user.departmentId)}
          </p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-overline uppercase text-text-muted">Data scope</p>
          <p className="text-sm font-medium capitalize">{scope.scope}</p>
        </div>
      </div>

      <section className="bg-surface p-4">
        <h2 className="mb-2 text-sm font-semibold">Roles</h2>
        <ul className="space-y-2">
          {user.roleIds.map((roleId) => (
            <li key={roleId} className="bg-surface-hover px-3 py-2 text-sm">
              <p className="font-medium">
                {ROLE_DEFINITIONS[roleId as RoleId]?.label ?? roleId}
              </p>
              <p className="text-xs text-text-muted">
                {ROLE_DEFINITIONS[roleId as RoleId]?.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface p-4">
        <h2 className="mb-2 text-sm font-semibold">
          Resolved permissions ({permissions.length})
        </h2>
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {permissions.map((permission) => (
            <li
              key={permission}
              className="bg-surface-hover px-3 py-1.5 text-xs text-text-secondary"
            >
              <span className="font-medium text-text-primary">
                {permission}
              </span>
              <span className="block text-text-muted">
                {PERMISSION_LABELS[permission]}
              </span>
            </li>
          ))}
        </ul>
        {user.permissionOverrides?.grant?.length ? (
          <p className="mt-3 text-xs text-success">
            Grants: {user.permissionOverrides.grant.join(', ')}
          </p>
        ) : null}
        {user.permissionOverrides?.deny?.length ? (
          <p className="mt-1 text-xs text-danger">
            Denies: {user.permissionOverrides.deny.join(', ')}
          </p>
        ) : null}
        <p className="mt-3 text-[11px] text-text-muted">
          {ACCESS_CONTROL_DISCLAIMER}
        </p>
      </section>
    </div>
  )
}
