import type {
  EmployeeProfileRecord,
  ProfileChangeRequest,
  ProfileFieldHistoryEntry,
  ProfileFieldValues,
} from '@/types/profile'
import { storageGet, storageSet } from '@/shared/repositories/storage'

const STORAGE_PROFILES = 'emp-employee-profiles-v1'
const STORAGE_REQUESTS = 'emp-profile-change-requests-v1'
const STORAGE_HISTORY = 'emp-profile-field-history-v1'

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = storageGet(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeStore(key: string, value: unknown): void {
  storageSet(key, JSON.stringify(value))
}

function seedProfiles(): EmployeeProfileRecord[] {
  const now = new Date().toISOString()
  const base = (
    userId: string,
    values: Partial<ProfileFieldValues> &
      Pick<ProfileFieldValues, 'legalName' | 'jobTitle' | 'departmentId'>,
  ): EmployeeProfileRecord => ({
    id: `profile-${userId}`,
    tenantId: 'tenant-norf',
    userId,
    updatedAt: now,
    values: {
      phone: '',
      personalEmail: '',
      address: '',
      emergencyContact: '',
      nationalId: '',
      bankDetails: '',
      salary: '••••',
      managerId: '',
      roleIds: '',
      ...values,
    },
  })

  return [
    base('user-employee', {
      legalName: 'Sofia Alvarez',
      jobTitle: 'Software Engineer',
      departmentId: 'dept-eng',
      managerId: 'user-hod-eng',
      phone: '+49 30 555 2001',
      personalEmail: 'sofia.personal@example.com',
      address: 'Oranienstr. 12, Berlin',
      emergencyContact: 'Carlos Alvarez +49 170 555 01',
      nationalId: 'DE-XX-90421',
      bankDetails: 'DE89 ···· 3000',
      salary: '72000 EUR',
      roleIds: 'regular_employee',
    }),
    base('user-hr', {
      legalName: 'Mei Tanaka',
      jobTitle: 'HR Officer',
      departmentId: 'dept-people',
      managerId: 'user-hr-head',
      phone: '+49 30 555 0220',
      personalEmail: 'mei.personal@example.com',
      address: 'Friedrichstr. 88, Berlin',
      emergencyContact: 'Kenji Tanaka +81 90 555 02',
      nationalId: 'DE-XX-77102',
      bankDetails: 'DE12 ···· 1100',
      salary: '68000 EUR',
      roleIds: 'hr_officer',
    }),
    base('user-hr-head', {
      legalName: 'Ava Chen',
      jobTitle: 'HR Head',
      departmentId: 'dept-people',
      managerId: 'user-ceo',
      phone: '+49 30 555 0300',
      personalEmail: 'ava.personal@example.com',
      address: 'Unter den Linden 1, Berlin',
      emergencyContact: 'Li Chen +49 170 555 03',
      nationalId: 'DE-XX-55001',
      bankDetails: 'DE55 ···· 2200',
      salary: '98000 EUR',
      roleIds: 'hr_head',
    }),
    base('user-hod-eng', {
      legalName: 'Priya Nair',
      jobTitle: 'Head of Engineering',
      departmentId: 'dept-eng',
      managerId: 'user-ceo',
      phone: '+49 30 555 0142',
      personalEmail: 'priya.personal@example.com',
      address: 'Kreuzberg, Berlin',
      emergencyContact: 'Ravi Nair +49 170 555 04',
      nationalId: 'DE-XX-10420',
      bankDetails: 'DE40 ···· 4400',
      salary: '110000 EUR',
      roleIds: 'head_of_department',
    }),
    base('user-ceo', {
      legalName: 'Marcus Klein',
      jobTitle: 'Chief Executive Officer',
      departmentId: 'dept-exec',
      managerId: '',
      phone: '+49 30 555 0001',
      personalEmail: 'marcus.personal@example.com',
      address: 'Charlottenburg, Berlin',
      emergencyContact: 'Elena Klein +49 170 555 05',
      nationalId: 'DE-XX-00001',
      bankDetails: 'DE01 ···· 0001',
      salary: 'Confidential',
      roleIds: 'ceo_executive',
    }),
    // Second tenant sample for isolation tests
    {
      id: 'profile-apex-1',
      tenantId: 'tenant-apex',
      userId: 'user-apex-emp',
      updatedAt: now,
      values: {
        phone: '+1 555 0100',
        personalEmail: 'apex.emp@example.com',
        address: 'Austin, TX',
        emergencyContact: 'N/A',
        legalName: 'Apex Employee',
        nationalId: 'US-XX-1',
        bankDetails: '••••',
        jobTitle: 'Operator',
        salary: '50000 USD',
        departmentId: 'dept-ops',
        managerId: '',
        roleIds: 'regular_employee',
      },
    },
  ]
}

let profiles: EmployeeProfileRecord[] = readStore(
  STORAGE_PROFILES,
  seedProfiles(),
)
let requests: ProfileChangeRequest[] = readStore(STORAGE_REQUESTS, [])
let history: ProfileFieldHistoryEntry[] = readStore(STORAGE_HISTORY, [])

function persist(): void {
  writeStore(STORAGE_PROFILES, profiles)
  writeStore(STORAGE_REQUESTS, requests)
  writeStore(STORAGE_HISTORY, history)
}

let seq = 0
export function createProfileRequestId(): string {
  seq += 1
  return `pcr-${Date.now()}-${seq}`
}

export function createProfileDecisionId(): string {
  seq += 1
  return `pcd-${Date.now()}-${seq}`
}

export function createProfileHistoryId(): string {
  seq += 1
  return `pfh-${Date.now()}-${seq}`
}

export interface ProfileRepository {
  getProfileByUserId(
    tenantId: string,
    userId: string,
  ): EmployeeProfileRecord | undefined
  listProfiles(tenantId: string): EmployeeProfileRecord[]
  saveProfile(profile: EmployeeProfileRecord): EmployeeProfileRecord
  listRequests(tenantId: string): ProfileChangeRequest[]
  getRequest(
    tenantId: string,
    id: string,
  ): ProfileChangeRequest | undefined
  saveRequest(request: ProfileChangeRequest): ProfileChangeRequest
  listHistory(tenantId: string, userId: string): ProfileFieldHistoryEntry[]
  appendHistory(entry: ProfileFieldHistoryEntry): void
}

export const mockProfileRepository: ProfileRepository = {
  getProfileByUserId(tenantId, userId) {
    return profiles.find((p) => p.tenantId === tenantId && p.userId === userId)
  },

  listProfiles(tenantId) {
    return profiles.filter((p) => p.tenantId === tenantId)
  },

  saveProfile(profile) {
    const idx = profiles.findIndex((p) => p.id === profile.id)
    if (idx >= 0) profiles[idx] = profile
    else profiles.push(profile)
    persist()
    return profile
  },

  listRequests(tenantId) {
    return requests
      .filter((r) => r.tenantId === tenantId)
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  getRequest(tenantId, id) {
    return requests.find((r) => r.tenantId === tenantId && r.id === id)
  },

  saveRequest(request) {
    const idx = requests.findIndex((r) => r.id === request.id)
    if (idx >= 0) requests[idx] = request
    else requests.push(request)
    persist()
    return request
  },

  listHistory(tenantId, userId) {
    return history
      .filter((h) => h.tenantId === tenantId && h.userId === userId)
      .slice()
      .sort((a, b) => b.at.localeCompare(a.at))
  },

  appendHistory(entry) {
    history.push(entry)
    persist()
  },
}

export function __resetProfileStoreForTests(): void {
  profiles = seedProfiles()
  requests = []
  history = []
  persist()
}
