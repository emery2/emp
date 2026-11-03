import { ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  customerStories,
  heroTechLogos,
  whyPillars,
} from '@/features/marketing/content'
import { AccuracyCtaSection } from '@/features/marketing/AccuracyCtaSection'
import { HeroVisual } from '@/features/marketing/HeroVisual'
import { IntelligentAppsSection } from '@/features/marketing/IntelligentAppsSection'
import { StickyProductDeck } from '@/features/marketing/StickyProductDeck'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated } = useAuth()
  const primaryTo = isAuthenticated ? '/app' : '/login'

  return (
    <main>
      <section
        className="relative flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden border-b border-[#e6e8ec]"
        style={{
          background:
            'linear-gradient(135deg, var(--marketing-hero-from) 0%, #e4e7f5 42%, var(--marketing-hero-to) 100%)',
        }}
      >
        <div className="marketing-container grid flex-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:py-10">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[var(--marketing-ink)] md:text-6xl lg:text-[4rem] xl:text-[4.5rem]">
              The operating suite for the connected enterprise
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#243447] md:text-xl md:leading-9">
              The modular platform where people, customers, partners, and
              performance converge—so you can run the right workflows, right
              now.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to={primaryTo}
                className="inline-flex h-14 items-center gap-2 rounded-full bg-[var(--marketing-navy)] px-7 text-base font-bold text-white hover:opacity-90"
              >
                <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                {isAuthenticated ? 'Open workspace' : 'Watch our demo'}
              </Link>
              <Link
                to="/products"
                className="inline-flex h-14 items-center rounded-full border border-[var(--marketing-navy)] bg-transparent px-7 text-base font-bold text-[var(--marketing-navy)] hover:bg-white/40"
              >
                Explore EMP applications
              </Link>
            </div>
          </div>

          <div className="relative z-10 min-h-[26rem] w-full md:min-h-[32rem] xl:min-h-[36rem]">
            <HeroVisual />
          </div>
        </div>

        <div className="marketing-container relative z-10 pb-10 pt-2 md:pb-12">
          <div className="flex flex-col items-stretch gap-3 overflow-hidden rounded-full bg-[rgba(13,32,51,0.82)] px-6 py-4 text-white shadow-[0_12px_40px_rgba(13,32,51,0.25)] backdrop-blur-sm sm:flex-row sm:items-center sm:gap-8 sm:px-10 sm:py-5">
            <p className="shrink-0 text-base font-semibold sm:max-w-[13rem]">
              Technologies we work with
            </p>
            <div
              className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
              aria-label="Technologies and software we work with"
            >
              <div className="flex w-max motion-safe:animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    className="flex shrink-0 items-center gap-12 pr-12"
                    aria-hidden={copy === 1 || undefined}
                  >
                    {heroTechLogos.map((logo) => (
                      <li
                        key={`${copy}-${logo}`}
                        className="shrink-0 whitespace-nowrap text-base font-bold tracking-[0.08em] text-white/85"
                      >
                        {logo}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <StickyProductDeck />

      <IntelligentAppsSection />

      <section className="border-b border-[#e6e8ec] bg-white">
        <div className="marketing-container py-20">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--marketing-ink)] md:text-4xl lg:text-5xl">
            Why teams pick EMP
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {whyPillars.slice(0, 4).map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-[#e6e8ec] bg-[#f7f8fa] p-6"
              >
                <h3 className="text-lg font-semibold text-[var(--marketing-ink)]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5c6777]">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
          <Button className="mt-8" variant="ghost" asChild>
            <Link to="/why-emp">
              Why EMP
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-[#f7f8fa]">
        <div className="marketing-container py-20">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--marketing-ink)] md:text-4xl lg:text-5xl">
            Customers of every size succeed with EMP
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {customerStories.map((story) => (
              <blockquote
                key={story.name}
                className="rounded-2xl border border-[#e6e8ec] bg-white p-6"
              >
                <p className="text-sm font-semibold text-[var(--marketing-cloud)]">
                  {story.focus}
                </p>
                <p className="mt-3 text-base leading-7 text-[var(--marketing-ink)]">
                  “{story.quote}”
                </p>
                <footer className="mt-4 text-sm text-[#5c6777]">
                  <span className="font-semibold text-[var(--marketing-ink)]">
                    {story.name}
                  </span>
                  {' · '}
                  {story.industry}
                </footer>
              </blockquote>
            ))}
          </div>
          <Button className="mt-8" variant="ghost" asChild>
            <Link to="/customers">
              Customer stories
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </section>

      <AccuracyCtaSection />
    </main>
  )
}
