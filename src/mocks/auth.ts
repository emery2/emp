import { delay } from '@/mocks/delay'
import { demoUsers, findUserByEmail, findUserById } from '@/mocks/users'
import type { AppUser } from '@/types/access'

const SESSION_KEY = 'emp-session-v2'

export async function mockLogin(
  email: string,
  password: string,
): Promise<AppUser> {
  await delay(300)
  if (!password) throw new Error('Password is required')
  const user = findUserByEmail(email)
  if (!user || !user.isActive) {
    throw new Error('Invalid email or inactive account')
  }
  // Demo auth only — any non-empty password accepted for known users
  return user
}

export async function mockSwitchUser(userId: string): Promise<AppUser> {
  await delay(150)
  const user = findUserById(userId)
  if (!user || !user.isActive) throw new Error('User not found')
  return user
}

export function readSessionUser(): AppUser | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { id: string }
    return findUserById(parsed.id) ?? null
  } catch {
    return null
  }
}

export function writeSessionUser(user: AppUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id }))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function listDemoAccounts(): AppUser[] {
  return demoUsers.filter((user) => user.isActive)
}
