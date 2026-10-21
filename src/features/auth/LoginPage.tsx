import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { demoUsers } from '@/mocks/users'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: demoUsers[0].email,
      password: 'password',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await login(values.email, values.password)
      if (result.requiresMfa) navigate('/mfa')
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Login failed',
      })
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <h2 className="text-lg font-semibold">Sign in</h2>
        <p className="text-sm text-text-secondary">
          Use a demo account email. Any password works; MFA follows.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register('email')}
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-danger">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(form.formState.errors.password)}
          {...form.register('password')}
        />
        {form.formState.errors.password ? (
          <p className="text-xs text-danger">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>
      {form.formState.errors.root ? (
        <p className="text-sm text-danger">{form.formState.errors.root.message}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Signing in…' : 'Continue'}
      </Button>
      <div className="flex justify-between text-sm">
        <Link to="/forgot-password" className="text-primary hover:underline">
          Forgot password
        </Link>
        <span className="text-text-muted">Demo MFA code: 123456</span>
      </div>
    </form>
  )
}
