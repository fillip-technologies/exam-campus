import EnrollButton from '@/components/common/EnrollButton'
import { ArrowRight, BarChart3, Check, ClipboardCheck, History, Timer } from 'lucide-react'
import { Poster } from '@/components/common/CourseCard'
import SectionShell from './SectionShell'
import { formatRupees } from '@/lib/format'

const posterIcons = [
  { icon: ClipboardCheck, label: 'Mock Tests' },
  { icon: Timer, label: 'Timed' },
  { icon: BarChart3, label: 'Analysis' },
  { icon: History, label: 'PYPs' },
]

function Stat({ label, value }) {
  return (
    <div className="px-3 py-2.5">
      <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-base font-bold leading-snug text-ink">{value}</dd>
    </div>
  )
}

/** Compact product card: title, key counts, what's included, price and actions. */
function SeriesCard({ series, examName, org, freeTestCount, toneIndex }) {
  const { title, subtitle, image, totalTests, fullLengthTests, sectionalTests, practiceTests, languages, validity, price, originalPrice, includes, enrollUrl, detailsUrl } = series
  const hasDiscount = originalPrice && originalPrice > price
  const off = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const stats = series.stats ?? [
    totalTests != null && { label: 'Total tests', value: totalTests },
    fullLengthTests > 0 && { label: 'Full-length mocks', value: fullLengthTests },
    sectionalTests > 0 && { label: 'Sectional tests', value: sectionalTests },
    practiceTests > 0 && { label: 'Practice tests', value: practiceTests },
    freeTestCount > 0 && { label: 'Free tests', value: freeTestCount },
    languages?.length > 0 && { label: 'Languages', value: languages.join(' · ') },
  ].filter(Boolean)

  return (
    <article className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-4 transition-shadow duration-200 hover:shadow-lg hover:shadow-primary-900/10">
      <Poster exam={examName} org={org} subtitle={subtitle} validity={validity} image={image} posterIcons={posterIcons} toneIndex={toneIndex} />
      <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">{title}</h3>

      <dl className="mt-4 grid grid-cols-2 overflow-hidden rounded-sm border border-slate-200 [&>div]:border-b [&>div]:border-slate-100">
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </dl>

      {includes?.length > 0 && (
        <ul className="mt-4 space-y-2">
          {includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="mt-0.5 size-4 shrink-0 text-primary-600" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-baseline gap-x-2 border-t border-slate-100 pt-4">
          <span className="text-2xl font-bold text-ink">{formatRupees(price)}</span>
          {hasDiscount && (
            <>
              <span className="text-sm text-slate-400 line-through">{formatRupees(originalPrice)}</span>
              <span className="text-sm font-semibold text-accent-700">({off}% off)</span>
            </>
          )}
        </div>
        {validity && <p className="mt-1 text-xs text-slate-500">Valid for {validity}</p>}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={detailsUrl}
            className="inline-flex items-center justify-center rounded-md px-3 py-2.5 text-sm font-bold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-primary-50 hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            View Details
          </a>
          <EnrollButton
            to={enrollUrl}
            what={title}
            className="group inline-flex items-center justify-center gap-1.5 rounded-md bg-accent-500 px-3 py-2.5 text-sm font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Enroll
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </EnrollButton>
        </div>
      </div>
    </article>
  )
}

/** series: array of test series packages, shown as a responsive grid (three across on desktop). */
export default function TestSeriesSection({ examName, org, series, freeTestCount = 0, intro }) {
  if (!series?.length) return null
  return (
    <SectionShell
      icon={ClipboardCheck}
      id="test-series"
      title={`${examName} Test Series`}
      intro={intro ?? `Practise for ${examName} with exam-focused tests that follow the real exam pattern.`}
    >
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${series.length === 1 ? "max-w-sm sm:grid-cols-1 xl:grid-cols-1" : ""}`}>
        {series.map((s, i) => (
          <SeriesCard key={s.id} series={s} examName={examName} org={org} freeTestCount={freeTestCount} toneIndex={i} />
        ))}
      </div>
    </SectionShell>
  )
}
