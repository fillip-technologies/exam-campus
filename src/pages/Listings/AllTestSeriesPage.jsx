import { useHome, useSeries } from '@/api/public'
import CourseCard from '@/components/common/CourseCard'
import FilterChips from '@/components/common/FilterChips'
import { LoadError, PageLoader } from '@/components/common/LoadState'
import PageHeader from '@/components/common/PageHeader'
import SeriesTabs from '@/pages/Home/sections/Hero/SeriesTabs'
import { usePageMeta } from '@/lib/usePageMeta'
import { useQueryParam } from '@/lib/useQueryParam'

/**
 * /test-series: every test series in a grid. The tabs (Popular, Latest, Sectional...) and exam categories are the
 * ones the home page uses (HERO section data); the cards come from GET /public/series. Filters live in the URL
 * (?tab=sectional&category=banking).
 */
export default function AllTestSeriesPage() {
  const homeQuery = useHome()
  const [tabParam, setTab] = useQueryParam('tab')
  const [categoryParam, setCategory] = useQueryParam('category')
  usePageMeta({
    title: 'All Test Series: Mock Tests for Banking, SSC, Railway & More | ExamCampus',
    description: 'Every ExamCampus test series in one place. Filter by exam category and type: full-length, sectional, topic-wise and previous year papers.',
  })

  const hero = homeQuery.data?.sections.find((s) => s.type === 'HERO')?.data
  const tabs = hero?.tabs ?? []
  const categories = hero?.categories ?? []
  const tab = tabs.find((t) => t.id === tabParam) ?? tabs[0]
  const category = categories.find((c) => c.id === categoryParam) ?? null
  const seriesQuery = useSeries({ tab: tab?.id, category: category?.id ?? null }, { enabled: Boolean(tab) })

  if (homeQuery.isPending) return <PageLoader />
  if (homeQuery.isError) return <LoadError error={homeQuery.error} onRetry={() => homeQuery.refetch()} className="my-16" />

  const items = seriesQuery.data?.items ?? []

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'All Test Series' }]}
        title="All Test Series"
        intro="Full-length mocks, sectional and topic-wise tests and previous year papers for every exam. Pick a type and an exam category."
      />

      <div className="w-full space-y-6 px-4 pb-12 pt-8 sm:px-6 lg:px-12">
        <div className="space-y-4 rounded-md bg-white p-5 shadow-sm sm:p-6">
          {tabs.length > 0 && <SeriesTabs tabs={tabs} activeId={tab?.id} onChange={(id) => setTab(id === tabs[0]?.id ? null : id)} />}
          {categories.length > 0 && (
            <FilterChips label="Filter by exam category" options={categories.map((c) => ({ id: c.id, label: c.label }))} value={category?.id ?? null} onChange={setCategory} allLabel="All exams" />
          )}
        </div>

        <section id="st-panel" role="tabpanel" aria-labelledby={tab ? `st-tab-${tab.id}` : undefined} aria-busy={seriesQuery.isFetching}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-primary-900">
              {tab?.heading ?? 'Test Series'}
              {category && <span className="ml-2 text-base font-medium text-slate-500">· {category.label}</span>}
            </h2>
            {!seriesQuery.isPending && (
              <p className="text-sm text-slate-600" aria-live="polite">
                {items.length} test series
              </p>
            )}
          </div>

          <div className={`mt-5 transition-opacity ${seriesQuery.isFetching && !seriesQuery.isPending ? 'opacity-60' : ''}`}>
            {seriesQuery.isPending ? (
              <div className="h-96 animate-pulse rounded-xl bg-white" aria-hidden="true" />
            ) : seriesQuery.isError ? (
              <LoadError error={seriesQuery.error} onRetry={() => seriesQuery.refetch()} />
            ) : items.length > 0 ? (
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {items.map((p, i) => (
                  <li key={p.slug}>
                    <CourseCard product={p} toneIndex={i} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-md bg-white p-8 text-center shadow-sm" role="status">
                <p className="font-semibold text-ink">No {tab?.label.toLowerCase()} test series for {category?.label ?? 'all exams'} yet.</p>
                <button type="button" onClick={() => { setTab(null); setCategory(null) }} className="mt-3 text-sm font-bold text-primary-700 hover:underline">
                  Show all test series
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
