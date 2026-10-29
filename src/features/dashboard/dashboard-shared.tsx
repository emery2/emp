import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardShell({
  title,
  description,
  actions,
  stats,
  children,
}: {
  title: string
  description: string
  actions?: React.ReactNode
  stats: Array<{
    label: string
    value: string | number
    delta?: { value: string; trend: 'up' | 'down' | 'flat' }
    href?: string
  }>
  children?: React.ReactNode
}) {
  return (
    <div>
      <PageHeader title={title} description={description} actions={actions} />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      {children}
    </div>
  )
}

export function ActionCard({
  title,
  body,
  to,
  label,
}: {
  title: string
  body: string
  to: string
  label: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-text-secondary">{body}</p>
        <Button asChild>
          <Link to={to}>{label}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
