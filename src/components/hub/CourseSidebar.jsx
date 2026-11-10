import EnrollButton from '@/components/common/EnrollButton'
import { ArrowRight, Check } from 'lucide-react'
import { formatRupees } from '@/lib/format'

/**
 * Sticky purchase card for the hub's main test series (desktop only, right column).
 * Uses the series' `image` (poster) when it has one.
 */
export default function CourseSidebar({ series, freeTestCount = 0 }) {
  if (!series) return null
  const { title, subtitle, image, totalTests, validity, languages, price, originalPrice, includes, enrollUrl } = series
  const hasDiscount = originalPrice && originalPrice > price
  const off = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const facts = [
    totalTests != null && `${totalTests} tests`,
    validity && `${validity} validity`,
    languages?.length > 0 && languages.join(' · '),
    freeTestCount > 0 && `${freeTestCount} free test${freeTestCount > 1 ? 's' : ''}`,
  ].filter(Boolean)

  return (
    <aside aria-label={`${title} summary`} className="sticky top-[7.75rem] hidden self-start lg:block">
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        {image && <img src={image} alt="" className="aspect-video w-full object-cover" />}
        <div className="p-5">
          {subtitle && <p className="w-fit rounded-sm bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700">{subtitle}</p>}
          <h2 className="mt-3 text-xl font-semibold leading-snug text-ink">{title}</h2>

          {facts.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600">
              {facts.map((f) => (
                <li key={f} className="after:ml-3 after:text-slate-300 after:content-['•'] last:after:hidden">{f}</li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap items-baseline gap-x-2 border-t border-slate-100 pt-4">
            <span className="text-3xl font-bold text-ink">{formatRupees(price)}</span>
            {hasDiscount && (
              <>
                <span className="text-slate-400 line-through">{formatRupees(originalPrice)}</span>
                <span className="text-sm font-semibold text-accent-700">({off}% off)</span>
              </>
            )}
          </div>

          <EnrollButton
            to={enrollUrl}
            what={title}
            className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3.5 text-base font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Enroll Now
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </EnrollButton>

          {includes?.length > 0 && (
            <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 [@media(max-height:720px)]:hidden">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  )
}
