import EnrollButton from '@/components/common/EnrollButton'
import { ArrowRight, Check } from 'lucide-react'

// PLACEHOLDER pricing: replace with the real plan and price.
const benefits = [
  'Access to every test series across all exams',
  'Full-length, sectional and topic-wise tests',
  'Previous year papers with solutions',
  'Detailed analysis after every test',
]

export default function TestPass() {
  return (
    <section id="pass" aria-labelledby="pass-title" className="scroll-mt-24 bg-primary-800 text-white">
      <div className="mx-auto grid w-full items-center gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-12 lg:py-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-accent-400">ExamCampus Pass</p>
          <h2 id="pass-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            All Test Series. One Pass.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-200">
            Preparing for more than one exam? Get unlimited access to test series across exams with a single pass.
          </p>

          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-primary-100">
                <Check className="mt-1 size-4 shrink-0 text-accent-400" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md bg-white p-6 text-ink sm:p-8">
          <p className="text-sm font-semibold text-primary-600">ExamCampus Pass</p>
          <p className="mt-1 text-xl font-semibold">12 Months access</p>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-2">
            <span className="text-4xl font-bold">₹1,999</span>
            <span className="text-slate-400 line-through">₹5,999</span>
            <span className="text-sm font-semibold text-accent-700">(66% off)</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Valid on all test series for 12 months.</p>

          <EnrollButton to="/enroll/pass" what="ExamCampus Pass" className="group mt-6 flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3.5 text-base font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
            Get ExamCampus Pass
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </EnrollButton>
          <a href="#pass" className="mt-3 block text-center text-sm font-semibold text-primary-700 hover:text-primary-900">
            See what is included
          </a>
        </div>
      </div>
    </section>
  )
}
