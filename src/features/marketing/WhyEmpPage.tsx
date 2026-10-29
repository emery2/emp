import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { whyPillars } from '@/features/marketing/content'

export function WhyEmpPage() {
  return (
    <main>
      <section className="border-b border-divider bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-overline uppercase tracking-wide text-primary">
            Why EMP
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Suite economics without suite lock-in
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">
            EMP borrows the clarity of major cloud application suites—separate
            product pages, a shared platform story—while staying modular: enable
            only the services you need on an always-on core.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {whyPillars.map((pillar) => (
              <article key={pillar.title} className="bg-surface p-8">
                <h2 className="text-xl font-semibold text-text-primary">
                  {pillar.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/products">Browse products</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/login">Open demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
