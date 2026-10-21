import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    setSent(true)
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <h2 className="text-lg font-semibold">Forgot password</h2>
        <p className="text-sm text-text-secondary">
          We’ll send a reset link if the account exists.
        </p>
      </div>
      {sent ? (
        <p className="text-sm text-success">
          If an account exists for that email, a reset link has been sent.
        </p>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register('email')} />
          {form.formState.errors.email ? (
            <p className="text-xs text-danger">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
      )}
      {!sent ? (
        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      ) : null}
      <Link to="/login" className="block text-sm text-primary hover:underline">
        Back to sign in
      </Link>
      <Link
        to="/reset-password"
        className="block text-sm text-text-secondary hover:text-primary"
      >
        Have a token? Reset password
      </Link>
    </form>
  )
}
