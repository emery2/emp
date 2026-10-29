import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { BriefcaseBusiness } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  commercialKeys,
  createOpportunity,
  fetchOpportunities,
} from '@/api/commercial'
import { PermissionGate } from '@/access/guards'
import { DataTable } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/formatters'
import type { OpportunityRecord } from '@/types/commercial'
import type { StatusBadgeVariant } from '@/types'

const stageVariant: Record<OpportunityRecord['stage'], StatusBadgeVariant> = {
  qualify: 'info',
  propose: 'warning',
  negotiate: 'warning',
  won: 'success',
  lost: 'danger',
}

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  accountName: z.string().min(2, 'Account is required'),
  contactName: z.string().min(2, 'Contact is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  expectedCloseDate: z.string().min(1, 'Close date is required'),
})

type FormValues = z.infer<typeof schema>

export function OpportunitiesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [creating, setCreating] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      accountName: '',
      contactName: '',
      amount: 10000,
      expectedCloseDate: '',
    },
  })

  const query = useQuery({
    queryKey: commercialKeys.opportunities,
    queryFn: fetchOpportunities,
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!user) throw new Error('Not signed in')
      return createOpportunity(user, values)
    },
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: commercialKeys.opportunities })
      toast.success('Opportunity created')
      setCreating(false)
      form.reset()
      navigate(`/crm/opportunities/${created.id}`)
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const columns = useMemo<ColumnDef<OpportunityRecord>[]>(
    () => [
      { accessorKey: 'name', header: 'Opportunity' },
      { accessorKey: 'accountName', header: 'Account' },
      { accessorKey: 'ownerName', header: 'Owner' },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) =>
          formatCurrency(row.original.amount, row.original.currency),
      },
      {
        accessorKey: 'stage',
        header: 'Stage',
        cell: ({ row }) => (
          <StatusBadge variant={stageVariant[row.original.stage]} dot>
            {row.original.stage}
          </StatusBadge>
        ),
      },
      {
        id: 'quotation',
        header: 'Quotation',
        cell: ({ row }) =>
          row.original.quotationId ? (
            <Link
              className="text-primary hover:underline"
              to={`/erp/quotations/${row.original.quotationId}`}
              onClick={(event) => event.stopPropagation()}
            >
              {row.original.quotationId}
            </Link>
          ) : (
            <span className="text-text-muted">—</span>
          ),
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Opportunities"
        description="CRM pipeline records that can convert into ERP quotations."
        actions={
          <PermissionGate permission="crm.opportunities.manage">
            <Button onClick={() => setCreating((value) => !value)}>
              {creating ? 'Close form' : 'New opportunity'}
            </Button>
          </PermissionGate>
        }
      />

      {creating ? (
        <form
          className="mb-4 grid grid-cols-1 gap-3 bg-surface p-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountName">Account</Label>
            <Input id="accountName" {...form.register('accountName')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact</Label>
            <Input id="contactName" {...form.register('contactName')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (EUR)</Label>
            <Input id="amount" type="number" {...form.register('amount')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="expectedCloseDate">Expected close</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              {...form.register('expectedCloseDate')}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={mutation.isPending}>
              Create opportunity
            </Button>
          </div>
        </form>
      ) : null}

      <DataTable
        columns={columns}
        data={query.data ?? []}
        getRowId={(row) => row.id}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error instanceof Error ? query.error : null}
        onRetry={() => void query.refetch()}
        onRowClick={(row) => navigate(`/crm/opportunities/${row.id}`)}
        empty={{
          icon: BriefcaseBusiness,
          title: 'No opportunities',
          description: 'Create an opportunity to start the CRM → ERP path.',
        }}
      />
    </div>
  )
}
