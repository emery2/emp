import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBranding, settingsKeys } from '@/api/settings'
import { tenants } from '@/mocks/tenants'
import type { Tenant } from '@/types'

interface TenantContextValue {
  tenant: Tenant
  tenants: Tenant[]
  setTenantId: (id: string) => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

function hexToPrimaryVars(hex: string) {
  document.documentElement.style.setProperty('--primary', hex)
  document.documentElement.style.setProperty('--ring', hex)
  document.documentElement.style.setProperty('--info', hex)
  document.documentElement.style.setProperty('--sidebar-active-accent', hex)
  document.documentElement.classList.add('tenant-branded')
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantIdState] = useState(
    () => localStorage.getItem('emp-tenant') ?? tenants[0].id,
  )

  const brandingQuery = useQuery({
    queryKey: settingsKeys.branding,
    queryFn: fetchBranding,
  })

  const tenant = tenants.find((item) => item.id === tenantId) ?? tenants[0]

  useEffect(() => {
    const color = brandingQuery.data?.primaryColor ?? tenant.primaryColor
    hexToPrimaryVars(color)
    if (brandingQuery.data?.logoUrl) {
      document.documentElement.style.setProperty(
        '--tenant-logo-url',
        `url(${brandingQuery.data.logoUrl})`,
      )
    }
  }, [brandingQuery.data, tenant.primaryColor])

  const setTenantId = useCallback((id: string) => {
    setTenantIdState(id)
    localStorage.setItem('emp-tenant', id)
  }, [])

  const value = useMemo(
    () => ({ tenant, tenants, setTenantId }),
    [tenant, setTenantId],
  )

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  )
}

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used within TenantProvider')
  return ctx
}
