import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import { queryClient } from '@/api/query-client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/useAuth'
import { FeatureFlagsProvider } from '@/hooks/useFeatureFlags'
import { TenantProvider } from '@/hooks/useTenant'
import { ThemeProvider } from '@/hooks/useTheme'

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FeatureFlagsProvider>
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
        </FeatureFlagsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
