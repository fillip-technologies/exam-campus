import { Link } from 'react-router-dom'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import SectionShell from '@/components/hub/SectionShell'
import { hasClassPage } from '@/data/classes'

/** classes: [{ slug, name, stage }]  A card links to its hub only when that class page exists. */
export default function OtherClasses({ classes = [] }) {
  if (!classes.length) return null

  return (
    <SectionShell icon={LayoutGrid} id="other-classes" title="Explore Other Classes">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => {
          const live = hasClassPage(c.slug)
          const inner = (
            <>
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-md bg-primary-50 text-lg font-extrabold text-primary-700 ring-1 ring-inset ring-primary-100">
                {c.name.replace(/\D/g, '')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{c.name}</span>
                <span className="block text-sm text-slate-500">{c.stage}</span>
              </span>
              {live ? (
                <ArrowRight className="size-4 shrink-0 text-slate-400 transition duration-150 group-hover:translate-x-0.5 group-hover:text-primary-600" aria-hidden="true" />
              ) : (
                <span className="shrink-0 rounded-sm bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">Coming soon</span>
              )}
            </>
          )
          const cls = 'group flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 transition-colors'
          return (
            <li key={c.slug}>
              {live ? (
                <Link to={`/academic/${c.slug}`} className={`${cls} hover:border-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`}>
                  {inner}
                </Link>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </li>
          )
        })}
      </ul>
    </SectionShell>
  )
}
