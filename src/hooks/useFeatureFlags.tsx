import { createContext, useContext, useMemo } from 'react'
import { defaultFeatureFlags } from '@/mocks/users'
import type { FeatureFlag } from '@/types'

interface FeatureFlagsContextValue {
  flags: Record<FeatureFlag, boolean>
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null)

export function FeatureFlagsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const value = useMemo(() => ({ flags: defaultFeatureFlags }), [])
  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagsContext)
  if (!ctx) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider')
  }
  return ctx
}
