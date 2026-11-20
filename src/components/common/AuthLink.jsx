import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth/useAuth'
import { isExternalHref } from '@/lib/links'

/**
 * A link that needs a login. Logged-in users go straight to `to`; everyone else sees the login popup
 * (with `reason` as the message) and continues to `to` right after logging in.
 *
 * A redirect link to another site (set in the admin panel) skips the login: that site handles its own
 * accounts, so the button simply opens it in a new tab.
 */
export default function AuthLink({ to, reason, className, children }) {
  const { isLoggedIn, requireAuth } = useAuth()
  const navigate = useNavigate()

  if (isExternalHref(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

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
