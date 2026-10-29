import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { leaveKeys, submitLeaveRequest } from '@/api/leave'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import type { LeaveType } from '@/types/leave'

const schema = z.object({
  type: z.enum(['vacation', 'sick', 'personal', 'unpaid']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  days: z.coerce.number().min(0.5, 'At least 0.5 day'),
  reason: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const leaveTypes: LeaveType[] = ['vacation', 'sick', 'personal', 'unpaid']

export function LeaveRequestPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'vacation',
      startDate: '',
      endDate: '',
      days: 1,
      reason: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!user) throw new Error('Not signed in')
      return submitLeaveRequest(user, values)
    },
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: leaveKeys.all })
      toast.success('Leave request submitted')
      navigate(`/leave/${created.id}`)
    },
    onError: (error: Error) => toast.error(error.message),
  })

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Request leave"
        description="Submit a leave request for manager review, then HR verification."
      />
      <form
        className="space-y-4 bg-surface p-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="type">Leave type</Label>
          <select
            id="type"
            className="flex h-10 w-full bg-surface-hover px-3 text-sm"
            {...form.register('type')}
          >
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start date</Label>
            <Input id="startDate" type="date" {...form.register('startDate')} />
            {form.formState.errors.startDate ? (
              <p className="text-xs text-danger">
                {form.formState.errors.startDate.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End date</Label>
            <Input id="endDate" type="date" {...form.register('endDate')} />
            {form.formState.errors.endDate ? (
              <p className="text-xs text-danger">
                {form.formState.errors.endDate.message}
              </p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="days">Days</Label>
          <Input
            id="days"
            type="number"
            step="0.5"
            min="0.5"
            {...form.register('days')}
          />
          {form.formState.errors.days ? (
            <p className="text-xs text-danger">
              {form.formState.errors.days.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reason">Reason (optional)</Label>
          <Input id="reason" {...form.register('reason')} />
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting…' : 'Submit request'}
        </Button>
      </form>
    </div>
  )
}
