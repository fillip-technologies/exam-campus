import { Link } from 'react-router-dom'
import { resolveHref } from '@/lib/links'

/**
 * Renders an API `href`:
 *   "/exams/sbi-po"      -> client-side <Link>
 *   "#free-tests", "/#exams/ssc", "https://...", "mailto:" -> plain <a> (external ones open in a new tab)
 *   null                 -> the `fallback` element (default: a <span>), so links to unpublished targets never 404
 * Placeholder anchors from the CMS go through resolveHref first (see src/lib/links.js).
 */
export default function SmartLink({ href: rawHref, className, children, fallback, onClick, ...rest }) {
  const href = resolveHref(rawHref)
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
