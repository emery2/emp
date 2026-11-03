import { Link } from 'react-router-dom'
import type { MegaMenuPanel } from '@/features/marketing/content'
import { cn } from '@/lib/cn'

interface MarketingMegaMenuProps {
  panel: MegaMenuPanel
  activeRail: string
  onRailChange: (label: string) => void
  onNavigate: () => void
}

export function MarketingMegaMenu({
  panel,
  activeRail,
  onRailChange,
  onNavigate,
}: MarketingMegaMenuProps) {
  return (
    <div
      className="absolute inset-x-0 top-full z-50 border-b border-[#e6e8ec] bg-white shadow-[0_18px_40px_rgba(5,25,45,0.12)]"
      role="region"
      aria-label={`${panel.id} menu`}
    >
      <div className="marketing-container grid max-h-[min(82vh,48rem)] grid-cols-1 overflow-hidden lg:grid-cols-[16rem_minmax(0,1fr)_18rem]">
        <aside className="hidden flex-col border-r border-[#e6e8ec] bg-[#f6f7f9] lg:flex">
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <ul className="space-y-1">
              {panel.rail.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => onRailChange(item.label)}
                    className={cn(
                      'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                      activeRail === item.label
                        ? 'font-bold text-[var(--marketing-navy)]'
                        : 'font-medium text-[var(--marketing-navy)]/70 hover:bg-white/80',
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            {panel.railGroupLabel && panel.railGrouped ? (
              <div className="mt-6">
                <p className="px-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#7a8494]">
                  {panel.railGroupLabel}
                </p>
                <ul className="mt-2 space-y-1">
                  {panel.railGrouped.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        onClick={onNavigate}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--marketing-navy)]/70 hover:bg-white/80 hover:text-[var(--marketing-navy)]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          {panel.railFooter ? (
            <div className="border-t border-[#e6e8ec] px-4 py-4">
              <Link
                to={panel.railFooter.to}
                onClick={onNavigate}
                className="block rounded-md px-3 py-2 text-sm font-semibold text-[var(--marketing-navy)] hover:bg-white/80"
              >
                {panel.railFooter.label}
              </Link>
            </div>
          ) : null}
        </aside>

        <div className="overflow-y-auto px-5 py-6 md:px-8 md:py-7">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--marketing-navy)] md:text-3xl">
            {panel.heading}
          </h2>
          <p className="mt-3 text-sm font-semibold text-[var(--marketing-navy)]">
            {panel.subheading}
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5c6777]">
            {panel.description}
          </p>

          <div
            className={cn(
              'mt-8 grid gap-8',
              panel.columns.length > 2
                ? 'sm:grid-cols-2 xl:grid-cols-4'
                : 'sm:grid-cols-2',
            )}
          >
            {panel.columns.map((column) => (
              <div key={column.title}>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#7a8494]">
                  {column.title}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        to={link.to}
                        onClick={onNavigate}
                        className="text-sm font-bold text-[var(--marketing-navy)] hover:text-[var(--marketing-cloud)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden overflow-y-auto border-l border-[#e6e8ec] bg-[#fafbfc] p-5 lg:block">
          <div className="space-y-4">
            {panel.promos.map((promo) => (
              <article
                key={promo.title}
                className={cn(
                  'overflow-hidden rounded-2xl border border-[#e6e8ec]',
                  promo.tone === 'dark'
                    ? 'bg-[var(--marketing-navy)] text-white'
                    : 'bg-white text-[var(--marketing-navy)]',
                )}
              >
                <div
                  className={cn(
                    'flex h-28 items-end px-4 py-3',
                    promo.tone === 'dark'
                      ? 'bg-gradient-to-br from-[#0d2033] to-[#2d4a8c]'
                      : 'bg-gradient-to-br from-[#eef2f8] to-[#d9e2f2]',
                  )}
                >
                  <span
                    className={cn(
                      'rounded-md px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide',
                      promo.tone === 'dark'
                        ? 'bg-white/15 text-white'
                        : 'bg-white/80 text-[var(--marketing-navy)]',
                    )}
                  >
                    {promo.eyebrow}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold leading-snug">{promo.title}</h3>
                  <p
                    className={cn(
                      'mt-2 text-xs leading-5',
                      promo.tone === 'dark' ? 'text-white/75' : 'text-[#5c6777]',
                    )}
                  >
                    {promo.body}
                  </p>
                  <Link
                    to={promo.to}
                    onClick={onNavigate}
                    className={cn(
                      'mt-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold',
                      promo.tone === 'dark'
                        ? 'border-white/40 text-white hover:bg-white/10'
                        : 'border-[var(--marketing-navy)] text-[var(--marketing-navy)] hover:bg-[#f3f5f8]',
                    )}
                  >
                    {promo.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
