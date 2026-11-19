import { Link } from 'react-router-dom'
import { Circle } from 'lucide-react'
import { resolveGlobalHref } from '@/lib/links'

/**
 * Icon tile + title + description row, used by dropdowns and mega-menus.
 * Without a usable href it renders a muted "Soon" row instead of a link that goes nowhere.
 */
export default function MenuLink({ icon: Icon = Circle, title, desc, href: rawHref, onClick }) {
  const href = resolveGlobalHref(rawHref)
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

  if (!href) {
    return (
      <div className="flex items-start gap-3 rounded-lg p-2.5 opacity-70" title="Coming soon">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-slate-50 text-slate-400 ring-1 ring-inset ring-slate-200">
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            {title}
            <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-slate-500">Soon</span>
          </span>
          {desc && <span className="block text-xs leading-snug text-slate-400">{desc}</span>}
        </span>
      </div>
    )
  }
  if (href.startsWith('/') && !href.startsWith('/#')) {
    return (
      <Link to={href} onClick={onClick} className={cls}>
        {inner}
      </Link>
    )
  }
  return (
    <a href={href} onClick={onClick} className={cls}>
      {inner}
    </a>
  )
}
