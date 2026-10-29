import { useQuery } from '@tanstack/react-query'
import {
  fetchLeaveRequests,
  filterMyLeave,
  leaveKeys,
} from '@/api/leave'
import { ActionCard, DashboardShell } from '@/features/dashboard/dashboard-shared'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function EmployeeDashboard() {
  const { user } = useAuth()
  const leaveQuery = useQuery({
    queryKey: leaveKeys.list('mine'),
    queryFn: fetchLeaveRequests,
  })
  const mine = user ? filterMyLeave(leaveQuery.data ?? [], user.id) : []
  const open = mine.filter(
    (item) =>
      item.status === 'submitted' ||
      item.status === 'manager_approved' ||
      item.status === 'returned',
  )

  return (
    <DashboardShell
      title="My workspace"
      description="Self-service home for leave, calendar, and personal status."
      actions={
        <Button asChild>
          <Link to="/leave/request">Request leave</Link>
        </Button>
      }
      stats={[
        {
          label: 'Open leave requests',
          value: open.length,
          href: '/leave/mine',
          delta: { value: 'In progress', trend: open.length ? 'up' : 'flat' },
        },
        {
          label: 'Leave balance (demo)',
          value: '18d',
          delta: { value: 'Vacation remaining', trend: 'flat' },
        },
        { label: 'Calendar', value: 'Open', href: '/calendar' },
        {
          label: 'Profile',
          value: 'View',
          href: '/profile',
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent leave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mine.length === 0 ? (
              <p className="text-sm text-text-secondary">
                You have not submitted leave yet.
              </p>
            ) : (
              mine.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-surface-hover px-3 py-2 text-sm"
                >
                  <span>
                    {item.type} · {item.status.replaceAll('_', ' ')}
                  </span>
                  <span className="text-text-muted">{item.startDate}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <ActionCard
          title="Submit a leave request"
          body="Start the leave workflow. Your manager reviews first, then HR verifies."
          to="/leave/request"
          label="Request leave"
        />
      </div>
    </DashboardShell>
  )
}
