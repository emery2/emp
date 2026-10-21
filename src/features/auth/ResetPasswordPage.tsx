import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    password: z.string().min(8, 'At least 8 characters'),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

type FormValues = z.infer<typeof schema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
  })

  const onSubmit = form.handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    toast.success('Password updated')
    navigate('/login')
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <h2 className="text-lg font-semibold">Reset password</h2>
        <p className="text-sm text-text-secondary">
          Choose a new password for your EMP account.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" type="password" {...form.register('password')} />
        {form.formState.errors.password ? (
          <p className="text-xs text-danger">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input id="confirm" type="password" {...form.register('confirm')} />
        {form.formState.errors.confirm ? (
          <p className="text-xs text-danger">
            {form.formState.errors.confirm.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="w-full">
        Update password
      </Button>
      <Link to="/login" className="block text-sm text-primary hover:underline">
        Back to sign in
      </Link>
    </form>
  )
}
