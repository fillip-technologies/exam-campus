import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import MenuLink from './MenuLink'
import { academicColumns } from '@/data/nav'

/** Full-width shell shared by every mega-menu. */
export function MegaShell({ id, footer, children, bare = false, onNavigate }) {
  return (
    <div id={id} className="absolute inset-x-0 top-full animate-pop border-y border-slate-200 bg-white shadow-xl shadow-primary-900/10">
      <div className={`mx-auto w-full px-12 ${bare ? "py-0" : "py-8"}`}>{children}</div>
      <div className="border-t border-slate-100 bg-surface">
        <div className="mx-auto flex w-full items-center justify-between px-12 py-3 text-sm">
          <p className="text-slate-500">{footer.text}</p>
          <a href={footer.href ?? "#"} onClick={onNavigate} className="inline-flex items-center gap-1.5 font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-accent-600">
            {footer.cta} <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}

export function AcademicMega({ id, onNavigate }) {
  return (
    <MegaShell id={id} footer={{ text: 'Not sure where to start? Take a free level check for your class.', cta: 'Browse all classes' }}>
      <div className="grid grid-cols-6 gap-5">
        {academicColumns.map(({ title, icon, desc, links }) => (
          <section key={title} aria-label={title}>
            <MenuLink icon={icon} title={title} desc={desc} onClick={onNavigate} />
            <ul className="mt-2 space-y-0.5 border-l border-slate-200 pl-3 ml-[1.35rem]">
              {links.map((l) => {
                const label = typeof l === "string" ? l : l.label
                const linkClass = "block rounded py-1 pl-2 text-sm text-slate-600 transition-colors hover:text-primary-700 hover:underline focus-visible:outline-2 focus-visible:outline-accent-600"
                return (
                  <li key={label}>
                    {typeof l === "string" ? (
                      <a href="#" onClick={onNavigate} className={linkClass}>
                        {label}
                      </a>
                    ) : (
                      <Link to={l.to} onClick={onNavigate} className={linkClass}>
                        {label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </MegaShell>
  )
}
