import {
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  UserRound,
  Users,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { resolvePermissions } from '@/access/evaluate'
import { ROLE_DEFINITIONS, type RoleId } from '@/access/roles'
import { crumbsForPath } from '@/app/layouts/nav-config'
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
import { getDepartmentName } from '@/mocks/organization'

const mockNotifications = [
  { id: 'n1', title: 'Leave awaiting manager review', time: '10m ago' },
  { id: 'n2', title: 'HR verification queue updated', time: '1h ago' },
  { id: 'n3', title: 'Policy reminder: submit leave 5 days ahead', time: 'Yesterday' },
]

export function ShellBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout, demoAccounts, switchDemoUser } = useAuth()
  const { setMobileOpen } = useShell()
  const { tenant, tenants, setTenantId } = useTenant()

  if (!user) return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`
  const roleId = user.roleIds[0] as RoleId
  const roleLabel = ROLE_DEFINITIONS[roleId]?.label ?? user.roleIds[0]
  const crumbs = crumbsForPath(pathname)

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
        <p className="truncate text-xs text-text-muted">{tenant.name}</p>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.5} />
              ) : null}
              {crumb.href ? (
                <Link to={crumb.href} className="text-text-secondary hover:text-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-text-primary">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="mx-auto hidden w-full max-w-md md:block">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            strokeWidth={1.5}
            aria-hidden
          />
          <Input
            placeholder="Search people, leave, work…"
            className="pl-9"
            aria-label="Global search"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2" aria-label="Switch organization">
              <Building2 className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden max-w-[8rem] truncate md:inline">
                {tenant.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Organization</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tenants.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => setTenantId(item.id)}
              >
                {item.name}
                {item.id === tenant.id ? ' · current' : ''}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.map((item) => (
              <DropdownMenuItem key={item.id} className="flex flex-col items-start gap-0.5">
                <span className="text-sm">{item.title}</span>
                <span className="text-xs text-text-muted">{item.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
                <span className="text-xs text-text-muted">{roleLabel}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              {getDepartmentName(user.departmentId)}
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <UserRound className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Switch demo user</DropdownMenuLabel>
            {demoAccounts.map((account) => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => void switchDemoUser(account.id).then(() => navigate('/app'))}
              >
                <Users className="mr-2 h-4 w-4" strokeWidth={1.5} />
                {account.firstName} {account.lastName}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Sign out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-[11px] text-text-muted">
              Permissions: {resolvePermissions(user).size}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
