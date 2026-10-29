import { Navigate } from 'react-router-dom'
import { primaryDashboardPath } from '@/access/evaluate'
import { useAuth } from '@/hooks/useAuth'

export function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={primaryDashboardPath(user)} replace />
}
