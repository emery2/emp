import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { marketingProducts } from '@/features/marketing/content'
import { cn } from '@/lib/cn'

const deckCards = [
  {
    productId: 'hr',
    tone: 'bg-[#032d60]',
    eyebrow: 'People operations on your hierarchy',
    headline: 'Hire-to-retire workflows that follow the reporting line',
    panelTitle: 'Human Capital',
  },
  {
    productId: 'crm',
    tone: 'bg-[#0b5cab]',
    eyebrow: 'Revenue teams on shared Party records',
    headline: 'Pipeline and customers that stay connected to service',
    panelTitle: 'CRM',
  },
  {
    productId: 'prm',
    tone: 'bg-[#0b6bcb]',
    eyebrow: 'Partners without owning the whole suite',
    headline: 'Onboard, agree, and score partners in their own portal',
    panelTitle: 'PRM',
  },
  {
    productId: 'epm',
    tone: 'bg-[#0250a5]',
    eyebrow: 'Strategy tied to live module KPIs',
    headline: 'Cascade objectives—scorecards appear only for enabled services',
    panelTitle: 'EPM',
  },
  {
    productId: 'projects',
    tone: 'bg-[#0a7c6b]',
    eyebrow: 'Work assignment that respects leave',
    headline: 'Heads of Department assign tasks without booking people who are away',
    panelTitle: 'Projects',
  },
  {
    productId: 'service-desk',
    tone: 'bg-[#1b5e4a]',
    eyebrow: 'Internal and external requests',
    headline: 'Ground tickets with customers, partners, and SLAs',
    panelTitle: 'Service Desk',
  },
] as const

type DeckProductId = (typeof deckCards)[number]['productId']

const deckProductIds = new Set<string>(deckCards.map((card) => card.productId))

function isDeckProductId(value: string): value is DeckProductId {
  return deckProductIds.has(value)
}

export function StickyProductDeck() {
  const [activeId, setActiveId] = useState<DeckProductId>(deckCards[0].productId)
  const cardRefs = useRef<Partial<Record<DeckProductId, HTMLElement | null>>>({})

  useEffect(() => {
    const nodes = deckCards
      .map((card) => cardRefs.current[card.productId])
      .filter((node): node is HTMLElement => Boolean(node))

    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]
        if (top?.target.id) {
          const id = top.target.id.replace('deck-', '')
          if (isDeckProductId(id)) setActiveId(id)
        }
      },
      {
        root: null,
        // Prefer the card stuck near the top of the viewport
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0.25, 0.5, 0.75],
      },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const scrollToCard = (productId: DeckProductId) => {
    cardRefs.current[productId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <section
      id="product-deck"
      className="border-b border-divider bg-[#eef4fb]"
      aria-label="Product suite"
    >
      <div className="mx-auto max-w-[90rem] px-4 py-12 md:px-8 md:py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--marketing-navy)] md:text-4xl">
            See what is possible when every part of your business works together
          </h2>
          <p className="mt-3 text-base text-[var(--marketing-navy)]/75">
            Scroll the deck—each application sticks and stacks. Jump from the
            rail or open a dedicated product page.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav aria-label="Products in deck" className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {deckCards.map((card) => {
                const product = marketingProducts.find((p) => p.id === card.productId)!
                const Icon = product.icon
                const active = activeId === card.productId
                return (
                  <button
                    key={card.productId}
                    type="button"
                    onClick={() => scrollToCard(card.productId)}
                    className={cn(
                      'flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-left text-sm font-semibold transition-colors',
                      active
                        ? 'bg-white text-[var(--marketing-navy)] shadow-md'
                        : 'text-[var(--marketing-navy)]/70 hover:bg-white/60',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>{card.panelTitle}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          <div className="relative">
            {deckCards.map((card, index) => {
              const product = marketingProducts.find((p) => p.id === card.productId)!
              const Icon = product.icon
              return (
                <article
                  key={card.productId}
                  id={`deck-${card.productId}`}
                  ref={(node) => {
                    cardRefs.current[card.productId] = node
                  }}
                  className={cn(
                    'sticky flex min-h-[min(78vh,40rem)] flex-col justify-between overflow-hidden rounded-[1.75rem] p-6 text-white shadow-md md:p-10',
                    card.tone,
                    // Keep stacking readable when motion is reduced
                    'motion-reduce:static motion-reduce:mb-6',
                  )}
                  style={{
                    top: '5.75rem',
                    zIndex: index + 1,
                    marginBottom: index === deckCards.length - 1 ? 0 : '2.5rem',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="max-w-md text-sm font-medium text-white/80 md:text-base">
                      {card.eyebrow}
                    </p>
                    <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                      {card.panelTitle}
                    </div>
                  </div>

                  <div className="mt-10 grid flex-1 grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                    <div>
                      <h3 className="max-w-xl text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
                        {card.headline}
                      </h3>
                      <p className="mt-4 max-w-lg text-base leading-7 text-white/85">
                        {product.body}
                      </p>
                      <Link
                        to={`/products/${product.slug}`}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[var(--marketing-navy)] hover:bg-white/90"
                      >
                        Explore {product.shortTitle}
                        <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-0">
                      <p className="text-sm font-semibold text-white/90">
                        {product.tagline}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {product.bullets.slice(0, 3).map((bullet) => (
                          <li
                            key={bullet}
                            className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white/90"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
