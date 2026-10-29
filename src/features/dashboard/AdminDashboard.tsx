import { ActionCard, DashboardShell } from '@/features/dashboard/dashboard-shared'
import { ROLE_DEFINITIONS } from '@/access/roles'
import { demoUsers } from '@/mocks/users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AdminDashboard() {
  const activeUsers = demoUsers.filter((user) => user.isActive).length
  const roleCount = Object.keys(ROLE_DEFINITIONS).length

  return (
    <DashboardShell
      title="System administration"
      description="Platform access, roles, and configuration controls."
      stats={[
        {
          label: 'Active demo users',
          value: activeUsers,
          href: '/settings/users',
        },
        {
          label: 'Built-in roles',
          value: roleCount,
          href: '/settings/users',
        },
        {
          label: 'Access control',
          value: 'Manage',
          href: '/settings/users',
        },
        {
          label: 'Org settings',
          value: 'Open',
          href: '/settings',
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Role catalog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.values(ROLE_DEFINITIONS).map((role) => (
              <div
                key={role.id}
                className="bg-surface-hover px-3 py-2 text-sm"
              >
                <p className="font-medium">{role.label}</p>
                <p className="text-xs text-text-muted">
                  {role.permissions.length} permissions
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-4 lg:col-span-2">
          <ActionCard
            title="Users & roles"
            body="Assign access roles and review invitation status for the organization."
            to="/settings/users"
            label="Manage access"
          />
          <ActionCard
            title="Organization settings"
            body="Update org profile, branding, and department structure."
            to="/settings"
            label="Open settings"
          />
        </div>
      </div>
    </DashboardShell>
  )
}
