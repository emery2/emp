import { useQuery } from '@tanstack/react-query'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { employeeKeys, fetchLeaveRequests } from '@/api/employees'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'
import type { StatusBadgeVariant } from '@/types'

const leaveStatusMap: Record<string, StatusBadgeVariant> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

export function CalendarPage() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const query = useQuery({
    queryKey: employeeKeys.leave('calendar'),
    queryFn: () => fetchLeaveRequests({ q: '' }),
  })

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [month])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, { id: string; title: string; status: string }[]>()
    for (const leave of query.data ?? []) {
      const start = parseISO(leave.startDate)
      const end = parseISO(leave.endDate)
      const range = eachDayOfInterval({ start, end })
      for (const day of range) {
        const key = format(day, 'yyyy-MM-dd')
        const list = map.get(key) ?? []
        list.push({
          id: `${leave.id}-${key}`,
          title: `${leave.employeeName} · ${leave.type}`,
          status: leave.status,
        })
        map.set(key, list)
      }
    }
    return map
  }, [query.data])

  const selectedDayEvents = useMemo(() => {
    const todayKey = format(new Date(), 'yyyy-MM-dd')
    return eventsByDay.get(todayKey) ?? []
  }, [eventsByDay])

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Team leave and schedule at a glance."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous month"
              onClick={() => setMonth((value) => subMonths(value, 1))}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <p className="min-w-[9rem] text-center text-sm font-semibold tabular-nums">
              {format(month, 'MMMM yyyy')}
            </p>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next month"
              onClick={() => setMonth((value) => addMonths(value, 1))}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMonth(startOfMonth(new Date()))}
            >
              Today
            </Button>
          </div>
        }
      />

      {query.isError ? (
        <QueryError
          message={query.error.message}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div className="bg-surface xl:col-span-3">
          <div className="grid grid-cols-7 border-b border-divider">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
              <div
                key={label}
                className="px-2 py-2 text-center text-xs font-semibold text-text-muted"
              >
                {label}
              </div>
            ))}
          </div>
          {query.isLoading ? (
            <div className="grid grid-cols-7 gap-px bg-divider">
              {Array.from({ length: 35 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-none" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-px bg-divider">
              {days.map((day) => {
                const key = format(day, 'yyyy-MM-dd')
                const events = eventsByDay.get(key) ?? []
                const inMonth = isSameMonth(day, month)
                const today = isSameDay(day, new Date())
                return (
                  <div
                    key={key}
                    className={cn(
                      'min-h-24 bg-surface p-2',
                      !inMonth && 'bg-background text-text-muted',
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={cn(
                          'inline-flex h-6 w-6 items-center justify-center text-xs tabular-nums',
                          today && 'bg-primary font-semibold text-primary-foreground',
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                      {events.length > 0 ? (
                        <CalendarDays
                          className="h-3.5 w-3.5 text-primary"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      ) : null}
                    </div>
                    <ul className="space-y-1">
                      {events.slice(0, 2).map((event) => (
                        <li
                          key={event.id}
                          className="truncate bg-info-subtle px-1.5 py-0.5 text-[11px] text-info"
                          title={event.title}
                        >
                          {event.title}
                        </li>
                      ))}
                      {events.length > 2 ? (
                        <li className="text-[11px] text-text-muted">
                          +{events.length - 2} more
                        </li>
                      ) : null}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <aside className="bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <h2 className="text-sm font-semibold">Today</h2>
          </div>
          {query.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : selectedDayEvents.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No leave scheduled for today.
            </p>
          ) : (
            <ul className="space-y-2">
              {selectedDayEvents.map((event) => (
                <li key={event.id} className="bg-background p-3">
                  <p className="text-sm font-medium text-text-primary">
                    {event.title}
                  </p>
                  <div className="mt-2">
                    <StatusBadge
                      variant={leaveStatusMap[event.status] ?? 'neutral'}
                      dot
                    >
                      {event.status}
                    </StatusBadge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  )
}
