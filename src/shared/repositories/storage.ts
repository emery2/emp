/** localStorage with in-memory fallback (Vitest node / SSR). */

const memory = new Map<string, string>()

function hasLocalStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage !== null
  } catch {
    return false
  }
}

export function storageGet(key: string): string | null {
  if (hasLocalStorage()) {
    try {
      return localStorage.getItem(key)
    } catch {
      /* fall through */
    }
  }
  return memory.get(key) ?? null
}

export function storageSet(key: string, value: string): void {
  memory.set(key, value)
  if (hasLocalStorage()) {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* memory already set */
    }
  }
}

export function storageRemove(key: string): void {
  memory.delete(key)
  if (hasLocalStorage()) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  }
}
