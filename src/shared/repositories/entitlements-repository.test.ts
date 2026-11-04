import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetEntitlementsForTests,
  mockEntitlementsRepository,
} from '@/shared/repositories/entitlements-repository'
import {
  __resetFeatureConfigForTests,
  mockFeatureConfigRepository,
} from '@/shared/repositories/feature-config-repository'

const TENANT = 'tenant-norf'
const OTHER = 'tenant-apex'

describe('entitlements repository', () => {
  beforeEach(() => {
    __resetEntitlementsForTests()
    __resetFeatureConfigForTests()
  })

  it('isolates modules per tenant', () => {
    mockEntitlementsRepository.setModules(TENANT, ['hr', 'documents'], 'u1')
    expect(mockEntitlementsRepository.listModules(TENANT)).toEqual([
      'hr',
      'documents',
    ])
    expect(mockEntitlementsRepository.listModules(OTHER)).toContain('crm')
  })

  it('blocks feature entitle when owning service off', () => {
    mockEntitlementsRepository.setModules(TENANT, ['crm'], 'u1')
    expect(() =>
      mockEntitlementsRepository.setFeatures(TENANT, ['hr.goals'], 'u1'),
    ).toThrow(/owning service/)
  })

  it('feature effectively off when module disabled', () => {
    mockEntitlementsRepository.setModules(
      TENANT,
      ['hr', 'documents'],
      'u1',
    )
    mockEntitlementsRepository.setFeatures(TENANT, ['hr.leave'], 'u1')
    mockEntitlementsRepository.setModules(TENANT, ['documents'], 'u1')
    expect(
      mockEntitlementsRepository.isFeatureEffectivelyEnabled(TENANT, 'hr.leave'),
    ).toBe(false)
  })
})

describe('feature config repository', () => {
  beforeEach(() => {
    __resetFeatureConfigForTests()
  })

  it('versions config and keeps prior versions readable', () => {
    const v1 = mockFeatureConfigRepository.getCurrentConfig(TENANT, 'hr.goals')
    const v2 = mockFeatureConfigRepository.saveConfig(
      TENANT,
      'hr.goals',
      { minGoals: 5, maxGoals: 5 },
      'user-admin',
    )
    expect(v2.version).toBe(v1.version + 1)
    expect(v2.isCurrent).toBe(true)
    const old = mockFeatureConfigRepository.getConfigByVersionId(TENANT, v1.id)
    expect(old?.isCurrent).toBe(false)
    expect(old?.config).toEqual(v1.config)
  })

  it('validates before save', () => {
    expect(() =>
      mockFeatureConfigRepository.saveConfig(
        TENANT,
        'hr.evaluations',
        { ratingLabels: ['only-one'] },
        'user-admin',
      ),
    ).toThrow()
  })

  it('audit log records reset', () => {
    mockFeatureConfigRepository.resetToDefaults(TENANT, 'hr.leave', 'user-hr')
    const audit = mockFeatureConfigRepository.listAudit(TENANT, 'hr.leave')
    expect(audit[0]?.action).toBe('reset')
  })
})
