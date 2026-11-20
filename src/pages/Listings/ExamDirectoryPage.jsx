import { useState } from 'react'
import SmartLink from '@/components/common/SmartLink'
import { subHref } from '@/lib/links'
import { ArrowRight, Circle, Search } from 'lucide-react'
import { useLayout } from '@/api/public'
import ExamLogo from '@/components/common/ExamLogo'
import FilterChips from '@/components/common/FilterChips'
import { LoadError, PageLoader } from '@/components/common/LoadState'
import PageHeader from '@/components/common/PageHeader'
import { iconFor } from '@/lib/icons'
import { usePageMeta } from '@/lib/usePageMeta'
import { useQueryParam } from '@/lib/useQueryParam'

const MODES = {
  exams: {
    crumb: 'All Exams',
    title: 'All Exams',
    intro: 'Every exam on ExamCampus by category. Open an exam for its courses, test series, syllabus, pattern and free tests.',
    meta: { title: 'All Exams: Banking, SSC, Railway, Teaching, UPSC & More | ExamCampus', description: 'Browse every exam on ExamCampus by category: Banking, SSC, Railway, Teaching, UPSC & PSC, Defence and State exams.' },
    linkFor: (e) => e.href,
    action: 'Explore',
  },
  papers: {
    crumb: 'Previous Year Papers',
    title: 'Previous Year Question Papers',
    intro: 'Pick your exam to see its previous year papers, year by year, for Prelims and Mains.',
    meta: { title: 'Previous Year Question Papers for All Exams | ExamCampus', description: 'Year-wise previous year question papers for Banking, SSC, Railway, Teaching, UPSC and other exams. View, download or attempt online.' },
    linkFor: (e) => subHref(e.href, '/previous-year-papers'),
    action: 'View papers',
  },
}

/** The exam catalogue as the API sends it for the header's exam menus: [{ id, label, icon, exams: [{ name, slug, org, href }] }]. */
const catalogueOf = (layout) => layout?.nav.find((n) => n.categories?.length)?.categories ?? []

/**
 * /exams and /previous-year-papers: the whole exam catalogue grouped by category, with a name search and a
 * category filter (?category=banking). Live exams come first in each category; the rest show "Coming soon".
 */
export default function ExamDirectoryPage({ mode = 'exams' }) {
  const m = MODES[mode]
  const layoutQuery = useLayout()
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useQueryParam('category')
  usePageMeta(m.meta)

  if (layoutQuery.isPending) return <PageLoader />
  if (layoutQuery.isError) return <LoadError error={layoutQuery.error} onRetry={() => layoutQuery.refetch()} className="my-16" />

  const catalogue = catalogueOf(layoutQuery.data)
  const all = catalogue.flatMap((c) => c.exams)
  const liveCount = new Set(all.filter((e) => m.linkFor(e)).map((e) => e.slug)).size
  const needle = q.trim().toLowerCase()
  const shown = catalogue
    .filter((c) => !categoryId || c.id === categoryId)
    .map((c) => ({
      ...c,
      exams: c.exams
        .filter((e) => !needle || e.name.toLowerCase().includes(needle) || e.slug.includes(needle))
        .sort((a, b) => Number(Boolean(m.linkFor(b))) - Number(Boolean(m.linkFor(a)))),
    }))
    .filter((c) => c.exams.length > 0)

  return (
    <>
      <PageHeader crumbs={[{ label: 'Home', to: '/' }, { label: m.crumb }]} title={m.title} intro={m.intro}>
        <p className="mt-4 text-sm font-semibold text-slate-600">
          {all.length} exams · {catalogue.length} categories · <span className="text-emerald-700">{liveCount} live</span>
        </p>
      </PageHeader>

      <div className="sticky top-[165px] z-20 border-b border-slate-200 bg-white/95 backdrop-blur md:top-[6.75rem]">
        <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-5 lg:px-12">
          <label className="relative block lg:w-72 lg:shrink-0">
            <span className="sr-only">Search exams</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search an exam, e.g. SBI PO"
              className="h-10 w-full rounded-lg bg-white pl-9 pr-3 text-sm text-ink ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </label>
          <FilterChips
            label="Filter by category"
            options={catalogue.map((c) => ({ id: c.id, label: c.label, count: c.exams.length }))}
            value={categoryId}
            onChange={setCategoryId}
            allCount={all.length}
          />
        </div>
      </div>

      <div className="w-full space-y-6 px-4 pb-12 pt-8 sm:px-6 lg:px-12">
        {shown.length === 0 && (
          <div className="rounded-md bg-white p-8 text-center shadow-sm" role="status">
            <p className="font-semibold text-ink">No exam matches “{q}”.</p>
            <button type="button" onClick={() => { setQ(''); setCategoryId(null) }} className="mt-3 text-sm font-bold text-primary-700 hover:underline">
              Show all exams
            </button>
          </div>
        )}

        {shown.map((c) => {
          const Icon = iconFor(c.icon, Circle)
          return (
            <section key={c.id} id={c.id} aria-labelledby={`cat-${c.id}`} className="scroll-mt-64 rounded-md bg-white p-5 shadow-sm shadow-primary-900/5 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-md bg-primary-600 text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 id={`cat-${c.id}`} className="text-2xl font-semibold tracking-tight text-primary-900">
                  {c.label}
                </h2>
                <span className="text-sm font-semibold text-slate-500">({c.exams.length})</span>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {c.exams.map((e) => {
                  const to = m.linkFor(e)
                  return (
                    <li key={e.slug}>
                      {to ? (
                        <SmartLink
                          href={to}
                          className="group flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                          <ExamLogo org={e.org} name={e.name} className="size-11" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-bold text-ink">{e.name}</span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
                              {m.action}
                              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                            </span>
                          </span>
                        </SmartLink>
                      ) : (
                        <div className="flex h-full items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3.5" title="Coming soon">
                          <ExamLogo org={e.org} name={e.name} className="size-11 opacity-70" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-slate-600">{e.name}</span>
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Coming soon</span>
                          </span>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
