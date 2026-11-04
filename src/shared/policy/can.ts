import { hasPermission } from '@/access/evaluate'
import type { Permission } from '@/access/permissions'
import { FEATURE_MANIFESTS } from '@/modules/feature-manifests'
import type { AppUser } from '@/types/access'
import { mockEntitlementsRepository } from '@/shared/repositories/entitlements-repository'
import type {
  PolicyAction,
  PolicyContext,
  PolicyDecision,
  PolicyResource,
} from '@/shared/policy/types'

function deny(reason: string): PolicyDecision {
  return { allowed: false, reason }
}

function allow(): PolicyDecision {
  return { allowed: true }
}

/**
 * Central authorization. UI and repositories must call this (or thin wrappers).
 * Production FastAPI must re-enforce every decision independently.
 */
export function decide(
  user: AppUser | null,
  action: PolicyAction,
  resource: PolicyResource,
  context: PolicyContext,
): PolicyDecision {
  if (!user || !user.isActive) {
    return deny('Not authenticated or inactive')
  }

  if (context.subjectUserId && context.subjectUserId === user.id) {
    if (action === 'approve' || action === 'reject' || action === 'entitle') {
      return deny('Segregation of duties: cannot act on own request')
    }
  }

  if (context.moduleId) {
    if (
      !mockEntitlementsRepository.isModuleEnabled(
        context.tenantId,
        context.moduleId,
      )
    ) {
      return deny(`Module ${context.moduleId} not on plan`)
    }
  }

  if (context.featureKey) {
    if (
      !mockEntitlementsRepository.isFeatureEffectivelyEnabled(
        context.tenantId,
        context.featureKey,
      )
    ) {
      return deny(`Feature ${context.featureKey} not on plan`)
    }
  }

  if (resource === 'feature' && action === 'entitle') {
    if (!hasPermission(user, 'features.entitle')) {
      return deny('Missing features.entitle')
    }
    return allow()
  }

  if (resource === 'module' && action === 'entitle') {
    if (
      !hasPermission(user, 'features.entitle') &&
      !hasPermission(user, 'modules.configure')
    ) {
      return deny('Missing modules.configure or features.entitle')
    }
    return allow()
  }

  if (resource === 'feature_config' && action === 'configure') {
    if (!hasPermission(user, 'features.configure')) {
      return deny('Missing features.configure')
    }
    if (context.featureKey) {
      const roles = FEATURE_MANIFESTS[context.featureKey].configureRoles
      const ok = user.roleIds.some((r) =>
        roles.includes(r as (typeof roles)[number]),
      )
      if (!ok && !hasPermission(user, 'features.entitle')) {
        return deny('Role may not configure this feature')
      }
    }
    return allow()
  }

  if (context.permission) {
    if (!hasPermission(user, context.permission as Permission)) {
      return deny(`Missing permission ${context.permission}`)
    }
  }

  if (resource === 'leave') {
    if (
      !mockEntitlementsRepository.isFeatureEffectivelyEnabled(
        context.tenantId,
        'hr.leave',
      )
    ) {
      return deny('Feature hr.leave not on plan')
    }
    if (action === 'submit' && !hasPermission(user, 'leave.request')) {
      return deny('Missing leave.request')
    }
    if (
      action === 'approve' &&
      !hasPermission(user, 'leave.approve.department') &&
      !hasPermission(user, 'leave.verify.hr')
    ) {
      return deny('Missing leave approval permission')
    }
  }

  if (resource === 'profile_change') {
    if (
      !mockEntitlementsRepository.isFeatureEffectivelyEnabled(
        context.tenantId,
        'hr.profile_self_service',
      )
    ) {
      return deny('Feature hr.profile_self_service not on plan')
    }
    if (
      (action === 'update' || action === 'submit' || action === 'create') &&
      !hasPermission(user, 'profile.edit.self')
    ) {
      return deny('Missing profile.edit.self')
    }
    if (
      (action === 'approve' || action === 'reject') &&
      !hasPermission(user, 'profile.approve.hr')
    ) {
      return deny('Missing profile.approve.hr')
    }
  }

  return allow()
}

export function can(
  user: AppUser | null,
  action: PolicyAction,
  resource: PolicyResource,
  context: PolicyContext,
): boolean {
  return decide(user, action, resource, context).allowed
}
