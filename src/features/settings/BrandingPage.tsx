import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  fetchBranding,
  settingsKeys,
  updateBranding,
} from '@/api/settings'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

const schema = z.object({
  primaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, 'Use a hex color like #0070F2'),
  logoUrl: z.string().url().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

export function BrandingPage() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: settingsKeys.branding,
    queryFn: fetchBranding,
  })
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (query.data) {
      form.reset({
        primaryColor: query.data.primaryColor,
        logoUrl: query.data.logoUrl ?? '',
      })
    }
  }, [query.data, form])

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateBranding({
        primaryColor: values.primaryColor,
        logoUrl: values.logoUrl || undefined,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.branding, data)
      document.documentElement.style.setProperty('--primary', data.primaryColor)
      document.documentElement.style.setProperty('--ring', data.primaryColor)
      document.documentElement.style.setProperty('--info', data.primaryColor)
      document.documentElement.style.setProperty(
        '--sidebar-active-accent',
        data.primaryColor,
      )
      toast.success('Branding updated')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  if (query.isLoading) return <Skeleton className="h-64 w-full max-w-2xl" />
  if (query.isError) {
    return (
      <QueryError
        message={query.error.message}
        onRetry={() => void query.refetch()}
      />
    )
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Branding"
        description="Tenant primary color and logo. Applied via CSS variables."
      />
      <form
        className="space-y-4 bg-surface p-4 md:p-6"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary color</Label>
          <div className="flex items-center gap-3">
            <Input id="primaryColor" {...form.register('primaryColor')} />
            <span
              className="h-9 w-9 shrink-0 rounded-md"
              style={{ backgroundColor: form.watch('primaryColor') }}
              aria-hidden
            />
          </div>
          {form.formState.errors.primaryColor ? (
            <p className="text-xs text-danger">
              {form.formState.errors.primaryColor.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL (optional)</Label>
          <Input id="logoUrl" placeholder="https://…" {...form.register('logoUrl')} />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              query.data &&
              form.reset({
                primaryColor: query.data.primaryColor,
                logoUrl: query.data.logoUrl ?? '',
              })
            }
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
