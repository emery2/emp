import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { employeeKeys, fetchEmployee } from '@/api/employees'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/formatters'
import type { StatusBadgeVariant } from '@/types'

const statusMap = {
  active: 'success',
  on_leave: 'warning',
  inactive: 'neutral',
} as const satisfies Record<string, StatusBadgeVariant>

export function EmployeeDetailPage() {
  const { id = '' } = useParams()
  const query = useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => fetchEmployee(id),
    enabled: Boolean(id),
  })

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <QueryError
        message={query.error?.message ?? 'Employee not found'}
        onRetry={() => void query.refetch()}
      />
    )
  }

  const employee = query.data

  return (
    <div>
      <PageHeader
        title={`${employee.firstName} ${employee.lastName}`}
        description={employee.title}
        backTo="/people/employees"
        breadcrumbs={[
          { label: 'People', href: '/people/employees' },
          { label: 'Employees', href: '/people/employees' },
          { label: `${employee.firstName} ${employee.lastName}` },
        ]}
        actions={
          <StatusBadge variant={statusMap[employee.status]} dot>
            {employee.status.replace('_', ' ')}
          </StatusBadge>
        }
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email" value={employee.email} />
                  <Field label="Phone" value={employee.phone} />
                  <Field label="Location" value={employee.location} />
                  <Field label="Department" value={employee.departmentName} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="employment">
              <Card>
                <CardHeader>
                  <CardTitle>Employment</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field label="Employee ID" value={employee.employeeNumber} mono />
                  <Field label="Manager" value={employee.managerName ?? '—'} />
                  <Field label="Hire date" value={formatDate(employee.hireDate)} />
                  <Field label="Title" value={employee.title} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Field label="Status" value={employee.status.replace('_', ' ')} />
            <Field label="Department" value={employee.departmentName} />
            <Field label="Location" value={employee.location} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className={mono ? 'font-mono text-sm' : 'text-sm text-text-primary'}>
        {value}
      </p>
    </div>
  )
}
