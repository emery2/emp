import { ShieldAlert } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ACCESS_CONTROL_DISCLAIMER } from '@/types/access'

export function AccessDeniedPage() {
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ?? 'this resource'

  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 py-16">
      <ShieldAlert className="h-10 w-10 text-warning" strokeWidth={1.5} />
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Access denied</h1>
        <p className="mt-2 text-sm text-text-secondary">
          You do not have permission to open {from}. Switch to a demo account
          with the required permission, or return to your dashboard.
        </p>
        <p className="mt-3 text-[11px] text-text-muted">
          {ACCESS_CONTROL_DISCLAIMER}
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/app">Go to dashboard</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/profile">View my permissions</Link>
        </Button>
      </div>
    </div>
  )
}
