import AuthLink from '@/components/common/AuthLink'
import { ArrowRight, PlayCircle } from 'lucide-react'
import SectionShell from './SectionShell'
import { formatMinutes } from '@/lib/format'

/** tests: [{ id, title, questions, durationMinutes, type, startUrl }]  Works for one or many free tests. */
export default function FreeMockTest({ examName, tests = [] }) {
  if (!tests.length) return null

  return (
    <SectionShell
      icon={PlayCircle}
      id="free-test"
      title={`Try a Free ${examName} Mock Test`}
      intro="Experience the ExamCampus test platform before you buy a Test Series."
    >
      <ul className={`grid gap-4 ${tests.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {tests.map((t) => (
          <li key={t.id} className="flex flex-col gap-5 rounded-md border border-primary-200 bg-primary-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <span className="rounded-sm bg-accent-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-accent-700">Free</span>
              <h3 className="mt-3 text-xl font-semibold text-ink">{t.title}</h3>
              <p className="mt-1.5 text-slate-600">
                {t.questions} Questions <span aria-hidden="true">·</span> {formatMinutes(t.durationMinutes)}
                {t.type && (
                  <>
                    {' '}
                    <span aria-hidden="true">·</span> {t.type}
                  </>
                )}
              </p>
            </div>
            <AuthLink
              to={t.startUrl}
              reason={`Please log in to start ${t.title}.`}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-base font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Start Free Test
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </AuthLink>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
