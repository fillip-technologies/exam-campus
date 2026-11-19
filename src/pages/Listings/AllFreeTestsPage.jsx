import { ArrowRight, CircleHelp, Clock } from 'lucide-react'
import { useHome } from '@/api/public'
import AuthLink from '@/components/common/AuthLink'
import ExamLogo from '@/components/common/ExamLogo'
import FilterChips from '@/components/common/FilterChips'
import { LoadError, PageLoader } from '@/components/common/LoadState'
import PageHeader from '@/components/common/PageHeader'
import { usePageMeta } from '@/lib/usePageMeta'
import { useQueryParam } from '@/lib/useQueryParam'

/**
 * /free-tests: every free mock test (the home page's FREE_TESTS section data) as cards, filtered by exam category
 * (?category=banking). Starting a test needs a login, like on the home page.
 */
export default function AllFreeTestsPage() {
  const homeQuery = useHome()
  const [categoryId, setCategoryId] = useQueryParam('category')
  usePageMeta({
    title: 'Free Mock Tests for Government Exams | ExamCampus',
    description: 'Take a free full-length mock test for Banking, SSC, Railway, Teaching and other exams, with instant score and answer review.',
  })

  if (homeQuery.isPending) return <PageLoader />
  if (homeQuery.isError) return <LoadError error={homeQuery.error} onRetry={() => homeQuery.refetch()} className="my-16" />

  const data = homeQuery.data.sections.find((s) => s.type === 'FREE_TESTS')?.data ?? { filters: [], items: [] }
  const tests = data.items
  const shown = categoryId ? tests.filter((t) => t.categorySlug === categoryId) : tests
  const countFor = (id) => tests.filter((t) => t.categorySlug === id).length

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Free Mock Tests' }]}
        title="Free Mock Tests"
        intro="Full-length papers in the real exam format, free. Take one to see where you stand before you pick a test series."
      >
        <p className="mt-4 text-sm font-semibold text-slate-600">{tests.length} free tests</p>
      </PageHeader>

      <div className="w-full space-y-6 px-4 pb-12 pt-8 sm:px-6 lg:px-12">
        {data.filters.length > 0 && (
          <FilterChips
            label="Filter free tests by category"
            options={data.filters.map((f) => ({ id: f.id, label: f.label, count: countFor(f.id) }))}
            value={categoryId}
            onChange={setCategoryId}
            allCount={tests.length}
          />
        )}

        {shown.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" aria-live="polite">
            {shown.map((t) => (
              <li key={t.slug}>
                <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-900/10">
                  <div className="flex items-start justify-between gap-3">
                    <ExamLogo org={t.org} name={t.exam} className="size-12" />
                    <span className="rounded bg-emerald-50 px-2 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-emerald-700">Free</span>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-accent-600">{t.exam}</p>
                  <h2 className="mt-1 text-lg font-bold leading-snug text-ink">{t.title ?? `${t.exam} Free Mock Test`}</h2>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    {t.questions != null && (
                      <li className="flex items-center gap-1.5">
                        <CircleHelp className="size-4 text-slate-400" aria-hidden="true" />
                        {t.questions} Questions
                      </li>
                    )}
                    {t.minutes != null && (
                      <li className="flex items-center gap-1.5">
                        <Clock className="size-4 text-slate-400" aria-hidden="true" />
                        {t.minutes} Minutes
                      </li>
                    )}
                  </ul>
                  <div className="mt-auto pt-5">
                    <AuthLink
                      to={t.href}
                      reason={`Please log in to start the ${t.exam} free mock test.`}
                      className="group flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      Start Free Test
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </AuthLink>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-md bg-white p-8 text-center shadow-sm" role="status">
            <p className="font-semibold text-ink">No free tests in this category yet.</p>
            <button type="button" onClick={() => setCategoryId(null)} className="mt-3 text-sm font-bold text-primary-700 hover:underline">
              Show all free tests
            </button>
          </div>
        )}
      </div>
    </>
  )
}
