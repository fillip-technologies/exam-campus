import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, BarChart3, CalendarDays, ChevronRight, ClipboardCheck, FileText, GraduationCap, Layers, Lightbulb, Repeat, Timer } from 'lucide-react'
import { useExam } from '@/api/public'
import { pageState } from '@/components/common/LoadState'
import ExamLogo from '@/components/common/ExamLogo'
import JsonLd from '@/components/common/JsonLd'
import HubFinalCta from '@/components/hub/HubFinalCta'
import PaperRow from '@/components/hub/PaperRow'
import SectionShell from '@/components/hub/SectionShell'
import ExamPattern from '@/pages/ExamDetails/components/ExamPattern'
import { samplePapers } from '@/data/samplePapers'
import { groupByYear, paperKey, paperStages, paperYears, sortPapers } from '@/lib/papers'
import { usePageMeta } from '@/lib/usePageMeta'

const chipCls = (active) =>
  `shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
    active ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:ring-primary-600'
  }`

const tips = [
  { icon: Timer, title: 'Solve against the clock', text: 'Attempt each paper in one sitting with the real time limit, so speed improves along with accuracy.' },
  { icon: BarChart3, title: 'Analyse every attempt', text: 'Note why each wrong or skipped question went wrong: concept, calculation or time.' },
  { icon: Repeat, title: 'Spot repeated topics', text: 'Papers from different years show which topics come up again and again. Revise those first.' },
  { icon: ClipboardCheck, title: 'Then take full mocks', text: 'Once past papers feel easy, move to full-length mocks on the latest pattern.' },
]

/**
 * /exams/:slug/previous-year-papers: every previous year paper of an exam, grouped by year, with stage and year
 * filters kept in the URL (?stage=prelims&year=2025) so a filtered list can be shared. Uses the exam hub's data.
 */
