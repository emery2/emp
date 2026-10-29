import { Navigate } from 'react-router-dom'

/** MFA is deferred past Task 01 — keep route file for compatibility. */
export function MfaPage() {
  return <Navigate to="/login" replace />
}
