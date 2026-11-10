import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import AuthLink from '@/components/common/AuthLink'
import ExamLogo from '@/components/common/ExamLogo'
import SmartLink from '@/components/common/SmartLink'

const ALL = '__all'
const defaultHighlights = ['Full-length paper in the real exam format', 'Instant score and answer review']

function Meta({ questions, minutes }) {
  return (
    <>
      {questions} Questions <span aria-hidden="true">·</span> {minutes} Minutes
    </>
  )
}

function FeaturedTest({ test, highlights }) {
  const { exam, org, questions, minutes, href } = test
  const points = test.highlights?.length ? test.highlights : highlights
  return (
    <div className="flex h-full flex-col rounded-md border border-primary-200 bg-primary-50 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="rounded-sm bg-accent-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-accent-700">
          Free
        </span>
        <ExamLogo org={org} name={exam} className="size-12" />
      </div>

      <p className="mt-6 text-sm font-semibold text-primary-600">Free Mock Test</p>
      <h3 className="mt-1 text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl">{exam}</h3>
      <p className="mt-3 font-medium text-slate-600">
        <Meta questions={questions} minutes={minutes} />
      </p>

      <ul className="mt-5 space-y-2 text-sm text-slate-600">
        {points.map((t) => (
          <li key={t} className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-primary-600" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>

      <AuthLink
        to={href}
        reason={`Please log in to start the ${exam} free mock test.`}
        className="group mt-8 inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-base font-bold text-primary-900 transition-all hover:-translate-y-px hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:mt-auto sm:pt-3"
      >
        Start Free Test
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </AuthLink>
    </div>
  )
}

function TestRow({ test }) {
  const { exam, org, questions, minutes, href } = test
  return (
    <AuthLink
      to={href}
      reason={`Please log in to start the ${exam} free mock test.`}
      className="group flex items-center gap-4 px-2 py-4 transition-colors hover:bg-primary-50/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600 sm:px-4"
    >
      <ExamLogo org={org} name={exam} className="size-11" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-ink sm:text-lg">{exam}</p>
        <p className="text-xs font-semibold text-primary-600">Free Mock Test</p>
        <p className="mt-0.5 text-sm text-slate-500">
          <Meta questions={questions} minutes={minutes} />
        </p>
      </div>
      <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-700">
        <span className="hidden sm:inline">Start Test</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        <span className="sr-only sm:hidden">Start Test</span>
      </span>
    </AuthLink>
  )
}

/** Free tests: one featured card + a short list, filtered by the categories ticked "show in free-test filter". */
export default function FreeTests({ section }) {
  const { anchorId, title, subtitle, ctas, config = {}, data } = section
  const [filter, setFilter] = useState(ALL)
  const filters = [{ id: ALL, label: config.allFilterLabel ?? 'All' }, ...data.filters]
  const visible = filter === ALL ? data.items : data.items.filter((t) => t.categorySlug === filter)
  // the admin's "featured" test leads; otherwise the first one
  const featured = visible.find((t) => t.featured) ?? visible[0]
  const rows = visible.filter((t) => t !== featured).slice(0, config.maxRows ?? 5)
  const cta = ctas[0]

  return (
    <section id={anchorId ?? undefined} aria-labelledby="free-title" className="scroll-mt-24 border-t border-slate-200 bg-surface">
      <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <h2 id="free-title" className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {title}
          </h2>
          {subtitle && <p className="max-w-md text-lg leading-relaxed text-slate-500">{subtitle}</p>}
        </div>

        {/* Filter */}
        <div className="-mx-4 mt-10 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0 lg:mt-12">
          <div role="group" aria-label="Filter free tests by category" className="flex min-w-max gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-sm px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600 ${
                  filter === f.id
                    ? 'bg-primary-800 text-white'
                    : 'text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-white hover:text-primary-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div key={filter} className="mt-6 grid animate-fade-in gap-6 lg:grid-cols-[1fr_1.35fr]">
          {featured ? (
            <FeaturedTest test={featured} highlights={config.featuredHighlights?.length ? config.featuredHighlights : defaultHighlights} />
          ) : (
            <p className="rounded-md border border-dashed border-slate-300 bg-white px-5 py-8 text-slate-500">No free tests in this category yet.</p>
          )}

          <div className="flex flex-col">
            {!featured ? null : rows.length > 0 ? (
              <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
                {rows.map((t) => (
                  <li key={t.slug}>
                    <TestRow test={t} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-md border border-dashed border-slate-300 bg-white px-5 py-8 text-slate-500">
                {config.emptyRowsMessage ?? 'This is the only free test in this category for now.'}
              </p>
            )}

            {cta?.href && (
              <SmartLink
                href={cta.href}
                className="group mt-5 inline-flex items-center gap-2 self-start text-base font-bold text-primary-700 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 lg:mt-auto lg:self-end lg:pt-5"
              >
                {cta.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </SmartLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
