import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import ExamLogo from '@/components/common/ExamLogo'

const toneStyles = {
  info: 'bg-primary-50 text-primary-700 ring-primary-200',
  warning: 'bg-accent-50 text-accent-700 ring-accent-100',
}

export default function ExamHero({ exam }) {
  const { name, fullName, category, org, description, status } = exam

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Exams', to: '/#exams' },
    { label: category, to: '/#exams' },
    { label: name },
  ]

  return (
    <section id="overview" aria-labelledby="exam-title" className="scroll-mt-56 md:scroll-mt-44 border-b border-slate-200 bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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
            <p className="text-sm font-semibold text-primary-600">Exam Hub</p>
            <h1 id="exam-title" className="mt-1 text-4xl font-semibold tracking-tight text-primary-900 sm:text-5xl">
              {name}
            </h1>
            <p className="mt-1 text-lg text-slate-600">{fullName}</p>

            {status && (
              <p className={`mt-3 inline-flex rounded-sm px-2.5 py-1 text-sm font-semibold ring-1 ring-inset ${toneStyles[status.tone] ?? toneStyles.info}`}>
                {status.label}
              </p>
            )}

            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">{description}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#test-series"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                View Test Series
              </a>
              <a
                href="#free-test"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-bold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-white hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Take a Free Test
              </a>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Exam information, syllabus, previous year papers, free tests and the Test Series for {name}, all in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