export default function ExamPapersPage() {
  const { slug } = useParams()
  const query = useExam(slug)
  const exam = query.data
  const [params, setParams] = useSearchParams()

  usePageMeta({
    title: exam ? `${exam.name} Previous Year Question Papers: Prelims & Mains PDF | ExamCampus` : undefined,
    description: exam ? `Year-wise ${exam.name} previous year question papers for Prelims and Mains. View, download the PDF or attempt online, with the latest exam pattern.` : undefined,
  })

  const state = pageState(query)
  if (state) return state

  const { name, org } = exam
  // Until the API has papers for this exam, dev builds show sample papers (src/data/samplePapers.js); production shows none.
  const papers = exam.previousYearPapers?.length ? exam.previousYearPapers : import.meta.env.DEV ? samplePapers() : []
  const sorted = sortPapers(papers)
  const stages = paperStages(papers)
  const years = paperYears(papers)
  const range = years.length > 1 ? `${years.at(-1)}–${years[0]}` : years[0]

  const stageParam = params.get('stage')
  const yearParam = Number(params.get('year')) || null
  const activeStage = stages.find((s) => s.toLowerCase() === stageParam) ?? null
  const activeYear = years.includes(yearParam) ? yearParam : null
  const filtered = sorted.filter((p) => (!activeStage || p.stage === activeStage) && (!activeYear || p.year === activeYear))
  const groups = groupByYear(filtered)
  const firstPractice = sorted.find((p) => p.practiceUrl)
  const hasCourses = (exam.courses?.length ?? 0) > 0 || import.meta.env.DEV

  // Builds on the address bar as it is right now (the router updates it immediately but re-renders a moment
  // later), so quick successive clicks never drop a filter.
  const setFilter = (key, value) => {
    const next = new URLSearchParams(window.location.search)
    if (value == null) next.delete(key)
    else next.set(key, String(value).toLowerCase())
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const clearFilters = () => setParams({}, { replace: true, preventScrollReset: true })

  const origin = window.location.origin
  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Exams', to: '/#exams' },
    { label: name, to: `/exams/${slug}` },
    { label: 'Previous Year Papers' },
  ]

  return (
    <>
      <JsonLd
        data={{
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name, item: `${origin}/exams/${slug}` },
            { '@type': 'ListItem', position: 3, name: 'Previous Year Papers', item: `${origin}/exams/${slug}/previous-year-papers` },
          ],
        }}
      />

      <section aria-labelledby="papers-title" className="border-b border-slate-200 bg-surface">
        <div className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3.5 text-slate-300" aria-hidden="true" />}
                  {c.to ? (
                    <Link to={c.to} className="hover:text-primary-700 hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-ink">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <ExamLogo org={org} name={name} className="size-16 sm:size-20" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary-600">Previous Year Papers</p>
              <h1 id="papers-title" className="mt-1 text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl">
                {name} Previous Year Question Papers
              </h1>
              <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
                Year-wise {name} {stages.length ? stages.join(' and ') : ''} question papers. View or download the PDF, or attempt a paper online to see where you stand.
              </p>

              {papers.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink ring-1 ring-inset ring-slate-200">
                    <FileText className="size-4 text-primary-600" aria-hidden="true" />
                    {papers.length} Papers
                  </li>
                  <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink ring-1 ring-inset ring-slate-200">
                    <CalendarDays className="size-4 text-primary-600" aria-hidden="true" />
                    {range}
                  </li>
                  {stages.map((s) => (
                    <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink ring-1 ring-inset ring-slate-200">
                      <Layers className="size-4 text-primary-600" aria-hidden="true" />
                      {s}: {papers.filter((p) => p.stage === s).length}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {firstPractice && (
                  <a
                    href={firstPractice.practiceUrl}
                    className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Attempt the Latest Paper
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                )}
                <Link
                  to={`/exams/${slug}`}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-bold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  {name} Exam Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {papers.length > 0 && (
        <div className="sticky top-[165px] z-20 border-b border-slate-200 bg-white/95 backdrop-blur md:top-[6.75rem]">
          <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-6 lg:px-12">
            {stages.length > 1 && (
              <div role="group" aria-label="Filter by stage" className="flex w-fit shrink-0 gap-1 rounded-lg bg-slate-100 p-1">
                {[null, ...stages].map((s) => {
                  const active = activeStage === s
                  const count = s ? papers.filter((p) => p.stage === s).length : papers.length
                  return (
                    <button
                      key={s ?? 'all'}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter('stage', s)}
                      className={`rounded-md px-3.5 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary-600 ${
                        active ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-600 hover:text-ink'
                      }`}
                    >
                      {s ?? 'All'} <span className={active ? 'text-primary-500' : 'text-slate-400'}>({count})</span>
                    </button>
                  )
                })}
              </div>
            )}
            {years.length > 1 && (
              <div role="group" aria-label="Filter by year" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <button type="button" aria-pressed={!activeYear} onClick={() => setFilter('year', null)} className={chipCls(!activeYear)}>
                  All years
                </button>
                {years.map((y) => (
                  <button key={y} type="button" aria-pressed={activeYear === y} onClick={() => setFilter('year', y)} className={chipCls(activeYear === y)}>
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full space-y-6 px-4 pb-10 pt-8 sm:px-6 lg:px-12">
        {papers.length === 0 ? (
          <div className="rounded-md bg-white p-8 text-center shadow-sm">
            <FileText className="mx-auto size-10 text-slate-300" aria-hidden="true" />
            <p className="mt-3 text-lg font-semibold text-ink">{name} previous year papers will be added soon.</p>
            <p className="mt-1 text-slate-600">Meanwhile, practise the exam pattern with a free mock test.</p>
            <Link to={`/exams/${slug}#free-test`} className="mt-5 inline-flex rounded-lg bg-accent-500 px-5 py-2.5 font-bold text-primary-900 hover:bg-accent-400">
              Take a Free Test
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-600" aria-live="polite">
                Showing <strong className="text-ink">{filtered.length}</strong> of {papers.length} papers
              </p>
              {(activeStage || activeYear) && (
                <button type="button" onClick={clearFilters} className="text-sm font-bold text-primary-700 hover:underline">
                  Clear filters
                </button>
              )}
            </div>

            {groups.length === 0 && (
              <div className="rounded-md bg-white p-8 text-center shadow-sm">
                <p className="font-semibold text-ink">No papers match these filters.</p>
                <button type="button" onClick={clearFilters} className="mt-3 text-sm font-bold text-primary-700 hover:underline">
                  Show all papers
                </button>
              </div>
            )}

            {groups.map(([y, list]) => (
              <section key={y} id={`year-${y}`} aria-labelledby={`year-${y}-title`} className="scroll-mt-64 rounded-md bg-white p-5 shadow-sm shadow-primary-900/5 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id={`year-${y}-title`} className="text-2xl font-semibold tracking-tight text-primary-900">
                    {name} {y} Question Papers
                  </h2>
                  <span className="text-sm font-semibold text-slate-500">
                    {list.length} paper{list.length > 1 ? 's' : ''}
                  </span>
                </div>
                <ul className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200">
                  {list.map((p) => (
                    <PaperRow key={paperKey(p)} examName={name} paper={p} />
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to={`/exams/${slug}#test-series`}
            className="group flex items-center gap-4 rounded-xl bg-primary-900 p-5 text-white transition-colors hover:bg-primary-800 sm:p-6"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-white/10">
              <ClipboardCheck className="size-6 text-accent-400" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-bold">{name} Test Series</span>
              <span className="block text-sm text-primary-100">Full-length mocks on the latest pattern, with analysis.</span>
            </span>
            <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {hasCourses && (
            <Link
              to={`/exams/${slug}#courses`}
              className="group flex items-center gap-4 rounded-xl bg-accent-500 p-5 text-primary-900 transition-colors hover:bg-accent-400 sm:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-white/30">
                <GraduationCap className="size-6" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold">{name} Courses</span>
                <span className="block text-sm text-primary-900/80">Live and recorded classes with a free demo.</span>
              </span>
              <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          )}
        </div>

        <SectionShell icon={Lightbulb} id="how-to-use" title={`How to Use ${name} Previous Year Papers`}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tips.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-xl bg-surface p-5">
                <Icon className="size-6 text-primary-600" aria-hidden="true" />
                <p className="mt-3 font-bold text-ink">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ul>
        </SectionShell>

        <ExamPattern examName={name} pattern={exam.examPattern} />
      </div>

      <HubFinalCta
        examName={name}
        text="Past papers show you the exam. Mock tests and courses get you ready for it."
        primaryHref={`/exams/${slug}#test-series`}
        secondaryHref={`/exams/${slug}#free-test`}
        wide
      />
    </>
  )
}
