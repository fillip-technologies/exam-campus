import AuthLink from './AuthLink'

/** "Enroll Now" button. Needs a login; `what` is the product name used in the login popup message. */
export default function EnrollButton({ to, what, className, children }) {
  return (
    <AuthLink to={to} reason={what ? `Please log in to enroll in ${what}.` : 'Please log in to enroll.'} className={className}>
      {children}
    </AuthLink>
  )
}
