import {
  Building2,
  CalendarDays,
  LogOut,
  Menu,
  Search,
  UserRound,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useShell } from '@/hooks/useShell'
import { useTenant } from '@/hooks/useTenant'
import { roleLabels } from '@/lib/rbac'

function moduleTitle(pathname: string): string {
  if (pathname.startsWith('/calendar')) return 'Calendar'
  if (pathname.startsWith('/people')) return 'People'
  if (pathname.startsWith('/customers')) return 'Customers'
  if (pathname.startsWith('/work')) return 'Work'
  if (pathname.startsWith('/support')) return 'Support'
  if (pathname.startsWith('/automation')) return 'Automation'
  if (pathname.startsWith('/documents')) return 'Documents'
  if (pathname.startsWith('/reports')) return 'Reports'
  if (pathname.startsWith('/settings')) return 'Settings'
  return 'Dashboard'
}

export function ShellBar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { tenant, tenants, setTenantId } = useTenant()
  const { setMobileOpen } = useShell()

  if (!user) return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`

  return (
    <header className="flex h-shell items-center gap-3 border-b border-divider bg-surface px-3 md:px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" strokeWidth={1.5} />
      </Button>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-text-primary">
          EMP
          <span className="mx-2 text-text-muted">/</span>
          <span className="font-medium text-text-secondary">
            {moduleTitle(pathname)}
          </span>
        </p>
      </div>
      <div className="mx-auto hidden w-full max-w-md md:block">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            strokeWidth={1.5}
            aria-hidden
          />
          <Input
            placeholder="Search people, customers, work…"
            className="pl-9"
            aria-label="Global search"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1">
        {user.role === 'super_admin' ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Switch tenant">
                <Building2 className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden lg:inline">{tenant.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tenants</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tenants.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => setTenantId(item.id)}
                >
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <Button variant="ghost" size="icon" asChild aria-label="Open calendar">
          <Link to="/calendar">
            <CalendarDays className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-left md:block">
                <span className="block text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-text-muted">
                  {roleLabels[user.role]}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem disabled>
              <UserRound className="mr-2 h-4 w-4" strokeWidth={1.5} />
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
