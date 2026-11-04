import { z } from 'zod'
import type { FeatureKey } from '@/modules/feature-keys'

export const goalsConfigSchema = z.object({
  minGoals: z.number().int().min(1).max(20).default(3),
  maxGoals: z.number().int().min(1).max(20).default(7),
  weightsMustSumTo100: z.boolean().default(true),
  /** Days before period start when submission closes. */
  submissionDeadlineDaysBeforePeriod: z.number().int().min(0).max(90).default(14),
  allowEpmObjectiveLink: z.boolean().default(true),
})

export type GoalsConfig = z.infer<typeof goalsConfigSchema>

export const evaluationsConfigSchema = z
  .object({
    ratingMin: z.number().int().min(1).max(10).default(1),
    ratingMax: z.number().int().min(1).max(10).default(5),
    ratingLabels: z
      .array(z.string().min(1))
      .min(2)
      .default([
        'Unsatisfactory',
        'Needs improvement',
        'Meets',
        'Exceeds',
        'Outstanding',
      ]),
    employeeResponseDays: z.number().int().min(1).max(60).default(7),
    maxAppealRounds: z.number().int().min(1).max(5).default(2),
    appealPath: z
      .enum(['reconsideration_only', 'escalation_only', 'both'])
      .default('both'),
    periodType: z
      .enum(['calendar_year', 'fiscal_year', 'custom'])
      .default('calendar_year'),
  })
  .refine((value) => value.ratingMin <= value.ratingMax, {
    message: 'ratingMin must be <= ratingMax',
  })

export type EvaluationsConfig = z.infer<typeof evaluationsConfigSchema>

export const appealsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  path: z
    .enum(['reconsideration_only', 'escalation_only', 'both'])
    .default('both'),
  maxRounds: z.number().int().min(1).max(5).default(2),
})

export type AppealsConfig = z.infer<typeof appealsConfigSchema>

export const profileFieldSensitivitySchema = z.enum([
  'direct',
  'needs_approval',
  'locked',
])

export type ProfileFieldSensitivity = z.infer<typeof profileFieldSensitivitySchema>

export const profileSelfServiceConfigSchema = z.object({
  fields: z
    .record(z.string(), profileFieldSensitivitySchema)
    .default({
      phone: 'direct',
      personalEmail: 'direct',
      address: 'direct',
      emergencyContact: 'direct',
      legalName: 'needs_approval',
      nationalId: 'needs_approval',
      bankDetails: 'needs_approval',
      jobTitle: 'needs_approval',
      salary: 'locked',
      departmentId: 'locked',
      managerId: 'locked',
      roleIds: 'locked',
    }),
  allowDocumentAttachments: z.boolean().default(true),
})

export type ProfileSelfServiceConfig = z.infer<
  typeof profileSelfServiceConfigSchema
>

export const leaveConfigSchema = z.object({
  noticePeriodDays: z.number().int().min(0).max(90).default(5),
  requireManagerThenHr: z.boolean().default(true),
})

export type LeaveConfig = z.infer<typeof leaveConfigSchema>

export const signaturesBuiltinConfigSchema = z.object({
  provider: z.literal('builtin').default('builtin'),
  disclaimerVisible: z.boolean().default(true),
})

export type SignaturesBuiltinConfig = z.infer<typeof signaturesBuiltinConfigSchema>

export const signaturesExternalConfigSchema = z.object({
  provider: z.literal('docusign_mock').default('docusign_mock'),
  disclaimerVisible: z.boolean().default(true),
})

export type SignaturesExternalConfig = z.infer<
  typeof signaturesExternalConfigSchema
>

export type FeatureConfigMap = {
  'hr.leave': LeaveConfig
  'hr.goals': GoalsConfig
  'hr.evaluations': EvaluationsConfig
  'hr.evaluations.appeals': AppealsConfig
  'hr.profile_self_service': ProfileSelfServiceConfig
  'documents.signatures.builtin': SignaturesBuiltinConfig
  'documents.signatures.external': SignaturesExternalConfig
}

export const FEATURE_CONFIG_SCHEMAS: {
  [K in FeatureKey]: z.ZodType<FeatureConfigMap[K]>
} = {
  'hr.leave': leaveConfigSchema,
  'hr.goals': goalsConfigSchema,
  'hr.evaluations': evaluationsConfigSchema,
  'hr.evaluations.appeals': appealsConfigSchema,
  'hr.profile_self_service': profileSelfServiceConfigSchema,
  'documents.signatures.builtin': signaturesBuiltinConfigSchema,
  'documents.signatures.external': signaturesExternalConfigSchema,
}

export function parseFeatureConfig<K extends FeatureKey>(
  key: K,
  raw: unknown,
): FeatureConfigMap[K] {
  return FEATURE_CONFIG_SCHEMAS[key].parse(raw) as FeatureConfigMap[K]
}

export function featureConfigDefaults<K extends FeatureKey>(
  key: K,
): FeatureConfigMap[K] {
  return parseFeatureConfig(key, {})
}
