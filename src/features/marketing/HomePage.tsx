import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  customerStories,
  homeProductStrip,
  whyPillars,
} from '@/features/marketing/content'
import { StickyProductDeck } from '@/features/marketing/StickyProductDeck'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated } = useAuth()
  const primaryTo = isAuthenticated ? '/app' : '/login'

  return (
    <main>
      <section className="border-b border-divider bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl motion-safe:animate-[fade-up_500ms_ease-out]">
            <p className="text-overline uppercase tracking-[0.18em] text-primary">
              Enterprise Management Platform
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight text-text-primary md:text-6xl lg:text-7xl">
              EMP
            </h1>
            <p className="mt-5 max-w-2xl text-2xl font-medium leading-snug text-text-primary md:text-3xl">
              Your people, customers, and work—on one suite you assemble.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary md:text-lg">
              Like the big cloud application suites, EMP is modular. Start with
              HR and CRM, then add services when you are ready. Shared core.
              Hierarchy-aware permissions. Demo in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to={primaryTo}>
                  {isAuthenticated ? 'Open workspace' : 'Start free demo'}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link to="/products">Explore products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-divider bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <p className="mb-4 text-overline uppercase tracking-wide text-text-muted">
            See what is possible when every part of your business works together
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {homeProductStrip.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.id}
                  to={`/products/${item.slug}`}
                  className="flex min-w-[7.5rem] flex-col items-center gap-2 bg-surface px-4 py-4 text-center transition-colors hover:bg-surface-hover"
                >
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  <span className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <StickyProductDeck />

      <section className="border-b border-divider bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Why teams pick EMP
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {whyPillars.slice(0, 4).map((pillar) => (
              <article key={pillar.title} className="bg-surface p-6">
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
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

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Customers of every size succeed with EMP
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {customerStories.map((story) => (
              <blockquote key={story.name} className="bg-background p-6">
                <p className="text-sm font-semibold text-primary">{story.focus}</p>
                <p className="mt-3 text-base leading-7 text-text-primary">
                  “{story.quote}”
                </p>
                <footer className="mt-4 text-sm text-text-secondary">
                  <span className="font-semibold text-text-primary">
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
    </main>
  )
}
