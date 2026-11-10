import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import AuthLink from '@/components/common/AuthLink'
import ExamLogo from '@/components/common/ExamLogo'
import { freeTestFilters, freeTests } from '@/data/freeTests'

const MAX_ROWS = 5

function Meta({ questions, minutes }) {
  return (
    <>
      {questions} Questions <span aria-hidden="true">·</span> {minutes} Minutes
    </>
  )
}

function FeaturedTest({ test }) {
  const { exam, org, questions, minutes, slug } = test
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
        {['Full-length paper in the real exam format', 'Instant score and answer review'].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-primary-600" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>

      <AuthLink
        to={`/free-test/${slug}`}
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
  const { exam, org, questions, minutes, slug } = test
  return (
    <AuthLink
      to={`/free-test/${slug}`}
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

export default function FreeTests() {
  const [filter, setFilter] = useState('All')
  const visible = filter === 'All' ? freeTests : freeTests.filter((t) => t.category === filter)
  const [featured, ...rest] = visible
  const rows = rest.slice(0, MAX_ROWS)

  return (
    <section id="free-tests" aria-labelledby="free-title" className="scroll-mt-24 border-t border-slate-200 bg-surface">
      <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <h2 id="free-title" className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Start Practising for Free.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-slate-500">
            Take a free mock test, experience the ExamCampus test platform and start preparing for your exam today.
          </p>
        </div>

        {/* Filter */}
        <div className="-mx-4 mt-10 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0 lg:mt-12">
          <div role="group" aria-label="Filter free tests by category" className="flex min-w-max gap-2">
            {freeTestFilters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-sm px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600 ${
                  filter === f
                    ? 'bg-primary-800 text-white'
                    : 'text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-white hover:text-primary-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div key={filter} className="mt-6 grid animate-fade-in gap-6 lg:grid-cols-[1fr_1.35fr]">
          <FeaturedTest test={featured} />

          <div className="flex flex-col">
            {rows.length > 0 ? (
              <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
                {rows.map((t) => (
                  <li key={t.slug}>
                    <TestRow test={t} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-md border border-dashed border-slate-300 bg-white px-5 py-8 text-slate-500">
                This is the only free test in this category for now. Explore all free tests to try more exams.
              </p>
            )}

            <a
              href="#all-free-tests"
              className="group mt-5 inline-flex items-center gap-2 self-start text-base font-bold text-primary-700 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 lg:mt-auto lg:self-end lg:pt-5"
            >
              Explore All Free Tests
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
