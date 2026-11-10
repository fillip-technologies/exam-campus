import { ArrowRight } from 'lucide-react'

/** Quiet, in-flow prompt placed between information sections. Renders nothing without a series. */
export default function InlineSeriesCta({ examName, series, text }) {
  if (!series) return null
  return (
    <aside className="my-2 flex flex-col gap-3 rounded-md border border-slate-200 bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-slate-700">{text ?? `Practise ${examName} with timed, exam-pattern tests.`}</p>
      <a
        href="#test-series"
        className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900"
      >
        View {series.title}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </a>
    </aside>
  )
}
