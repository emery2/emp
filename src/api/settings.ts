import { delay } from '@/mocks/delay'
import {
  brandingSettings,
  departments,
  orgSettings,
  orgUsers,
} from '@/mocks/settings'
import {
  readStoredBranding,
  writeStoredBranding,
} from '@/lib/branding-storage'
import type {
  BrandingSettings,
  Department,
  OrgSettings,
  OrgUser,
} from '@/types'

export const settingsKeys = {
  org: ['settings', 'org'] as const,
  branding: ['settings', 'branding'] as const,
  departments: ['settings', 'departments'] as const,
  users: ['settings', 'users'] as const,
}

let orgState = { ...orgSettings }
let brandingState: BrandingSettings = {
  ...brandingSettings,
  ...(readStoredBranding() ?? {}),
}

export async function fetchOrgSettings(): Promise<OrgSettings> {
  await delay()
  return { ...orgState }
}

export async function updateOrgSettings(
  next: OrgSettings,
): Promise<OrgSettings> {
  await delay()
  orgState = { ...next }
  return { ...orgState }
}

export async function fetchBranding(): Promise<BrandingSettings> {
  await delay()
  return { ...brandingState }
}

export async function updateBranding(
  next: BrandingSettings,
): Promise<BrandingSettings> {
  await delay()
  brandingState = { ...next }
  writeStoredBranding(brandingState)
  return { ...brandingState }
}

export async function fetchDepartments(): Promise<Department[]> {
  await delay()
  return departments
}

export async function fetchOrgUsers(): Promise<OrgUser[]> {
  await delay()
  return orgUsers
}
