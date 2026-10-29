import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { fetchBranding, settingsKeys } from '@/api/settings'
import {
  applyBrandingToDocument,
  readStoredBranding,
} from '@/lib/branding-storage'

export function useBranding() {
  const query = useQuery({
    queryKey: settingsKeys.branding,
    queryFn: async () => {
      const stored = readStoredBranding()
      if (stored) return stored
      return fetchBranding()
    },
  })

  useEffect(() => {
    if (query.data) applyBrandingToDocument(query.data)
  }, [query.data])

  return query
}
