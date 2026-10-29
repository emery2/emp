import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function MarketingStubPage({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <main>
      <section className="border-b border-divider bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-overline uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/products">Browse products</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/login">Get started</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export function IndustriesPage() {
  return (
    <MarketingStubPage
      eyebrow="Industries"
      title="Solutions by industry"
      body="Manufacturing, distribution, services, and more—EMP presets are bundles of modules, not hard-coded industry behavior."
    />
  )
}

export function EventsPage() {
  return (
    <MarketingStubPage
      eyebrow="Events"
      title="Events and webinars"
      body="Demo walkthroughs and release briefings will live here. For now, explore the product demo."
    />
  )
}

export function LearningPage() {
  return (
    <MarketingStubPage
      eyebrow="Learning"
      title="Learn EMP"
      body="Guides for roles, leave approval, and module entitlements. Start with the interactive demo and role switcher."
    />
  )
}

export function SupportPage() {
  return (
    <MarketingStubPage
      eyebrow="Support"
      title="Support"
      body="Help center and contact paths for tenants. Prototype: use the demo login or Contact us."
    />
  )
}

export function CompanyPage() {
  return (
    <MarketingStubPage
      eyebrow="Company"
      title="About EMP"
      body="Enterprise Management Platform—modular cloud applications that follow your organizational hierarchy."
    />
  )
}

export function ContactPage() {
  return (
    <MarketingStubPage
      eyebrow="Contact"
      title="Contact us"
      body="Reach the EMP team about demos, entitlements, and rollout. In this prototype, sign in with a demo account to explore the product."
    />
  )
}
