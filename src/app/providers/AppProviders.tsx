import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import { queryClient } from '@/api/query-client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/useAuth'
import { TenantProvider } from '@/hooks/useTenant'

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <TooltipProvider delayDuration={200}>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              richColors={false}
              closeButton
              toastOptions={{
                className: 'bg-surface-elevated text-text-primary shadow-sm',
              }}
            />
          </TooltipProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
