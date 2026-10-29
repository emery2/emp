import { useQuery } from '@tanstack/react-query'
import { commercialKeys, fetchQuotations } from '@/api/commercial'
import { ActionCard, DashboardShell } from '@/features/dashboard/dashboard-shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'

export function FinanceDashboard() {
  const query = useQuery({
    queryKey: commercialKeys.quotations,
    queryFn: fetchQuotations,
  })
  const pending =
    query.data?.filter((item) => item.status === 'pending_finance') ?? []
  const approved =
    query.data?.filter((item) => item.status === 'approved' || item.status === 'sent') ??
    []
  const pendingValue = pending.reduce((sum, item) => sum + item.total, 0)

  return (
    <DashboardShell
      title="Finance dashboard"
      description="Quotation approvals, AR/AP visibility, and EPM inputs."
      stats={[
        {
          label: 'Quotes awaiting finance',
          value: pending.length,
          href: '/erp/quotations',
          delta: {
            value: formatCurrency(pendingValue, 'EUR'),
            trend: pending.length ? 'up' : 'flat',
          },
        },
        {
          label: 'Approved / sent',
          value: approved.length,
          href: '/erp/quotations',
        },
        { label: 'AR overview', value: 'Open', href: '/finance/ar' },
        { label: 'Budgets', value: 'Open', href: '/epm/budgets' },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending quotation approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pending.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No quotations waiting on finance.
              </p>
            ) : (
              pending.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-surface-hover px-3 py-2 text-sm"
                >
                  <span>
                    {item.number} · {item.accountName}
                  </span>
                  <span className="tabular-nums">
                    {formatCurrency(item.total, item.currency)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <ActionCard
          title="ERP quotations"
          body="Approve, reject, or return quotations converted from CRM opportunities."
          to="/erp/quotations"
          label="Open quotations"
        />
      </div>
    </DashboardShell>
  )
}
