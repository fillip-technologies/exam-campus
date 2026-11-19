import { ArrowRight } from 'lucide-react'
import SmartLink from '@/components/common/SmartLink'

/**
 * Closing call to action. `title` and `text` override the default exam wording (used by class pages).
 * Hrefs may be on-page anchors ("#test-series") or other pages ("/exams/sbi-po#test-series").
 */
export default function HubFinalCta({ examName, title, text, primaryLabel, primaryHref = '#test-series', secondaryHref = '#free-test', wide = false }) {
  return (
    <section id="get-started" aria-labelledby="exam-cta-title" className="border-t border-primary-100 bg-primary-50">
      <div className={`flex w-full flex-col items-start justify-between gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:items-center ${wide ? 'lg:px-12' : 'mx-auto max-w-6xl lg:px-8'}`}>
        <div>
          <h2 id="exam-cta-title" className="text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
            {title ?? `Ready to Start Preparing for ${examName}?`}
          </h2>
          <p className="mt-2 max-w-xl text-lg text-slate-600">
            {text ?? 'Choose the right Test Series, practise regularly and prepare with confidence.'}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <SmartLink
            href={primaryHref}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3.5 text-base font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {primaryLabel ?? `Explore ${examName} Test Series`}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </SmartLink>
          <SmartLink
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-base font-bold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-white hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Take a Free Test
          </SmartLink>
        </div>
      </div>
    </section>
  )
}
