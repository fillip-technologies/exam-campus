import { ArrowRight } from 'lucide-react'

export default function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="border-t border-primary-100 bg-primary-50">
      <div className="mx-auto flex w-full flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 sm:py-14 lg:flex-row lg:items-center lg:px-12 lg:py-16">
        <div>
          <h2 id="cta-title" className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl">
            Start your preparation today.
          </h2>
          <p className="mt-3 max-w-xl text-lg text-slate-600">
            Take a free mock test and see how ExamCampus helps you practise for your exam.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#free-tests"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-7 py-3.5 text-base font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Take a Free Test
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            href="#test-series"
            className="inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-base font-bold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-white hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Explore Test Series
          </a>
        </div>
      </div>
    </section>
  )
}
