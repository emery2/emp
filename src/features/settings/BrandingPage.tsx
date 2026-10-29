import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Trash2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
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
import { applyBrandingToDocument } from '@/lib/branding-storage'
import { cn } from '@/lib/cn'

const schema = z.object({
  primaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, 'Use a hex color like #0070F2'),
  logoUrl: z.string().optional().or(z.literal('')),
  headerText: z.string().max(160, 'Keep header under 160 characters').optional(),
  footerText: z.string().max(200, 'Keep footer under 200 characters').optional(),
})

type FormValues = z.infer<typeof schema>

const fieldClass =
  'flex min-h-[80px] w-full border-0 border-b-2 border-transparent bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none'

export function BrandingPage() {
  const queryClient = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
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
        headerText: query.data.headerText ?? '',
        footerText: query.data.footerText ?? '',
      })
    }
  }, [query.data, form])

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateBranding({
        primaryColor: values.primaryColor,
        logoUrl: values.logoUrl || undefined,
        headerText: values.headerText?.trim() || undefined,
        footerText: values.footerText?.trim() || undefined,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.branding, data)
      applyBrandingToDocument(data)
      toast.success('Branding updated')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const logoUrl = form.watch('logoUrl')
  const primaryColor = form.watch('primaryColor')
  const headerText = form.watch('headerText')
  const footerText = form.watch('footerText')

  const onLogoFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Choose an image file (PNG, SVG, JPG, WebP)')
      return
    }
    if (file.size > 1_500_000) {
      toast.error('Logo must be under 1.5 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      form.setValue('logoUrl', String(reader.result), { shouldDirty: true })
    }
    reader.readAsDataURL(file)
  }

  if (query.isLoading) return <Skeleton className="h-64 w-full max-w-3xl" />
  if (query.isError) {
    return (
      <QueryError
        message={query.error.message}
        onRetry={() => void query.refetch()}
      />
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Branding"
        description="Logo, primary color, shell header, and footer for this organization."
      />
      <form
        className="space-y-6 bg-surface p-4 md:p-6"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary">Logo</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div
              className={cn(
                'flex h-20 w-40 items-center justify-center bg-surface-hover',
                !logoUrl && 'text-xs text-text-muted',
              )}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Organization logo preview"
                  className="max-h-16 max-w-[9rem] object-contain"
                />
              ) : (
                'No logo'
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="sr-only"
                onChange={(event) => onLogoFile(event.target.files?.[0])}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => fileRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  Upload logo
                </Button>
                {logoUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      form.setValue('logoUrl', '', { shouldDirty: true })
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
                    Remove
                  </Button>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Or paste image URL / data URL</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://… or data:image/…"
                  {...form.register('logoUrl')}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <Label htmlFor="primaryColor">Primary color</Label>
          <div className="flex items-center gap-3">
            <Input
              id="primaryColor"
              type="color"
              className="h-10 w-14 cursor-pointer p-1"
              value={primaryColor || '#0070F2'}
              onChange={(event) =>
                form.setValue('primaryColor', event.target.value.toUpperCase(), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              aria-label="Pick primary color"
            />
            <Input id="primaryColorHex" {...form.register('primaryColor')} />
            <span
              className="h-9 w-9 shrink-0"
              style={{ backgroundColor: primaryColor }}
              aria-hidden
            />
          </div>
          {form.formState.errors.primaryColor ? (
            <p className="text-xs text-danger">
              {form.formState.errors.primaryColor.message}
            </p>
          ) : null}
        </section>

        <section className="space-y-2">
          <Label htmlFor="headerText">Header text</Label>
          <textarea
            id="headerText"
            rows={2}
            className={fieldClass}
            placeholder="Shown under the shell bar across the app"
            {...form.register('headerText')}
          />
          {form.formState.errors.headerText ? (
            <p className="text-xs text-danger">
              {form.formState.errors.headerText.message}
            </p>
          ) : null}
        </section>

        <section className="space-y-2">
          <Label htmlFor="footerText">Footer text</Label>
          <textarea
            id="footerText"
            rows={2}
            className={fieldClass}
            placeholder="Legal line, contact, or confidentiality notice"
            {...form.register('footerText')}
          />
          {form.formState.errors.footerText ? (
            <p className="text-xs text-danger">
              {form.formState.errors.footerText.message}
            </p>
          ) : null}
        </section>

        <section className="space-y-2 border-t border-divider pt-4">
          <h2 className="text-sm font-semibold text-text-primary">Preview</h2>
          <div className="overflow-hidden bg-background">
            <div
              className="flex h-10 items-center gap-3 px-3"
              style={{ backgroundColor: primaryColor || '#0070F2' }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-6 max-w-[7rem] object-contain brightness-0 invert"
                />
              ) : (
                <span className="text-xs font-semibold text-white">LOGO</span>
              )}
              <span className="text-sm text-white/90">Shell bar</span>
            </div>
            {headerText?.trim() ? (
              <div className="bg-surface px-3 py-2 text-xs text-text-secondary">
                {headerText}
              </div>
            ) : null}
            <div className="px-3 py-6 text-xs text-text-muted">
              Page content…
            </div>
            {footerText?.trim() ? (
              <div className="border-t border-divider bg-surface px-3 py-2 text-[11px] text-text-muted">
                {footerText}
              </div>
            ) : null}
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              query.data &&
              form.reset({
                primaryColor: query.data.primaryColor,
                logoUrl: query.data.logoUrl ?? '',
                headerText: query.data.headerText ?? '',
                footerText: query.data.footerText ?? '',
              })
            }
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save branding'}
          </Button>
        </div>
      </form>
    </div>
  )
}
