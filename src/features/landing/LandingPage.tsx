import {
  BarChart3,
  Contact,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'

export function LandingPage() {
  const { isAuthenticated } = useAuth()
  const primaryTo = isAuthenticated ? '/app' : '/login'

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="sticky top-0 z-20 border-b border-divider bg-surface">
        <div className="mx-auto flex h-shell max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="text-lg font-bold tracking-tight text-text-primary">
            EMP
          </Link>
          <nav className="flex items-center gap-2" aria-label="Landing">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/app">Open app</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/login">Get started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-52px)] max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-2 md:gap-12 md:px-6 md:py-0">
          <div className="space-y-6 motion-safe:animate-[fade-up_500ms_ease-out]">
            <p className="text-5xl font-bold leading-none tracking-tight text-text-primary md:text-6xl">
              EMP
            </p>
            <h1 className="max-w-md text-2xl font-semibold leading-8 text-text-primary md:text-3xl md:leading-9">
              One platform for people, customers, and work.
            </h1>
            <p className="max-w-md text-base leading-6 text-text-secondary">
              Enterprise Management Platform unifies HR and CRM in a dense,
              role-aware workspace your teams already know how to use.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link to={primaryTo}>
                  {isAuthenticated ? 'Open workspace' : 'Start with demo login'}
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <a href="#modules">See modules</a>
              </Button>
            </div>
          </div>

          <div
            className="motion-safe:animate-[fade-up_700ms_ease-out] motion-safe:[animation-delay:120ms]"
            aria-hidden
          >
            <ProductMock />
          </div>
        </section>

        <section
          id="modules"
          className="border-t border-divider bg-surface"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <h2 className="text-lg font-semibold text-text-primary">
              Built around your core operations
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              HR and CRM ship first-class. Projects, support, automation, and
              reporting follow the same patterns.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <ModuleTile
                icon={Users}
                title="People"
                body="Employees, leave, and attendance with department-scoped views."
              />
              <ModuleTile
                icon={Contact}
                title="Customers"
                body="Leads, contacts, and a configurable sales pipeline board."
              />
              <ModuleTile
                icon={BarChart3}
                title="Reporting"
                body="Role-based dashboards with solid chart series—no visual noise."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-divider bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-text-secondary md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            <span className="font-semibold text-text-primary">EMP</span>
            {' — '}
            Enterprise Management Platform
          </p>
          <Link to="/login" className="text-primary hover:underline">
            Sign in to your tenant
          </Link>
        </div>
      </footer>
    </div>
  )
}

function ModuleTile({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Users
  title: string
  body: string
}) {
  return (
    <article className="bg-background p-5">
      <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} aria-hidden />
      <h3 className="mt-3 text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-sm leading-5 text-text-secondary">{body}</p>
    </article>
  )
}

function ProductMock() {
  return (
    <div className="overflow-hidden bg-surface">
      <div className="flex h-10 items-center gap-2 border-b border-divider px-3">
        <LayoutDashboard className="h-4 w-4 text-primary" strokeWidth={1.5} />
        <span className="text-sm font-semibold">EMP</span>
        <span className="text-text-muted">/</span>
        <span className="text-sm text-text-secondary">Dashboard</span>
      </div>
      <div className="flex min-h-[22rem]">
        <aside className="hidden w-40 shrink-0 bg-sidebar p-2 sm:block">
          {['Dashboard', 'People', 'Customers', 'Reports'].map((item, index) => (
            <div
              key={item}
              className={cn(
                'relative px-3 py-2 text-body-sm text-text-secondary',
                index === 0 &&
                  'bg-sidebar-active font-medium text-text-primary before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-sidebar-accent',
              )}
            >
              {item}
            </div>
          ))}
        </aside>
        <div className="flex-1 space-y-3 bg-background p-3">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              { label: 'Headcount', value: '93' },
              { label: 'Open leave', value: '7' },
              { label: 'Pipeline', value: '$411k' },
              { label: 'Tickets', value: '14' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface p-3">
                <p className="text-overline uppercase tracking-wide text-text-muted">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="bg-surface p-3">
              <p className="mb-3 text-sm font-semibold">Headcount trend</p>
              <div className="flex h-28 items-end gap-2">
                {[40, 52, 58, 64, 72, 88].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-primary motion-safe:animate-[grow-bar_600ms_ease-out]"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${index * 60}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="bg-surface p-3">
              <p className="mb-3 text-sm font-semibold">Pipeline by stage</p>
              <div className="space-y-2">
                {[
                  { label: 'Qualify', width: '70%' },
                  { label: 'Discovery', width: '55%' },
                  { label: 'Proposal', width: '35%' },
                  { label: 'Negotiation', width: '48%' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex justify-between text-xs text-text-muted">
                      <span>{row.label}</span>
                    </div>
                    <div className="h-2 bg-surface-hover">
                      <div
                        className="h-full bg-chart-2"
                        style={{ width: row.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
