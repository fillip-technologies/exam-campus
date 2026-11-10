import { CheckCircle2 } from 'lucide-react'
import { iconFor } from '@/lib/icons'

/** Slim strip of what every test series includes. Only state things that are true of the product. */
export default function WhyExamCampus({ section }) {
  const { anchorId, title, items } = section
  return (
    <section id={anchorId ?? undefined} aria-labelledby="why-title" className="border-t border-slate-200 bg-surface">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
        <h2 id="why-title" className="text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
          {title}
        </h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {items.map(({ icon, title: itemTitle, text }) => {
            const Icon = iconFor(icon, CheckCircle2)
            return (
              <li key={itemTitle ?? text} className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-600">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  {itemTitle && <span className="block font-semibold text-ink">{itemTitle}</span>}
                  {text && <span className="mt-1 block text-sm leading-relaxed text-slate-600">{text}</span>}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
