import { ChevronDown, Globe, Menu, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
  marketingFooterColumns,
  marketingNav,
  megaMenus,
  type MegaMenuId,
} from '@/features/marketing/content'
import { MarketingMegaMenu } from '@/features/marketing/MarketingMegaMenu'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'

function EmpWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'text-[1.35rem] font-bold tracking-tight text-[var(--marketing-navy)]',
        className,
      )}
    >
      EMP
    </span>
  )
}

export function MarketingLayout() {
  const { isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<MegaMenuId | null>(null)
  const [activeRail, setActiveRail] = useState('Featured Applications')
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonIds = useId()
  const startTo = isAuthenticated ? '/app' : '/login'
  const accountTo = isAuthenticated ? '/app' : '/login'

  useEffect(() => {
    if (!openMenu) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null)
    }
    const onPointer = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onPointer)
    }
  }, [openMenu])

  useEffect(() => {
    if (!openMenu) return
    setActiveRail(megaMenus[openMenu].rail[0]?.label ?? '')
  }, [openMenu])

  const closeMenus = () => {
    setOpenMenu(null)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-white text-[var(--marketing-navy)]">
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-[#e6e8ec] bg-white"
      >
        <div className="marketing-container relative flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <div className="flex min-w-0 flex-1 items-center gap-7">
            <Link
              to="/"
              className="shrink-0"
              onClick={closeMenus}
              aria-label="EMP home"
            >
              <EmpWordmark />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {marketingNav.map((item) => {
                const isOpen = openMenu === item.label
                return (
                  <button
                    key={item.label}
                    type="button"
                    id={`${menuButtonIds}-${item.label}`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === item.label ? null : (item.label as MegaMenuId),
                      )
                    }
                    className={cn(
                      'inline-flex items-center gap-1 border-b-2 px-2.5 py-5 text-[0.9375rem] font-semibold transition-colors',
                      isOpen
                        ? 'border-[var(--marketing-accent)] text-[var(--marketing-navy)]'
                        : 'border-transparent text-[var(--marketing-navy)] hover:opacity-80',
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 opacity-70 transition-transform',
                        isOpen && 'rotate-180',
                      )}
                      strokeWidth={2}
                    />
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <button
              type="button"
              className="hidden rounded-full p-2 text-[var(--marketing-navy)] hover:bg-[#f3f5f8] md:inline-flex"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="hidden rounded-full p-2 text-[var(--marketing-navy)] hover:bg-[#f3f5f8] md:inline-flex"
              aria-label="Language and region"
            >
              <Globe className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <div className="hidden items-center text-[0.8125rem] font-semibold text-[var(--marketing-navy)] xl:flex">
              <Link to="/support" className="px-2 hover:opacity-70">
                Support
              </Link>
              <span className="text-[#c5cad3]" aria-hidden>
                |
              </span>
              <Link to="/contact" className="px-2 hover:opacity-70">
                Contact
              </Link>
              <span className="text-[#c5cad3]" aria-hidden>
                |
              </span>
              <Link to={accountTo} className="px-2 hover:opacity-70">
                {isAuthenticated ? 'Workspace' : 'Login'}
              </Link>
            </div>

            <Link
              to={startTo}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--marketing-cta)] px-4 text-sm font-bold text-white hover:opacity-90"
            >
              Get a demo
              <span
                className="text-base font-bold text-[var(--marketing-accent)]"
                aria-hidden
              >
                →
              </span>
            </Link>

            <button
              type="button"
              className="inline-flex rounded-md p-2 text-[var(--marketing-navy)] hover:bg-[#f3f5f8] lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => {
                setOpenMenu(null)
                setMobileOpen((value) => !value)
              }}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>

          {openMenu ? (
            <MarketingMegaMenu
              panel={megaMenus[openMenu]}
              activeRail={activeRail}
              onRailChange={setActiveRail}
              onNavigate={closeMenus}
            />
          ) : null}
        </div>

        {mobileOpen ? (
          <nav
            className="max-h-[min(80vh,36rem)] overflow-y-auto border-t border-[#e6e8ec] bg-white px-4 py-3 lg:hidden"
            aria-label="Mobile primary"
          >
            {marketingNav.map((item) => (
              <div key={item.label} className="border-b border-[#eef0f4] py-2">
                <Link
                  to={item.to}
                  onClick={closeMenus}
                  className="block px-2 py-2 text-base font-bold text-[var(--marketing-navy)]"
                >
                  {item.label}
                </Link>
                <div className="mt-1 space-y-1 pb-2 pl-2">
                  {megaMenus[item.label as MegaMenuId].columns
                    .flatMap((column) => column.links)
                    .slice(0, 6)
                    .map((link) => (
                      <Link
                        key={`${item.label}-${link.label}`}
                        to={link.to}
                        onClick={closeMenus}
                        className="block px-2 py-1.5 text-sm font-medium text-[#5c6777]"
                      >
                        {link.label}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
            <Link
              to="/contact"
              onClick={closeMenus}
              className="block px-2 py-3 text-base font-semibold text-[var(--marketing-navy)]"
            >
              Contact
            </Link>
          </nav>
        ) : null}
      </header>

      <Outlet />

      <footer className="w-full bg-[var(--marketing-navy)] text-white">
        <div className="grid w-full grid-cols-2 gap-x-8 gap-y-10 px-6 py-16 sm:px-8 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-10 lg:px-12 xl:px-16 2xl:px-20">
          {marketingFooterColumns.map((column) => (
            <div key={column.title} className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/90">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      to={link.to}
                      className="text-sm leading-6 text-white/70 hover:text-white md:text-[0.9375rem]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-4 border-t border-[var(--marketing-accent)] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            <Globe className="h-4 w-4" strokeWidth={1.75} />
            English
            <ChevronDown className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-3 text-white/80">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2 hover:bg-white/10 hover:text-white"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.84-2.05 3.8-2.05 4.06 0 4.8 2.67 4.8 6.15V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.5V23h-4V8.5z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2 hover:bg-white/10 hover:text-white"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 border-t border-white/10 px-6 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 xl:px-16 2xl:px-20 md:text-sm">
          <p>© {new Date().getFullYear()} EMP. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <Link to="/company" className="hover:text-white">
              Privacy statement
            </Link>
            <span aria-hidden>|</span>
            <Link to="/company" className="hover:text-white">
              Terms of service
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
