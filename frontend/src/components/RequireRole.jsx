import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Route guard. Pass `roles` to restrict to specific roles
 * ('employee' | 'approver' | 'admin'); omit it to require any signed-in user.
 */
export default function RequireRole({ roles, children }) {
  const { isAuthenticated, role, sessionChecked } = useAuth()
  const location = useLocation()

  // Wait for the persisted token to be validated before deciding — otherwise
  // a stale token would let protected pages mount and fire 401s.
  if (!sessionChecked) return null
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }
  return children
}
