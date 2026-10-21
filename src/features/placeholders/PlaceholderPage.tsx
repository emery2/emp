import { Construction } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export function PlaceholderPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="bg-surface">
        <EmptyState
          icon={Construction}
          title="Coming in a later phase"
          description="Navigation is wired; this module will use the same list/detail patterns as People and Customers."
        />
      </div>
    </div>
  )
}
