import { useQuery } from '@tanstack/react-query'
import {
  ChevronDown,
  Filter,
  Plus,
  Share2,
  Sparkles,
  Star,
} from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { dashboardKeys, fetchCrmOverview } from '@/api/dashboard'
import {
  DashboardWidget,
  FilterPill,
} from '@/features/dashboard/DashboardWidget'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

const TEAL = '#005e5e'
const MEETING = '#a0ced9'
const TASK = '#c84e8e'

function ToolbarChip({
  children,
  active,
}: {
  children: ReactNode
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'border-[#cbd6e2] bg-white text-[#33475b] shadow-sm'
          : 'border-transparent bg-transparent text-[#516f90] hover:bg-white/80',
      )}
    >
      {children}
    </button>
  )
}

export function CrmDataOverview() {
  const overviewQuery = useQuery({
    queryKey: dashboardKeys.crmOverview,
    queryFn: fetchCrmOverview,
  })

  const data = overviewQuery.data
  const stageTotal =
    data?.dealsByStage.reduce((sum, stage) => sum + stage.value, 0) ?? 0

  return (
    <div className="min-h-full rounded-2xl border border-[#eaf0f6] bg-white p-5 shadow-sm md:p-7">
      <div className="flex flex-col gap-4 border-b border-[#eaf0f6] pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#33475b] md:text-[1.75rem]">
              CRM Data Overview
            </h1>
            <button
              type="button"
              className="rounded p-1 text-[#99acc2] hover:bg-[#f5f8fa] hover:text-[#ff7a59]"
              aria-label="Favorite dashboard"
            >
              <Star className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-semibold text-[#516f90] hover:bg-[#f5f8fa]"
            >
              Switch
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
          <p className="mt-1 text-sm text-[#516f90]">
            Contacts, deals, activity, and tickets in one customizable board.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[#516f90]">
            Explore reports
          </Button>
          <Button variant="ghost" size="sm" className="text-[#516f90]">
            Create dashboard
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-[#516f90]">
            Actions
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-[#516f90]">
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Share
          </Button>
          <Button
            size="sm"
            className="gap-1 bg-[#005e5e] text-white hover:bg-[#004848]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add content
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1 rounded-xl bg-[#f5f8fa] p-1.5">
        <ToolbarChip active>
          <Filter className="h-3.5 w-3.5" strokeWidth={1.75} />
          Quick filters
        </ToolbarChip>
        <ToolbarChip>
          Owners
          <ChevronDown className="h-3 w-3" strokeWidth={1.75} />
        </ToolbarChip>
        <ToolbarChip>
          Date range
          <ChevronDown className="h-3 w-3" strokeWidth={1.75} />
        </ToolbarChip>
        <ToolbarChip>
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
          Advanced filters
        </ToolbarChip>
      </div>

      {overviewQuery.isLoading || !data ? (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <DashboardWidget
              title="New Contacts Created"
              filters={['This entire month']}
              className="xl:col-span-3"
              updatedAt="Just now"
            >
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-4xl font-bold tracking-tight text-[#33475b]">
                  {data.newContactsThisMonth}
                </p>
                <p className="mt-2 text-sm text-[#516f90]">
                  Contacts created this month
                </p>
              </div>
            </DashboardWidget>

            <DashboardWidget
              title="Contacts Added Over Time"
              filters={['This entire month', 'Weekly']}
              className="xl:col-span-3"
              updatedAt="Just now"
            >
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.contactsAddedOverTime}>
                    <CartesianGrid
                      stroke="#eaf0f6"
                      vertical={false}
                      strokeDasharray="0"
                    />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#99acc2', fontSize: 11 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      width={24}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#99acc2', fontSize: 11 }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={TEAL}
                      strokeWidth={2}
                      dot={{ r: 3, fill: TEAL }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardWidget>

            <DashboardWidget
              title="Contact Sources"
              filters={['This entire month']}
              className="xl:col-span-6"
              updatedAt="1 minute ago"
            >
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.contactSources} barSize={36}>
                    <CartesianGrid
                      stroke="#eaf0f6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#516f90', fontSize: 11 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#99acc2', fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill={TEAL} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardWidget>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <DashboardWidget
              title="Deals Created Over Time"
              filters={['This entire month', 'Monthly']}
              className="xl:col-span-8"
              updatedAt="1 minute ago"
            >
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.dealsCreatedOverTime}>
                    <CartesianGrid stroke="#eaf0f6" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#99acc2', fontSize: 11 }}
                      label={{
                        value: 'Create Date',
                        position: 'insideBottom',
                        offset: -2,
                        fill: '#99acc2',
                        fontSize: 11,
                      }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#99acc2', fontSize: 11 }}
                      label={{
                        value: '(Count) Deals',
                        angle: -90,
                        position: 'insideLeft',
                        fill: '#99acc2',
                        fontSize: 11,
                      }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={TEAL}
                      strokeWidth={2}
                      dot={{ r: 4, fill: TEAL }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardWidget>

            <DashboardWidget
              title="Deals by Stage"
              filters={['This entire month']}
              className="xl:col-span-4"
              updatedAt="Just now"
            >
              <div className="flex h-52 flex-col items-center justify-center">
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.dealsByStage}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={48}
                        outerRadius={68}
                        paddingAngle={2}
                      >
                        {data.dealsByStage.map((stage) => (
                          <Cell
                            key={stage.label}
                            fill={stage.color ?? TEAL}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-1 w-full space-y-1">
                  {data.dealsByStage.slice(0, 3).map((stage) => (
                    <li
                      key={stage.label}
                      className="flex items-center justify-between text-xs text-[#516f90]"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: stage.color ?? TEAL }}
                        />
                        {stage.label}
                      </span>
                      <span className="font-semibold text-[#33475b]">
                        {stageTotal
                          ? Math.round((stage.value / stageTotal) * 100)
                          : 0}
                        %
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </DashboardWidget>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <DashboardWidget
              title="Activity Type Breakdown"
              filters={[
                'This entire month',
                'Compared To | Last month',
                'Filters (1)',
              ]}
              className="xl:col-span-4"
              updatedAt="2 minutes ago"
            >
              <ul className="divide-y divide-[#eaf0f6]">
                {data.activityBreakdown.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="text-sm font-medium text-[#33475b]">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-[#33475b]">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </DashboardWidget>

            <DashboardWidget
              title="Team Activity Summary"
              filters={['This entire month', 'Filters (1)']}
              className="xl:col-span-8"
              updatedAt="2 minutes ago"
            >
              <div className="mb-3 flex flex-wrap gap-3">
                <FilterPill className="gap-1.5 border-0 bg-transparent px-0">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: TEAL }}
                  />
                  Call
                </FilterPill>
                <FilterPill className="gap-1.5 border-0 bg-transparent px-0">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: MEETING }}
                  />
                  Meeting
                </FilterPill>
                <FilterPill className="gap-1.5 border-0 bg-transparent px-0">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: TASK }}
                  />
                  Task
                </FilterPill>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.teamActivity} barSize={64}>
                    <CartesianGrid stroke="#eaf0f6" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#516f90', fontSize: 11 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#99acc2', fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar dataKey="call" stackId="a" fill={TEAL} />
                    <Bar dataKey="meeting" stackId="a" fill={MEETING} />
                    <Bar
                      dataKey="task"
                      stackId="a"
                      fill={TASK}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardWidget>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <DashboardWidget
              title="Open Ticket Summary"
              filters={['This entire quarter', 'Filters (1)']}
              className="xl:col-span-8"
              updatedAt="2 minutes ago"
              empty={data.openTickets === 0}
            />
            <DashboardWidget
              title="Ticket Status Breakdown"
              filters={['This entire month']}
              className="xl:col-span-4"
              updatedAt="Just now"
              empty={data.ticketStatuses.length === 0}
            />
          </div>
        </div>
      )}

      <p className="mt-6 text-right text-[11px] text-[#99acc2]">
        Based on UTC +02:00
      </p>
    </div>
  )
}
