import { Link } from 'react-router-dom'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import ExamLogo from '@/components/common/ExamLogo'
import SectionShell from '@/components/hub/SectionShell'

/** exams: [{ slug, name, fullName?, org, href }]  A card links to its hub only when that exam page is published (href). */
export default function RelatedExams({ exams = [] }) {
  if (!exams.length) return null

  return (
    <SectionShell icon={LayoutGrid} id="related-exams" title="Explore Related Exams">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((e) => {
          const live = Boolean(e.href)
          const inner = (
            <>
              <ExamLogo org={e.org} name={e.name} className="size-11" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{e.name}</span>
                {e.fullName && <span className="block truncate text-sm text-slate-500">{e.fullName}</span>}
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
            <li key={e.slug}>
              {live ? (
                <Link to={e.href} className={`${cls} hover:border-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`}>
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
