import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth/useAuth'

/**
 * A link that needs a login. Logged-in users go straight to `to`; everyone else sees the login popup
 * (with `reason` as the message) and continues to `to` right after logging in.
 */
export default function AuthLink({ to, reason, className, children }) {
  const { isLoggedIn, requireAuth } = useAuth()
  const navigate = useNavigate()

  const onClick = (e) => {
    if (isLoggedIn) return
    e.preventDefault()
    requireAuth(() => navigate(to), reason)
  }

  return (
    <Link to={to} onClick={onClick} className={className}>
      {children}
    </Link>
  )
}
