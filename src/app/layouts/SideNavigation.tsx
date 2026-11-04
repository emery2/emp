import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { hasAnyPermission } from '@/access/evaluate'
import { navGroups } from '@/app/layouts/nav-config'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/useAuth'
import { useBranding } from '@/hooks/useBranding'
import { useShell } from '@/hooks/useShell'
import { useTenant } from '@/hooks/useTenant'
import { organization } from '@/mocks/organization'
import { mockEntitlementsRepository } from '@/shared/repositories/entitlements-repository'
import { cn } from '@/lib/cn'

export function SideNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const { collapsed, toggleCollapsed } = useShell()
  const { user } = useAuth()
  const { tenant } = useTenant()
  const branding = useBranding()
  const logoUrl = branding.data?.logoUrl

  if (!user) return null

  return (
    <aside
      className={cn(
        'flex h-full flex-col bg-sidebar text-sidebar-foreground',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div
        className={cn(
          'flex h-shell items-center gap-3 border-b border-sidebar-hover bg-sidebar-header px-3',
          collapsed && 'justify-center',
        )}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            className={cn(
              'object-contain',
              collapsed ? 'h-8 w-8' : 'h-8 max-w-[7.5rem]',
            )}
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center bg-sidebar-item-active text-xs font-bold text-sidebar-foreground">
            {organization.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{organization.name}</p>
            <p className="truncate text-xs text-sidebar-muted">EMP</p>
          </div>
        ) : null}
      </div>
      <ScrollArea className="flex-1 px-2 pb-2">
        <nav aria-label="Primary" className="space-y-4">
          {navGroups.map((group, groupIndex) => {
            const items = group.items.filter(
              (item) =>
                hasAnyPermission(user, item.permissions) &&
                (!item.module ||
                  mockEntitlementsRepository.isModuleEnabled(
                    tenant.id,
                    item.module,
                  )) &&
                (!item.feature ||
                  mockEntitlementsRepository.isFeatureEffectivelyEnabled(
                    tenant.id,
                    item.feature,
                  )),
            )
            if (items.length === 0) return null
            return (
              <div key={group.label ?? `group-${groupIndex}`}>
                {group.label && !collapsed ? (
                  <p className="mb-1 px-2 text-overline uppercase tracking-wide text-sidebar-muted">
                    {group.label}
                  </p>
                ) : null}
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          end={item.to === '/app'}
                          onClick={onNavigate}
                          title={collapsed ? item.label : undefined}
                          className={({ isActive }) =>
                            cn(
                              'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground',
                              isActive &&
                                'bg-sidebar-item-active text-sidebar-foreground shadow-sm',
                              collapsed && 'justify-center px-0',
                            )
                          }
                        >
                          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                          {!collapsed ? <span>{item.label}</span> : null}
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-sidebar-hover p-2">
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'sm'}
          className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" strokeWidth={1.5} />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
