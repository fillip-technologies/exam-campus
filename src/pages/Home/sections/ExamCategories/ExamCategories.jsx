import { ArrowRight, Circle } from 'lucide-react'
import ExamLogo from '@/components/common/ExamLogo'
import SmartLink from '@/components/common/SmartLink'
import { iconFor } from '@/lib/icons'

/** Popular Exams grid: categories ticked "show in home grid", each with its first exams (config.examsPerCard). */
export default function ExamCategories({ section }) {
  const { anchorId, title, subtitle, ctas, config = {}, data } = section
  const shown = config.examsPerCard ?? 5
  const cta = ctas[0]

  return (
    <section id={anchorId ?? undefined} aria-labelledby="categories-title" className="scroll-mt-24 border-t border-slate-200 bg-surface">
      <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <h2 id="categories-title" className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {title}
          </h2>
          {subtitle && <p className="max-w-md text-lg leading-relaxed text-slate-500">{subtitle}</p>}
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
          {data.categories.map((c) => {
            const Icon = iconFor(c.icon, Circle)
            return (
              <li key={c.id} id={`exams/${c.id}`} className="flex scroll-mt-24 flex-col rounded-md border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-100">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold text-ink">{c.label}</h3>
                </div>

                <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                  {c.exams.slice(0, shown).map((e) => (
                    <li key={e.slug}>
                      <SmartLink
                        href={e.href}
                        className="group flex items-center gap-3 py-2.5 text-[0.95rem] text-slate-700 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600"
                        fallback={
                          <div className="flex items-center gap-3 py-2.5 text-[0.95rem] text-slate-500">
                            <ExamLogo org={e.org} name={e.name} className="size-8" />
                            <span className="min-w-0 flex-1 truncate">{e.name}</span>
                            <span className="shrink-0 rounded-sm bg-slate-100 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase text-slate-500">Soon</span>
                          </div>
                        }
                      >
                        <ExamLogo org={e.org} name={e.name} className="size-8" />
                        <span className="min-w-0 flex-1 truncate">{e.name}</span>
                        <ArrowRight className="size-4 text-slate-300 transition duration-150 group-hover:translate-x-0.5 group-hover:text-primary-600" aria-hidden="true" />
                      </SmartLink>
                    </li>
                  ))}
                </ul>

                <SmartLink
                  href={c.href ?? `#exams/${c.id}`}
                  className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  View all {c.label}
                  {/exams$/i.test(c.label) ? '' : ' exams'}
                  {c.totalExams > shown && ` (${c.totalExams})`}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </SmartLink>
              </li>
            )
          })}
          {cta && (
            <li className="flex">
              <SmartLink
                href={cta.href ?? '#all-exams'}
                className="group flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-primary-200 bg-white/60 p-5 text-center transition-colors hover:border-primary-600 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <span className="text-lg font-semibold text-ink">{cta.label}</span>
                {cta.text && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700">
                    {cta.text}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                )}
              </SmartLink>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
