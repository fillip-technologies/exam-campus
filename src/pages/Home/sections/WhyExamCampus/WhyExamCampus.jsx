import { BarChart3, FileCheck2, Languages, MonitorCheck } from 'lucide-react'

const points = [
  { icon: MonitorCheck, title: 'Real exam interface', text: 'Practise on a timed test screen that follows the actual exam pattern.' },
  { icon: FileCheck2, title: 'Detailed solutions', text: 'Every question comes with a clear solution you can review after the test.' },
  { icon: BarChart3, title: 'Analysis after every test', text: 'See your score, accuracy and weak areas as soon as you submit.' },
  { icon: Languages, title: 'Hindi and English', text: 'Choose the language you are most comfortable with.' },
]

/** Slim strip of what every test series includes. Only state things that are true of the product. */
export default function WhyExamCampus() {
  return (
    <section aria-labelledby="why-title" className="border-t border-slate-200 bg-surface">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
        <h2 id="why-title" className="text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
          Why practise on ExamCampus
        </h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {points.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-600">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-ink">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
