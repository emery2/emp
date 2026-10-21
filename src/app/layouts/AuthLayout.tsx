import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface p-6 md:p-8">
        <div className="mb-6">
          <p className="text-overline uppercase tracking-wide text-text-muted">
            Enterprise Management Platform
          </p>
          <h1 className="mt-1 text-2xl font-bold text-text-primary">EMP</h1>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
