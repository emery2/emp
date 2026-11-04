import { describe, expect, it, beforeEach } from 'vitest'
import { can, decide } from '@/shared/policy/can'
import { findUserById } from '@/mocks/users'
import {
  __resetEntitlementsForTests,
  mockEntitlementsRepository,
} from '@/shared/repositories/entitlements-repository'

const TENANT = 'tenant-norf'

describe('can() policy', () => {
  beforeEach(() => {
    __resetEntitlementsForTests()
  })

  const cases: Array<{
    name: string
    userId: string
    action: string
    resource: string
    context: Parameters<typeof can>[3]
    allowed: boolean
  }> = [
    {
      name: 'super admin may entitle features',
      userId: 'user-super',
      action: 'entitle',
      resource: 'feature',
      context: { tenantId: TENANT },
      allowed: true,
    },
    {
      name: 'employee may not entitle features',
      userId: 'user-employee',
      action: 'entitle',
      resource: 'feature',
      context: { tenantId: TENANT },
      allowed: false,
    },
    {
      name: 'org admin may configure modules',
      userId: 'user-admin',
      action: 'entitle',
      resource: 'module',
      context: { tenantId: TENANT },
      allowed: true,
    },
    {
      name: 'hr may configure feature config',
      userId: 'user-hr',
      action: 'configure',
      resource: 'feature_config',
      context: { tenantId: TENANT, featureKey: 'hr.goals' },
      allowed: true,
    },
    {
      name: 'employee may not configure features',
      userId: 'user-employee',
      action: 'configure',
      resource: 'feature_config',
      context: { tenantId: TENANT, featureKey: 'hr.goals' },
      allowed: false,
    },
    {
      name: 'self-approval denied',
      userId: 'user-employee',
      action: 'approve',
      resource: 'leave',
      context: {
        tenantId: TENANT,
        subjectUserId: 'user-employee',
        featureKey: 'hr.leave',
        moduleId: 'hr',
      },
      allowed: false,
    },
    {
      name: 'leave submit requires permission',
      userId: 'user-employee',
      action: 'submit',
      resource: 'leave',
      context: { tenantId: TENANT, moduleId: 'hr', featureKey: 'hr.leave' },
      allowed: true,
    },
    {
      name: 'board cannot submit leave',
      userId: 'user-board',
      action: 'submit',
      resource: 'leave',
      context: { tenantId: TENANT, moduleId: 'hr', featureKey: 'hr.leave' },
      allowed: false,
    },
  ]

  it.each(cases)('$name', ({ userId, action, resource, context, allowed }) => {
    const user = findUserById(userId)!
    expect(can(user, action, resource, context)).toBe(allowed)
  })

  it('denies when feature not entitled', () => {
    mockEntitlementsRepository.setFeatures(TENANT, ['hr.leave'], 'user-super')
    const user = findUserById('user-hr')!
    expect(
      can(user, 'view', 'goal', {
        tenantId: TENANT,
        featureKey: 'hr.goals',
        moduleId: 'hr',
      }),
    ).toBe(false)
    expect(
      decide(user, 'configure', 'feature_config', {
        tenantId: TENANT,
        featureKey: 'hr.goals',
      }).allowed,
    ).toBe(false)
    expect(
      can(user, 'configure', 'feature_config', {
        tenantId: TENANT,
        featureKey: 'hr.leave',
      }),
    ).toBe(true)
  })

  it('denies when module off', () => {
    mockEntitlementsRepository.setModules(
      TENANT,
      ['crm', 'documents', 'epm', 'projects', 'erp', 'scm', 'cx', 'prm'],
      'user-super',
    )
    const user = findUserById('user-employee')!
    expect(
      can(user, 'submit', 'leave', {
        tenantId: TENANT,
        moduleId: 'hr',
        featureKey: 'hr.leave',
      }),
    ).toBe(false)
  })
})
