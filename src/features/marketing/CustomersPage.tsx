import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { customerStories } from '@/features/marketing/content'

export function CustomersPage() {
  return (
    <main>
      <section className="border-b border-divider bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-overline uppercase tracking-wide text-primary">
            Customers
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Organizations that run on EMP
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary">
            Prototype stories from our demo tenants—same narrative pattern you
            see on suite vendor sites, grounded in EMP modules.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-14 md:px-8">
          {customerStories.map((story) => (
            <article key={story.name} className="bg-surface p-8 md:p-10">
              <p className="text-sm font-semibold text-primary">{story.focus}</p>
              <h2 className="mt-2 text-2xl font-bold text-text-primary">
                {story.name}
              </h2>
              <p className="text-sm text-text-muted">{story.industry}</p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-text-primary">
                “{story.quote}”
              </p>
            </article>
          ))}
          <Button asChild>
            <Link to="/login">Try the same demo paths</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
