import { useCallback, useState } from 'react'
import type { ViewMode } from '@/types/views'

export function useCollectionView(routeKey: string, allowed: ViewMode[], fallback: ViewMode) {
  const storageKey = `emp-view:${routeKey}`

  const [view, setViewState] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(storageKey) as ViewMode | null
    if (stored && allowed.includes(stored)) return stored
    return allowed.includes(fallback) ? fallback : allowed[0]
  })

  const setView = useCallback(
    (next: ViewMode) => {
      if (!allowed.includes(next)) return
      setViewState(next)
      localStorage.setItem(storageKey, next)
    },
    [allowed, storageKey],
  )

  return { view, setView, allowed }
}
