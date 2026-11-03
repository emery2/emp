import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { StickyProductDeck } from '@/features/marketing/StickyProductDeck'

export function ProductsPage() {
  return (
    <main>
      <section className="border-b border-divider bg-surface">
        <div className="marketing-container py-14 md:py-20">
          <p className="text-overline uppercase tracking-wide text-primary">
            Products
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            EMP Cloud Applications
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary">
            Scroll the stacked deck to move through each service, or open a
            product page for full detail.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/login">Get started</Link>
          </Button>
        </div>
      </section>
      <StickyProductDeck />
    </main>
  )
}
