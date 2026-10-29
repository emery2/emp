import { NavLink, Outlet } from 'react-router-dom'
import { hasPermission } from '@/access/evaluate'
import type { Permission } from '@/access/permissions'
import { cn } from '@/lib/cn'
import { useAuth } from '@/hooks/useAuth'

const settingsNav: Array<{
  label: string
  to: string
  permission: Permission
}> = [
  {
    label: 'Organization',
    to: '/settings/organization',
    permission: 'settings.view',
  },
  {
    label: 'Branding',
    to: '/settings/branding',
    permission: 'settings.view',
  },
  {
    label: 'Departments',
    to: '/settings/departments',
    permission: 'settings.view',
  },
  {
    label: 'Users & roles',
    to: '/settings/users',
    permission: 'access.roles.manage',
  },
  {
    label: 'Modules',
    to: '/settings/modules',
    permission: 'modules.configure',
  },
]

export function SettingsLayout() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <nav aria-label="Settings" className="flex flex-wrap gap-1 border-b border-divider">
        {settingsNav
          .filter((item) => hasPermission(user, item.permission))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary',
                  isActive && 'border-b-2 border-primary text-primary',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
      <Outlet />
    </div>
  )
}
