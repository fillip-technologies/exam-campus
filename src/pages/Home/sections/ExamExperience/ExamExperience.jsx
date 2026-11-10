import { ArrowRight, BarChart3, LayoutGrid, Target, Timer } from 'lucide-react'
import TestPreview from './TestPreview'

const benefits = [
  { icon: Timer, title: 'Timed Test Experience', text: 'Practice managing your time in a focused exam environment.' },
  { icon: LayoutGrid, title: 'Easy Question Navigation', text: 'Move between questions and keep track of your progress.' },
  { icon: BarChart3, title: 'Detailed Performance Analysis', text: 'Understand your score, accuracy and performance after every test.' },
  { icon: Target, title: 'Learn From Every Attempt', text: 'Identify areas that need more practice and prepare smarter.' },
]

export default function ExamExperience() {
  return (
    <section id="free-test" aria-labelledby="experience-title" className="scroll-mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full gap-x-16 gap-y-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:gap-y-10 lg:px-12 lg:py-16">
        {/* Heading */}
        <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
          <h2 id="experience-title" className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Practice Like It&rsquo;s the Real Exam.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-500">
            Experience a focused test environment designed to help you practise, manage your time and perform with confidence.
          </p>
        </div>

        {/* Interface preview */}
        <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <TestPreview />
        </div>

        {/* Benefits + CTA */}
        <div className="lg:col-start-2 lg:row-start-2">
          <ul className="border-t border-slate-200">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 border-b border-slate-200 py-5">
                <Icon className="mt-0.5 size-6 shrink-0 text-primary-600" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-1 leading-relaxed text-slate-500">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#free-tests"
            className="group mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-7 py-3.5 text-base font-bold text-primary-900 transition-all hover:-translate-y-px hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Try a Free Test
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
