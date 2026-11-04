import { describe, expect, it } from 'vitest'
import {
  featureConfigDefaults,
  parseFeatureConfig,
} from '@/modules/feature-schemas'

describe('feature config schemas', () => {
  it('applies goals defaults', () => {
    const config = featureConfigDefaults('hr.goals')
    expect(config.minGoals).toBe(3)
    expect(config.maxGoals).toBe(7)
    expect(config.weightsMustSumTo100).toBe(true)
  })

  it('rejects invalid rating scale', () => {
    expect(() =>
      parseFeatureConfig('hr.evaluations', {
        ratingMin: 5,
        ratingMax: 2,
        ratingLabels: ['a'],
      }),
    ).toThrow()
  })

  it('accepts appeal path enum', () => {
    const config = parseFeatureConfig('hr.evaluations.appeals', {
      path: 'escalation_only',
      maxRounds: 1,
    })
    expect(config.path).toBe('escalation_only')
    expect(config.maxRounds).toBe(1)
  })

  it('keeps prior version semantics via separate parse (immutability of input)', () => {
    const v1 = parseFeatureConfig('hr.goals', { minGoals: 3, maxGoals: 7 })
    const v2 = parseFeatureConfig('hr.goals', { minGoals: 5, maxGoals: 5 })
    expect(v1.minGoals).toBe(3)
    expect(v2.minGoals).toBe(5)
  })
})
