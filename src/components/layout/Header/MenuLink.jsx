import { Link } from 'react-router-dom'
import { Circle } from 'lucide-react'

/** Icon tile + title + description row, used by dropdowns and mega-menus. A null href renders a non-link row. */
export default function MenuLink({ icon: Icon = Circle, title, desc, href, onClick }) {
  const cls = 'group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-accent-600'
  const inner = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-100 transition-colors group-hover:bg-primary-700 group-hover:text-white group-hover:ring-primary-700">
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        {desc && <span className="block text-xs leading-snug text-slate-500">{desc}</span>}
      </span>
    </>
  )
  if (href && href.startsWith('/') && !href.startsWith('/#')) {
    return (
      <Link to={href} onClick={onClick} className={cls}>
        {inner}
      </Link>
    )
  }
  return (
    <a href={href ?? '#'} onClick={onClick} className={cls}>
      {inner}
    </a>
  )
}
