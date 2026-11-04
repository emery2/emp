import { delay } from '@/mocks/delay'
import { mockFeatureConfigRepository } from '@/shared/repositories/feature-config-repository'
import {
  createProfileDecisionId,
  createProfileHistoryId,
  createProfileRequestId,
  mockProfileRepository,
} from '@/shared/repositories/profile-repository'
import { can } from '@/shared/policy/can'
import {
  assertProfileTransition,
  buildFieldChanges,
  nextStatusForProfileAction,
  resolveProfileApproverId,
} from '@/features/profile/profile-rules'
import type { AppUser } from '@/types/access'
import type {
  ProfileChangeRequest,
  ProfileDecisionAction,
  ProfileFieldHistoryEntry,
  ProfileFieldValues,
  EmployeeProfileRecord,
} from '@/types/profile'
import type { ProfileSelfServiceConfig } from '@/modules/feature-schemas'

export const profileKeys = {
  all: ['profile'] as const,
  me: (tenantId: string, userId: string) =>
    [...profileKeys.all, 'me', tenantId, userId] as const,
  requests: (tenantId: string, scope: string) =>
    [...profileKeys.all, 'requests', tenantId, scope] as const,
  request: (tenantId: string, id: string) =>
    [...profileKeys.all, 'request', tenantId, id] as const,
  history: (tenantId: string, userId: string) =>
    [...profileKeys.all, 'history', tenantId, userId] as const,
}

function loadConfig(tenantId: string): {
  config: ProfileSelfServiceConfig
  configVersionId: string
} {
  const version = mockFeatureConfigRepository.getCurrentConfig(
    tenantId,
    'hr.profile_self_service',
  )
  return { config: version.config, configVersionId: version.id }
}

function loadConfigAtVersion(
  tenantId: string,
  configVersionId: string,
): ProfileSelfServiceConfig {
  const version = mockFeatureConfigRepository.getConfigByVersionId(
    tenantId,
    configVersionId,
  )
  if (!version || version.featureKey !== 'hr.profile_self_service') {
    return loadConfig(tenantId).config
  }
  return version.config as ProfileSelfServiceConfig
}

function ensureProfile(
  tenantId: string,
  userId: string,
): EmployeeProfileRecord {
  const existing = mockProfileRepository.getProfileByUserId(tenantId, userId)
  if (existing) return existing
  const now = new Date().toISOString()
  return mockProfileRepository.saveProfile({
    id: `profile-${userId}`,
    tenantId,
    userId,
    updatedAt: now,
    values: {
      phone: '',
      personalEmail: '',
      address: '',
      emergencyContact: '',
      legalName: '',
      nationalId: '',
      bankDetails: '',
      jobTitle: '',
      salary: '',
      departmentId: '',
      managerId: '',
      roleIds: '',
    },
  })
}

export async function fetchMyProfile(
  tenantId: string,
  userId: string,
): Promise<EmployeeProfileRecord> {
  await delay(80)
  return ensureProfile(tenantId, userId)
}

export async function fetchProfileHistory(
  tenantId: string,
  userId: string,
): Promise<ProfileFieldHistoryEntry[]> {
  await delay(60)
  return mockProfileRepository.listHistory(tenantId, userId)
}

export async function fetchMyProfileRequests(
  tenantId: string,
  userId: string,
): Promise<ProfileChangeRequest[]> {
  await delay(80)
  return mockProfileRepository
    .listRequests(tenantId)
    .filter((r) => r.requesterId === userId)
}

export async function fetchHrProfileQueue(
  tenantId: string,
  actor: AppUser,
): Promise<ProfileChangeRequest[]> {
  await delay(80)
  if (
    !can(actor, 'approve', 'profile_change', {
      tenantId,
      moduleId: 'hr',
      featureKey: 'hr.profile_self_service',
      permission: 'profile.approve.hr',
    })
  ) {
    throw new Error('Not allowed to view HR profile queue')
  }
  return mockProfileRepository
    .listRequests(tenantId)
    .filter(
      (r) =>
        (r.status === 'pending' || r.status === 'returned') &&
        r.requesterId !== actor.id &&
        (!r.assignedApproverId || r.assignedApproverId === actor.id),
    )
}

export async function fetchProfileRequest(
  tenantId: string,
  id: string,
  actor: AppUser,
): Promise<ProfileChangeRequest> {
  await delay(60)
  const request = mockProfileRepository.getRequest(tenantId, id)
  if (!request) throw new Error('Profile change request not found')
  const isRequester = request.requesterId === actor.id
  const isHr = can(actor, 'approve', 'profile_change', {
    tenantId,
    moduleId: 'hr',
    featureKey: 'hr.profile_self_service',
    permission: 'profile.approve.hr',
    subjectUserId: request.requesterId,
  })
  if (!isRequester && !isHr) {
    throw new Error('Not allowed to view this profile change request')
  }
  return request
}

