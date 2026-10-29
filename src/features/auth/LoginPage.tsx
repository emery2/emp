import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { primaryDashboardPath } from '@/access/evaluate'
import { ROLE_DEFINITIONS, type RoleId } from '@/access/roles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { getDepartmentName } from '@/mocks/organization'
import { ACCESS_CONTROL_DISCLAIMER } from '@/types/access'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { login, switchDemoUser, demoAccounts } = useAuth()
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'employee@norf.example',
      password: 'password',
    },
  })

  const enterAs = async (userId: string) => {
    await switchDemoUser(userId)
    const account = demoAccounts.find((item) => item.id === userId)
    navigate(account ? primaryDashboardPath(account) : '/app')
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values.email, values.password)
      const session = demoAccounts.find(
        (account) =>
          account.email.toLowerCase() === values.email.toLowerCase(),
      )
      navigate(session ? primaryDashboardPath(session) : '/app')
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Login failed',
      })
    }
  })

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="text-sm text-text-secondary">
            Mock authentication for development. Password for all demos:{' '}
            <span className="font-medium text-text-primary">password</span>
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register('email')} />
          {form.formState.errors.email ? (
            <p className="text-xs text-danger">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...form.register('password')} />
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
          {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="border-t border-divider pt-4">
        <h3 className="text-sm font-semibold text-text-primary">Demo accounts</h3>
        <p className="mt-1 text-xs text-text-muted">
          Switch instantly between roles for development.
        </p>
        <ul className="mt-3 max-h-64 space-y-2 overflow-auto">
          {demoAccounts.map((account) => {
            const roleId = account.roleIds[0] as RoleId
            const roleLabel = ROLE_DEFINITIONS[roleId]?.label ?? account.roleIds[0]
            return (
              <li key={account.id}>
                <button
                  type="button"
                  className="w-full bg-surface-hover px-3 py-2 text-left hover:bg-sidebar-active"
                  onClick={() => void enterAs(account.id)}
                >
                  <p className="text-sm font-medium">
                    {account.firstName} {account.lastName}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {roleLabel} · {getDepartmentName(account.departmentId)}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-[11px] leading-4 text-text-muted">
          {ACCESS_CONTROL_DISCLAIMER}
        </p>
      </div>
    </div>
  )
}
