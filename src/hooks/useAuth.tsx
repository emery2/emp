import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  clearSession,
  listDemoAccounts,
  mockLogin,
  mockSwitchUser,
  readSessionUser,
  writeSessionUser,
} from '@/mocks/auth'
import type { AppUser } from '@/types/access'

interface AuthContextValue {
  user: AppUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  switchDemoUser: (userId: string) => Promise<void>
  logout: () => void
  demoAccounts: AppUser[]
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => readSessionUser())

  const login = useCallback(async (email: string, password: string) => {
    const next = await mockLogin(email, password)
    writeSessionUser(next)
    setUser(next)
  }, [])

  const switchDemoUser = useCallback(async (userId: string) => {
    const next = await mockSwitchUser(userId)
    writeSessionUser(next)
    setUser(next)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      switchDemoUser,
      logout,
      demoAccounts: listDemoAccounts(),
    }),
    [user, login, switchDemoUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
