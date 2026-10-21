import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/useAuth'
import { useFeatureFlags } from '@/hooks/useFeatureFlags'
import type { FeatureFlag, Role } from '@/types'

export interface RoleGateProps {
  roles: Role[]
  feature?: FeatureFlag
  mode?: 'hide' | 'disable'
  tooltip?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleGate({
  roles,
  feature,
  mode = 'hide',
  tooltip = 'You do not have permission for this action',
  fallback = null,
  children,
}: RoleGateProps) {
  const { user } = useAuth()
  const { flags } = useFeatureFlags()

  const roleAllowed = Boolean(user && roles.includes(user.role))
  const featureAllowed = feature ? flags[feature] : true
  const allowed = roleAllowed && featureAllowed

  if (allowed) return <>{children}</>

  if (mode === 'hide') return <>{fallback}</>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-not-allowed opacity-50">
          <span className="pointer-events-none">{children}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
