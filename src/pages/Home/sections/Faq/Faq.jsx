import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import SmartLink from '@/components/common/SmartLink'

export default function Faq({ section }) {
  const { anchorId, title, subtitle, ctas, data } = section
  const faqs = data?.faqs ?? []
  const cta = ctas[0]
  const [open, setOpen] = useState(0)

  return (
    <section id={anchorId ?? undefined} aria-labelledby="faq-title" className="scroll-mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:px-12 lg:py-16">
        <div>
          <h2 id="faq-title" className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl lg:leading-[1.1]">
            {title}
          </h2>
          {subtitle && <p className="mt-4 text-lg leading-relaxed text-slate-500">{subtitle}</p>}
          {cta?.href && (
            <SmartLink href={cta.href} className="mt-3 inline-block font-semibold text-primary-700 underline-offset-4 hover:underline">
              {cta.label}
            </SmartLink>
          )}
        </div>

        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-ink transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600"
                  >
                    {f.q}
                    {isOpen ? (
                      <Minus className="size-5 shrink-0 text-primary-600" aria-hidden="true" />
                    ) : (
                      <Plus className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
                    )}
                  </button>
                </h3>
                {isOpen && (
                  <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="animate-fade-in pb-5 pr-9 leading-relaxed text-slate-600">
                    {f.a}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
