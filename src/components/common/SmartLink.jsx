import { Link } from 'react-router-dom'

/**
 * Renders an API `href`:
 *   "/exams/sbi-po"      -> client-side <Link>
 *   "#free-tests", "/#exams/ssc", "https://...", "mailto:" -> plain <a> (external ones open in a new tab)
 *   null                 -> the `fallback` element (default: a <span>), so links to unpublished targets never 404
 */
export default function SmartLink({ href, className, children, fallback, onClick, ...rest }) {
  if (!href) {
    if (fallback !== undefined) return fallback
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    )
  }
  if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#')) {
    return (
      <Link to={href} className={className} onClick={onClick} {...rest}>
        {children}
      </Link>
    )
  }
  const external = /^https?:\/\//.test(href)
  return (
    <a href={href} className={className} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  )
}
