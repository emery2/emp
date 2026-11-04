import { beforeEach, describe, expect, it } from 'vitest'
import {
  assertProfileTransition,
  buildFieldChanges,
  canHrDecideProfileChange,
  canWithdrawProfileChange,
  nextStatusForProfileAction,
  resolveProfileApproverId,
} from '@/features/profile/profile-rules'
import { findUserById } from '@/mocks/users'
import {
  __resetFeatureConfigForTests,
  mockFeatureConfigRepository,
} from '@/shared/repositories/feature-config-repository'
import {
  __resetProfileStoreForTests,
  createProfileRequestId,
  mockProfileRepository,
} from '@/shared/repositories/profile-repository'
import { can } from '@/shared/policy/can'
import {
  __resetEntitlementsForTests,
  mockEntitlementsRepository,
} from '@/shared/repositories/entitlements-repository'
import type { ProfileChangeRequest, ProfileFieldValues } from '@/types/profile'
import { featureConfigDefaults } from '@/modules/feature-schemas'

const TENANT = 'tenant-norf'

const baseValues: ProfileFieldValues = {
  phone: '111',
  personalEmail: 'a@b.c',
  address: 'Street',
  emergencyContact: 'Mom',
  legalName: 'Sofia Alvarez',
  nationalId: 'ID-1',
  bankDetails: 'BANK',
  jobTitle: 'Engineer',
  salary: '72000',
  departmentId: 'dept-eng',
  managerId: 'user-hod-eng',
  roleIds: 'regular_employee',
}

function pendingRequest(
  overrides: Partial<ProfileChangeRequest> = {},
): ProfileChangeRequest {
  return {
    id: createProfileRequestId(),
    tenantId: TENANT,
    requesterId: 'user-employee',
    requesterName: 'Sofia Alvarez',
    status: 'pending',
    configVersionId: 'v1',
    fieldChanges: [
      {
        field: 'legalName',
        fromValue: 'Sofia Alvarez',
        toValue: 'Sofia A. Alvarez',
        sensitivity: 'needs_approval',
      },
    ],
    attachments: [],
    assignedApproverId: 'user-hr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    decisions: [],
    ...overrides,
  }
}

describe('profile field sensitivity', () => {
  const fields = featureConfigDefaults('hr.profile_self_service').fields

  it('splits direct vs approval vs locked', () => {
    const result = buildFieldChanges(
      baseValues,
      {
        phone: '222',
        legalName: 'New Name',
        salary: '99999',
      },
      fields,
    )
    expect(result.direct.map((d) => d.field)).toEqual(['phone'])
    expect(result.needsApproval.map((d) => d.field)).toEqual(['legalName'])
    expect(result.lockedAttempts).toEqual(['salary'])
  })
})

describe('profile transitions and SoD', () => {
  beforeEach(() => {
    __resetEntitlementsForTests()
    __resetFeatureConfigForTests()
    __resetProfileStoreForTests()
  })

  it.each([
    ['submit', 'pending'],
    ['approve', 'approved'],
    ['reject', 'rejected'],
    ['return', 'returned'],
    ['withdraw', 'withdrawn'],
  ] as const)('maps %s → %s', (action, status) => {
    expect(nextStatusForProfileAction(action)).toBe(status)
  })

  it('denies self-approval', () => {
    const hr = findUserById('user-hr')!
    const request = pendingRequest({
      requesterId: hr.id,
      assignedApproverId: 'user-hr-head',
    })
    expect(canHrDecideProfileChange(hr, request)).toBe(false)
    expect(
      can(hr, 'approve', 'profile_change', {
        tenantId: TENANT,
        featureKey: 'hr.profile_self_service',
        moduleId: 'hr',
        subjectUserId: hr.id,
      }),
    ).toBe(false)
  })

  it('routes HR officer changes to HR Head', () => {
    const hr = findUserById('user-hr')!
    expect(resolveProfileApproverId(hr)).toBe('user-hr-head')
  })

  it('allows HR Head to decide HR officer request', () => {
    const head = findUserById('user-hr-head')!
    const request = pendingRequest({
      requesterId: 'user-hr',
      assignedApproverId: 'user-hr-head',
    })
    expect(canHrDecideProfileChange(head, request)).toBe(true)
  })

  it('allows withdraw by requester only while pending', () => {
    const employee = findUserById('user-employee')!
    const request = pendingRequest()
    expect(canWithdrawProfileChange(employee, request)).toBe(true)
    expect(
      canWithdrawProfileChange(employee, {
        ...request,
        status: 'approved',
      }),
    ).toBe(false)
    assertProfileTransition(employee, request, 'withdraw')
  })

  it('keeps prior config version rules on approve path', () => {
    const v1 = mockFeatureConfigRepository.getCurrentConfig(
      TENANT,
      'hr.profile_self_service',
    )
    mockFeatureConfigRepository.saveConfig(
      TENANT,
      'hr.profile_self_service',
      {
        fields: {
          ...v1.config.fields,
          phone: 'needs_approval',
        },
      },
      'user-admin',
    )
    const old = mockFeatureConfigRepository.getConfigByVersionId(TENANT, v1.id)
    expect(old?.config.fields.phone).toBe('direct')
    expect(old?.isCurrent).toBe(false)
  })

  it('isolates requests by tenant', () => {
    mockProfileRepository.saveRequest(
      pendingRequest({ id: 'pcr-norf', tenantId: TENANT }),
    )
    mockProfileRepository.saveRequest(
      pendingRequest({
        id: 'pcr-apex',
        tenantId: 'tenant-apex',
        requesterId: 'user-apex-emp',
      }),
    )
    expect(mockProfileRepository.listRequests(TENANT).map((r) => r.id)).toEqual(
      ['pcr-norf'],
    )
    expect(
      mockProfileRepository.listRequests('tenant-apex').map((r) => r.id),
    ).toEqual(['pcr-apex'])
  })

  it('denies profile actions when feature off', () => {
    mockEntitlementsRepository.setFeatures(TENANT, ['hr.leave'], 'user-super')
    const employee = findUserById('user-employee')!
    expect(
      can(employee, 'update', 'profile_change', {
        tenantId: TENANT,
        moduleId: 'hr',
        featureKey: 'hr.profile_self_service',
      }),
    ).toBe(false)
  })
})
