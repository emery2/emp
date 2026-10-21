import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { crmKeys, fetchContact } from '@/api/crm'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/lib/formatters'

export function ContactDetailPage() {
  const { id = '' } = useParams()
  const query = useQuery({
    queryKey: crmKeys.contact(id),
    queryFn: () => fetchContact(id),
    enabled: Boolean(id),
  })

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <QueryError
        message={query.error?.message ?? 'Contact not found'}
        onRetry={() => void query.refetch()}
      />
    )
  }

  const contact = query.data

  return (
    <div>
      <PageHeader
        title={`${contact.firstName} ${contact.lastName}`}
        description={`${contact.title} · ${contact.company}`}
        backTo="/customers/contacts"
        breadcrumbs={[
          { label: 'Customers', href: '/customers/contacts' },
          { label: 'Contacts', href: '/customers/contacts' },
          { label: `${contact.firstName} ${contact.lastName}` },
        ]}
        actions={
          <StatusBadge
            variant={contact.status === 'active' ? 'success' : 'neutral'}
            dot
          >
            {contact.status}
          </StatusBadge>
        }
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" value={contact.email} />
            <Field label="Phone" value={contact.phone} />
            <Field label="Company" value={contact.company} />
            <Field label="Owner" value={contact.ownerName} />
            <Field
              label="Lifetime value"
              value={formatCurrency(contact.lifetimeValue)}
            />
            <Field
              label="Last activity"
              value={formatDate(contact.lastActivityAt)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">
              {contact.notes ?? 'No notes yet.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm tabular-nums text-text-primary">{value}</p>
    </div>
  )
}
