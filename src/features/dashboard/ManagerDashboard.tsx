import { useQuery } from '@tanstack/react-query'
import {
  fetchLeaveRequests,
  filterManagerQueue,
  leaveKeys,
} from '@/api/leave'
import { ActionCard, DashboardShell } from '@/features/dashboard/dashboard-shared'
import { useAuth } from '@/hooks/useAuth'
import { getDirectReports } from '@/mocks/users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ManagerDashboard() {
  const { user } = useAuth()
  const leaveQuery = useQuery({
    queryKey: leaveKeys.list('manager'),
    queryFn: fetchLeaveRequests,
  })

  const queue = user
    ? filterManagerQueue(leaveQuery.data ?? [], user)
    : []
  const reports = user ? getDirectReports(user.id) : []

  return (
    <DashboardShell
      title="Manager dashboard"
      description="Department people leadership, coverage, and leave approvals."
      stats={[
        {
          label: 'Leave awaiting you',
          value: queue.length,
          href: '/leave/manager',
          delta: { value: 'Review queue', trend: queue.length ? 'up' : 'flat' },
        },
        {
          label: 'Direct reports',
          value: reports.length,
          href: '/people/employees',
          delta: { value: 'Team size', trend: 'flat' },
        },
        { label: 'Coverage risk', value: queue.length > 2 ? 'High' : 'Low' },
        { label: 'Team calendar', value: 'Open', href: '/calendar' },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Approval queue preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.length === 0 ? (
              <p className="text-sm text-text-secondary">No leave waiting on you.</p>
            ) : (
              queue.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-surface-hover px-3 py-2 text-sm"
                >
                  <span>
                    {item.requesterName} · {item.type}
                  </span>
                  <span className="text-text-muted">
                    {item.startDate} → {item.endDate}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <ActionCard
          title="Manager leave approvals"
          body="Approve, reject, or return department leave requests assigned to you."
          to="/leave/manager"
          label="Open approvals"
        />
      </div>
    </DashboardShell>
  )
}