export async function submitProfileChanges(
  tenantId: string,
  actor: AppUser,
  proposed: Partial<ProfileFieldValues>,
  attachments: string[] = [],
): Promise<{
  profile: EmployeeProfileRecord
  request: ProfileChangeRequest | null
  appliedDirect: string[]
}> {
  await delay(200)

  if (
    !can(actor, 'update', 'profile_change', {
      tenantId,
      moduleId: 'hr',
      featureKey: 'hr.profile_self_service',
      permission: 'profile.edit.self',
    })
  ) {
    throw new Error('Profile self-service not available or missing permission')
  }

  const profile = ensureProfile(tenantId, actor.id)

  const { config, configVersionId } = loadConfig(tenantId)
  if (attachments.length > 0 && !config.allowDocumentAttachments) {
    throw new Error('Document attachments are disabled for this tenant')
  }

  const { direct, needsApproval, lockedAttempts } = buildFieldChanges(
    profile.values,
    proposed,
    config.fields,
  )

  if (lockedAttempts.length > 0) {
    throw new Error(
      `Cannot edit locked fields: ${lockedAttempts.join(', ')}`,
    )
  }
  if (direct.length === 0 && needsApproval.length === 0) {
    throw new Error('No changes to submit')
  }

  const now = new Date().toISOString()
  let nextProfile = { ...profile, values: { ...profile.values }, updatedAt: now }

  for (const change of direct) {
    nextProfile.values[change.field] = change.toValue
    mockProfileRepository.appendHistory({
      id: createProfileHistoryId(),
      tenantId,
      profileId: profile.id,
      userId: actor.id,
      field: change.field,
      fromValue: change.fromValue,
      toValue: change.toValue,
      actorId: actor.id,
      actorName: `${actor.firstName} ${actor.lastName}`,
      reason: 'Direct self-service update (HR notified)',
      at: now,
    })
  }

  if (direct.length > 0) {
    nextProfile = mockProfileRepository.saveProfile(nextProfile)
  }

  let request: ProfileChangeRequest | null = null
  if (needsApproval.length > 0) {
    const draft: ProfileChangeRequest = {
      id: createProfileRequestId(),
      tenantId,
      requesterId: actor.id,
      requesterName: `${actor.firstName} ${actor.lastName}`,
      status: 'pending',
      configVersionId,
      fieldChanges: needsApproval.map((c) => ({
        ...c,
        sensitivity: 'needs_approval' as const,
      })),
      attachments,
      assignedApproverId: resolveProfileApproverId(actor),
      createdAt: now,
      updatedAt: now,
      decisions: [],
    }
    assertProfileTransition(actor, draft, 'submit')
    const status = nextStatusForProfileAction('submit')!
    request = mockProfileRepository.saveRequest({
      ...draft,
      status,
      decisions: [
        {
          id: createProfileDecisionId(),
          actorId: actor.id,
          actorName: `${actor.firstName} ${actor.lastName}`,
          action: 'submit',
          at: now,
        },
      ],
    })
    mockProfileRepository.saveProfile({
      ...nextProfile,
      configVersionId,
    })
  }

  return {
    profile: nextProfile,
    request,
    appliedDirect: direct.map((d) => d.field),
  }
}

export async function decideProfileChange(
  tenantId: string,
  actor: AppUser,
  requestId: string,
  action: Extract<ProfileDecisionAction, 'approve' | 'reject' | 'return' | 'withdraw'>,
  comment?: string,
): Promise<ProfileChangeRequest> {
  await delay(200)
  const request = mockProfileRepository.getRequest(tenantId, requestId)
  if (!request) throw new Error('Profile change request not found')

  if (action === 'withdraw') {
    assertProfileTransition(actor, request, 'withdraw')
  } else {
    if (
      !can(actor, action === 'approve' ? 'approve' : 'reject', 'profile_change', {
        tenantId,
        moduleId: 'hr',
        featureKey: 'hr.profile_self_service',
        permission: 'profile.approve.hr',
        subjectUserId: request.requesterId,
      })
    ) {
      throw new Error('Not allowed to decide this profile change')
    }
    assertProfileTransition(actor, request, action)
    if ((action === 'reject' || action === 'return') && !comment?.trim()) {
      throw new Error('A reason is required')
    }
  }

  const now = new Date().toISOString()
  const nextStatus = nextStatusForProfileAction(action)
  if (!nextStatus) throw new Error('Invalid action')

  const updated: ProfileChangeRequest = {
    ...request,
    status: nextStatus,
    updatedAt: now,
    decisions: [
      ...request.decisions,
      {
        id: createProfileDecisionId(),
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        action,
        comment,
        at: now,
      },
    ],
  }

  if (action === 'approve') {
    // Apply using the config version the request started under
    const config = loadConfigAtVersion(tenantId, request.configVersionId)
    const profile = mockProfileRepository.getProfileByUserId(
      tenantId,
      request.requesterId,
    )
    if (!profile) throw new Error('Requester profile missing')

    const nextValues = { ...profile.values }
    for (const change of request.fieldChanges) {
      const sensitivity = config.fields[change.field] ?? change.sensitivity
      if (sensitivity === 'locked') continue
      nextValues[change.field] = change.toValue
      mockProfileRepository.appendHistory({
        id: createProfileHistoryId(),
        tenantId,
        profileId: profile.id,
        userId: request.requesterId,
        field: change.field,
        fromValue: change.fromValue,
        toValue: change.toValue,
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        reason: comment?.trim() || 'Approved profile change request',
        at: now,
        changeRequestId: request.id,
      })
    }
    mockProfileRepository.saveProfile({
      ...profile,
      values: nextValues,
      updatedAt: now,
    })
  }

  return mockProfileRepository.saveRequest(updated)
}
