import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  fetchOrgSettings,
  settingsKeys,
  updateOrgSettings,
} from '@/api/settings'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

const schema = z.object({
  name: z.string().min(2),
  legalName: z.string().min(2),
  website: z.string().url(),
  industry: z.string().min(2),
  timezone: z.string().min(2),
  address: z.string().min(2),
})

type FormValues = z.infer<typeof schema>

export function OrganizationPage() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: settingsKeys.org,
    queryFn: fetchOrgSettings,
  })
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (query.data) form.reset(query.data)
  }, [query.data, form])

  const mutation = useMutation({
    mutationFn: updateOrgSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.org, data)
      toast.success('Organization updated')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  if (query.isLoading) {
    return <Skeleton className="h-80 w-full max-w-4xl" />
  }

  if (query.isError) {
    return (
      <QueryError
        message={query.error.message}
        onRetry={() => void query.refetch()}
      />
    )
  }

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Organization"
        description="Legal and operational profile for this tenant."
      />
      <form
        className="space-y-4 bg-surface p-4 md:p-6"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        {(
          [
            ['name', 'Organization name'],
            ['legalName', 'Legal name'],
            ['website', 'Website'],
            ['industry', 'Industry'],
            ['timezone', 'Timezone'],
            ['address', 'Address'],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input id={key} {...form.register(key)} />
            {form.formState.errors[key] ? (
              <p className="text-xs text-danger">
                {form.formState.errors[key]?.message}
              </p>
            ) : null}
          </div>
        ))}
        <div className="sticky bottom-0 flex justify-end gap-2 bg-surface py-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => query.data && form.reset(query.data)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}
