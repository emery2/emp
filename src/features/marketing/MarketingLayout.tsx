import { Globe, Menu, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { marketingNav } from '@/features/marketing/content'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'

function EmpMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10.5 22c-4.2 0-7.5-3-7.5-6.8C3 11.5 6 8.5 9.8 8.2 11.2 4.8 14.4 2.5 18.2 2.5c4.6 0 8.4 3.3 9.1 7.6 3.5.4 6.2 3.3 6.2 6.8 0 3.8-3.2 6.9-7.2 6.9H10.5Z"
        fill="var(--marketing-cloud)"
      />
    </svg>
  )
}

export function MarketingLayout() {
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const startTo = isAuthenticated ? '/app' : '/login'
  const accountTo = isAuthenticated ? '/app' : '/login'

  return (
    <div className="min-h-screen bg-surface text-[var(--marketing-navy)]">
      <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto flex h-[4.25rem] max-w-[90rem] items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-6 xl:gap-8">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2"
              onClick={() => setOpen(false)}
              aria-label="EMP home"
            >
              <EmpMark className="h-8 w-11" />
              <span className="text-lg font-bold tracking-tight text-[var(--marketing-navy)]">
                EMP
              </span>
            </Link>

            <nav
              className="hidden items-center gap-5 xl:gap-6 lg:flex"
              aria-label="Primary"
            >
              {marketingNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap text-[0.9375rem] font-semibold text-[var(--marketing-navy)] hover:opacity-80',
                      isActive && 'underline decoration-2 underline-offset-8',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3 md:gap-4">
            <Link
              to="/contact"
              className="hidden text-[0.9375rem] font-semibold text-[var(--marketing-navy)] underline underline-offset-4 sm:inline"
            >
              Contact Us
            </Link>
            <button
              type="button"
              className="hidden rounded-full p-1.5 text-[var(--marketing-navy)] hover:bg-[#f3f3f3] md:inline-flex"
              aria-label="Language and region"
            >
              <Globe className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <Link
              to={accountTo}
              className="hidden h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--marketing-cloud)] text-[var(--marketing-navy)] hover:bg-[#f3f3f3] md:inline-flex"
              aria-label={isAuthenticated ? 'Open app' : 'Log in'}
            >
              <UserRound className="h-4 w-4" strokeWidth={1.75} />
            </Link>
            <Link
              to={startTo}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--marketing-cta)] px-5 text-sm font-bold text-white hover:opacity-90"
            >
              Get started
            </Link>
            <button
              type="button"
              className="inline-flex rounded-md p-2 text-[var(--marketing-navy)] hover:bg-[#f3f3f3] lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {open ? (
          <nav
            className="border-t border-[#e5e5e5] bg-white px-4 py-3 lg:hidden"
            aria-label="Mobile primary"
          >
            {marketingNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-2 py-3 text-base font-semibold text-[var(--marketing-navy)]',
                    isActive && 'underline',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block px-2 py-3 text-base font-semibold text-[var(--marketing-navy)] underline"
            >
              Contact Us
            </Link>
          </nav>
        ) : null}
      </header>

      <Outlet />

      <footer className="border-t border-divider bg-background text-text-primary">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <EmpMark className="h-7 w-10" />
              <p className="text-lg font-bold text-[var(--marketing-navy)]">EMP</p>
            </div>
            <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Modular enterprise applications—HR, CRM, PRM, EPM, Projects, and
              Service Desk—on a shared core.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {marketingNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Account</p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary">
                  Get started
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-divider">
          <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-text-muted md:px-8">
            © {new Date().getFullYear()} EMP
          </p>
        </div>
      </footer>
    </div>
  )
}
