import EnrollButton from '@/components/common/EnrollButton'
import { ArrowRight, Check } from 'lucide-react'
import { formatRupees } from '@/lib/format'

/** ExamCampus Pass: copy from the section, plan (price, MRP, validity, benefits) from the active Pass. */
export default function TestPass({ section }) {
  const { anchorId, eyebrow, title, subtitle, config = {}, data: pass } = section
  if (!pass) return null
  const off = pass.discountPercent ?? 0

  return (
    <section id={anchorId ?? undefined} aria-labelledby="pass-title" className="scroll-mt-24 bg-primary-800 text-white">
      <div className="mx-auto grid w-full items-center gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-12 lg:py-16">
        <div>
          {eyebrow && <p className="text-sm font-bold uppercase tracking-wider text-accent-400">{eyebrow}</p>}
          <h2 id="pass-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {title}
          </h2>
          {subtitle && <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-200">{subtitle}</p>}

          <ul className="mt-6 space-y-3">
            {pass.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-primary-100">
                <Check className="mt-1 size-4 shrink-0 text-accent-400" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md bg-white p-6 text-ink sm:p-8">
          <p className="text-sm font-semibold text-primary-600">{pass.title}</p>
          <p className="mt-1 text-xl font-semibold">{pass.validity} access</p>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-2">
            <span className="text-4xl font-bold">{formatRupees(pass.price)}</span>
            {pass.mrp > pass.price && <span className="text-slate-400 line-through">{formatRupees(pass.mrp)}</span>}
            {off > 0 && <span className="text-sm font-semibold text-accent-700">({off}% off)</span>}
          </div>
          {config.validityNote && <p className="mt-1 text-sm text-slate-500">{config.validityNote}</p>}

          <EnrollButton to={pass.href} what={pass.title} className="group mt-6 flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3.5 text-base font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
            {config.buttonLabel ?? `Get ${pass.title}`}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </EnrollButton>
          {config.secondaryLabel && (
            <a href={`#${anchorId ?? 'pass'}`} className="mt-3 block text-center text-sm font-semibold text-primary-700 hover:text-primary-900">
              {config.secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
