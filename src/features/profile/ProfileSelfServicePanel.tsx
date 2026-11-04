import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import {
  fetchMyProfile,
  fetchMyProfileRequests,
  fetchProfileHistory,
  profileKeys,
  submitProfileChanges,
} from '@/api/profile'
import { entitlementKeys, fetchFeatureConfig } from '@/api/entitlements'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryError } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ProfileChangeStatusBadge } from '@/features/profile/profile-status'
import { sensitivityFor } from '@/features/profile/profile-rules'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { mockEntitlementsRepository } from '@/shared/repositories/entitlements-repository'
import {
  PROFILE_EDITABLE_FIELDS,
  PROFILE_FIELD_LABELS,
  type ProfileFieldKey,
  type ProfileFieldValues,
} from '@/types/profile'

export function ProfileSelfServicePanel() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const queryClient = useQueryClient()

  const featureOn = mockEntitlementsRepository.isFeatureEffectivelyEnabled(
    tenant.id,
    'hr.profile_self_service',
  )

  const configQuery = useQuery({
    queryKey: entitlementKeys.config(tenant.id, 'hr.profile_self_service'),
    queryFn: () => fetchFeatureConfig(tenant.id, 'hr.profile_self_service'),
    enabled: featureOn,
  })

  const profileQuery = useQuery({
    queryKey: profileKeys.me(tenant.id, user?.id ?? ''),
    queryFn: () => fetchMyProfile(tenant.id, user!.id),
    enabled: Boolean(user) && featureOn,
  })

  const requestsQuery = useQuery({
    queryKey: profileKeys.requests(tenant.id, `mine:${user?.id ?? ''}`),
    queryFn: () => fetchMyProfileRequests(tenant.id, user!.id),
    enabled: Boolean(user) && featureOn,
  })

  const historyQuery = useQuery({
    queryKey: profileKeys.history(tenant.id, user?.id ?? ''),
    queryFn: () => fetchProfileHistory(tenant.id, user!.id),
    enabled: Boolean(user) && featureOn,
  })

  const [draft, setDraft] = useState<Partial<ProfileFieldValues> | null>(null)
  const [attachmentName, setAttachmentName] = useState('')

  const values = useMemo(() => {
    if (!profileQuery.data) return null
    return { ...profileQuery.data.values, ...draft }
  }, [profileQuery.data, draft])

  const mutation = useMutation({
    mutationFn: () => {
      if (!user || !draft) throw new Error('Nothing to save')
      const attachments = attachmentName.trim()
        ? [attachmentName.trim()]
        : []
      return submitProfileChanges(tenant.id, user, draft, attachments)
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all })
      setDraft(null)
      setAttachmentName('')
      const parts: string[] = []
      if (result.appliedDirect.length) {
        parts.push(`Applied immediately: ${result.appliedDirect.join(', ')}`)
      }
      if (result.request) {
        parts.push('Approval request submitted to HR')
      }
      toast.success(parts.join('. ') || 'Saved')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  if (!featureOn) {
    return (
      <p className="text-sm text-text-secondary">
        Profile self-service is not on your plan.{' '}
        <Link className="text-primary underline" to="/plan-unavailable">
          Learn more
        </Link>
      </p>
    )
  }

  if (profileQuery.isLoading || configQuery.isLoading) {
    return <Skeleton className="h-64 w-full" />
  }
  if (profileQuery.isError || !profileQuery.data || !configQuery.data) {
    return (
      <QueryError
        message={
          profileQuery.error instanceof Error
            ? profileQuery.error.message
            : 'Profile unavailable'
        }
        onRetry={() => void profileQuery.refetch()}
      />
    )
  }

  const fieldsConfig = configQuery.data.config.fields

  const setField = (field: ProfileFieldKey, value: string) => {
    setDraft((current) => ({
      ...(current ?? {}),
      [field]: value,
    }))
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <PageHeader
          title="My profile details"
          description="Direct fields apply immediately (HR is notified). Sensitive fields require HR approval. Locked fields cannot be edited."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROFILE_EDITABLE_FIELDS.map((field) => {
            const sensitivity = sensitivityFor(fieldsConfig, field)
            const locked = sensitivity === 'locked'
            return (
              <label key={field} className="block space-y-1">
                <span className="flex items-center justify-between text-overline uppercase text-text-muted">
                  <span>{PROFILE_FIELD_LABELS[field]}</span>
                  <span className="normal-case tracking-normal text-[10px]">
                    {sensitivity === 'direct'
                      ? 'Direct'
                      : sensitivity === 'needs_approval'
                        ? 'Needs HR approval'
                        : 'Locked'}
                  </span>
                </span>
                <Input
                  value={values?.[field] ?? ''}
                  disabled={locked || mutation.isPending}
                  onChange={(event) => setField(field, event.target.value)}
                />
              </label>
            )
          })}
        </div>
        {configQuery.data.config.allowDocumentAttachments ? (
          <label className="block max-w-md space-y-1">
            <span className="text-overline uppercase text-text-muted">
              Proof document (filename mock)
            </span>
            <Input
              placeholder="e.g. passport-scan.pdf"
              value={attachmentName}
              onChange={(event) => setAttachmentName(event.target.value)}
            />
          </label>
        ) : null}
        <div className="flex gap-2">
          <Button
            disabled={!draft || mutation.isPending}
            onClick={() => {
              if (
                window.confirm(
                  'Submit profile changes? Direct fields apply now; approval fields go to HR.',
                )
              ) {
                mutation.mutate()
              }
            }}
          >
            Submit changes
          </Button>
          <Button
            variant="ghost"
            disabled={!draft}
            onClick={() => setDraft(null)}
          >
            Discard
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">My change requests</h2>
        {requestsQuery.isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (requestsQuery.data ?? []).length === 0 ? (
          <p className="text-sm text-text-muted">No requests yet.</p>
        ) : (
          <ul className="space-y-2">
            {(requestsQuery.data ?? []).map((request) => (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-2 bg-surface px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {request.fieldChanges.map((c) => c.field).join(', ')}
                  </p>
                  <p className="text-xs text-text-muted">{request.updatedAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ProfileChangeStatusBadge status={request.status} />
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/profile/changes/${request.id}`}>Open</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Field change history</h2>
        {historyQuery.isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (historyQuery.data ?? []).length === 0 ? (
          <p className="text-sm text-text-muted">No history yet.</p>
        ) : (
          <ul className="space-y-1">
            {(historyQuery.data ?? []).slice(0, 12).map((entry) => (
              <li
                key={entry.id}
                className="bg-surface px-3 py-2 text-xs text-text-secondary"
              >
                <span className="font-medium text-text-primary">
                  {PROFILE_FIELD_LABELS[entry.field]}
                </span>
                : “{entry.fromValue}” → “{entry.toValue}” by {entry.actorName} —{' '}
                {entry.reason}{' '}
                <span className="text-text-muted">({entry.at})</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
