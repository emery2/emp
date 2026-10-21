import { NavLink, Outlet } from 'react-router-dom'
import { settingsNav } from '@/app/layouts/nav-config'
import { cn } from '@/lib/cn'

export function SettingsLayout() {
  return (
    <div className="space-y-6">
      <nav aria-label="Settings" className="flex flex-wrap gap-1 border-b border-divider">
        {settingsNav.map((item) => (
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
