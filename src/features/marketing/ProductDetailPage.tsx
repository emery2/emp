import { ArrowRight, Check } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  getProductBySlug,
  marketingProducts,
} from '@/features/marketing/content'

export function ProductDetailPage() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)

  if (!product) return <Navigate to="/products" replace />

  const Icon = product.icon
  const others = marketingProducts.filter((item) => item.id !== product.id)

  return (
    <main>
      <section className="border-b border-divider bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-overline uppercase tracking-wide text-primary">
            Product
          </p>
          <div className="mt-4 flex items-start gap-4">
            <Icon className="mt-1 h-10 w-10 text-primary" strokeWidth={1.5} />
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {product.title}
              </h1>
              <p className="mt-3 max-w-2xl text-xl text-text-primary">
                {product.tagline}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
                {product.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/login">
                    Try in demo
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link to="/products">All products</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-divider bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <h2 className="text-2xl font-bold">What you get</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {product.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 bg-surface px-4 py-3 text-sm text-text-primary"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-success"
                  strokeWidth={1.5}
                />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <h2 className="text-2xl font-bold">Explore other applications</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {others.map((item) => (
              <Button key={item.id} variant="ghost" asChild>
                <Link to={`/products/${item.slug}`}>{item.shortTitle}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
