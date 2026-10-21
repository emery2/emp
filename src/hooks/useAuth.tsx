import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { demoUsers } from '@/mocks/users'
import type { User } from '@/types'

const SESSION_KEY = 'emp-session'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ requiresMfa: boolean }>
  completeMfa: (code: string) => Promise<void>
  logout: () => void
  pendingEmail: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): User | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readSession())
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    if (!password) {
      throw new Error('Password is required')
    }
    const match =
      demoUsers.find(
        (item) => item.email.toLowerCase() === email.toLowerCase(),
      ) ?? demoUsers[0]
    setPendingEmail(match.email)
    return { requiresMfa: true }
  }, [])

  const completeMfa = useCallback(
    async (code: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      if (code.trim().length < 6) {
        throw new Error('Enter the 6-digit verification code')
      }
      const match =
        demoUsers.find((item) => item.email === pendingEmail) ?? demoUsers[0]
      setUser(match)
      localStorage.setItem(SESSION_KEY, JSON.stringify(match))
      setPendingEmail(null)
    },
    [pendingEmail],
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      completeMfa,
      logout,
      pendingEmail,
    }),
    [user, login, completeMfa, logout, pendingEmail],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
