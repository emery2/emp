import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  code: z.string().min(6, 'Enter the 6-digit code'),
})

type FormValues = z.infer<typeof schema>

export function MfaPage() {
  const { pendingEmail, completeMfa } = useAuth()
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '123456' },
  })

  if (!pendingEmail) return <Navigate to="/login" replace />

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await completeMfa(values.code)
      navigate('/')
    } catch (error) {
      form.setError('code', {
        message: error instanceof Error ? error.message : 'Invalid code',
      })
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <h2 className="text-lg font-semibold">Multi-factor authentication</h2>
        <p className="text-sm text-text-secondary">
          Enter the verification code sent to {pendingEmail}.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">Authentication code</Label>
        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          {...form.register('code')}
        />
        {form.formState.errors.code ? (
          <p className="text-xs text-danger">
            {form.formState.errors.code.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="w-full">
        Verify and continue
      </Button>
      <Link to="/login" className="block text-sm text-primary hover:underline">
        Use a different account
      </Link>
    </form>
  )
}
