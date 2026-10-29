import { useQuery } from '@tanstack/react-query'
import {
  fetchLeaveRequests,
  filterHrQueue,
  leaveKeys,
} from '@/api/leave'
import { ActionCard, DashboardShell } from '@/features/dashboard/dashboard-shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function HrDashboard() {
  const leaveQuery = useQuery({
    queryKey: leaveKeys.list('hr'),
    queryFn: fetchLeaveRequests,
  })
  const queue = filterHrQueue(leaveQuery.data ?? [])
  const completed =
    leaveQuery.data?.filter((item) => item.status === 'completed').length ?? 0

  return (
    <DashboardShell
      title="HR operations"
      description="People operations queue with leave verification and directory access."
      stats={[
        {
          label: 'Awaiting HR verify',
          value: queue.length,
          href: '/leave/hr',
          delta: { value: 'Verification queue', trend: queue.length ? 'up' : 'flat' },
        },
        {
          label: 'Completed leave',
          value: completed,
          delta: { value: 'YTD verified', trend: 'flat' },
        },
        {
          label: 'Employees',
          value: 'Directory',
          href: '/people/employees',
        },
        {
          label: 'Request leave',
          value: 'Self-service',
          href: '/leave/request',
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>HR verification preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No manager-approved leave waiting on HR.
              </p>
            ) : (
              queue.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-surface-hover px-3 py-2 text-sm"
                >
                  <span>
                    {item.requesterName} · {item.days}d
                  </span>
                  <span className="text-text-muted">{item.type}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <ActionCard
            title="HR leave verification"
            body="Verify manager-approved leave before it is marked completed."
            to="/leave/hr"
            label="Open HR queue"
          />
          <ActionCard
            title="People directory"
            body="Browse employees across departments for HR operations."
            to="/people/employees"
            label="View employees"
          />
        </div>
      </div>
    </DashboardShell>
  )
}
