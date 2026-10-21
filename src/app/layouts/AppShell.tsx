import { Outlet } from 'react-router-dom'
import { ShellBar } from '@/app/layouts/ShellBar'
import { SideNavigation } from '@/app/layouts/SideNavigation'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ShellProvider, useShell } from '@/hooks/useShell'

function ShellFrame() {
  const { mobileOpen, setMobileOpen } = useShell()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <ShellBar />
      <div className="flex min-h-0 flex-1">
        <div className="hidden md:block">
          <SideNavigation />
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SideNavigation onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        <main
          id="main-content"
          className="min-w-0 flex-1 overflow-auto bg-background p-4 md:p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function AppShell() {
  return (
    <ShellProvider>
      <ShellFrame />
    </ShellProvider>
  )
}
