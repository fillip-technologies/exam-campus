import EnrollButton from '@/components/common/EnrollButton'
import { ArrowRight, BarChart3, ClipboardCheck, History, ListChecks, Timer } from 'lucide-react'
import { Poster } from '@/components/common/CourseCard'
import ProductCard, { ProductGrid, primaryAction, secondaryAction } from './ProductCard'
import SectionShell from './SectionShell'

const posterIcons = [
  { icon: ClipboardCheck, label: 'Mock Tests' },
  { icon: Timer, label: 'Timed' },
  { icon: BarChart3, label: 'Analysis' },
  { icon: History, label: 'PYPs' },
]

/** Test series card: counts as two icon lines, price, View Details + Enroll. */
function SeriesCard({ series, examName, org, freeTestCount, toneIndex }) {
  const { title, subtitle, image, totalTests, fullLengthTests, sectionalTests, practiceTests, languages, validity, price, originalPrice, enrollUrl, detailsUrl } = series

  const total = [totalTests != null && `${totalTests} Total Tests`, freeTestCount > 0 && `${freeTestCount} Free`].filter(Boolean).join(' · ')
  const breakdown = [
    fullLengthTests > 0 && `${fullLengthTests} Full Mocks`,
    sectionalTests > 0 && `${sectionalTests} Sectional`,
    practiceTests > 0 && `${practiceTests} Practice`,
  ].filter(Boolean).join(' · ')

  const meta = series.stats?.length
    ? [{ icon: ClipboardCheck, text: series.stats.map((s) => `${s.value} ${s.label}`).join(' · ') }]
    : [total && { icon: ClipboardCheck, text: total }, breakdown && { icon: ListChecks, text: breakdown }].filter(Boolean)

  return (
    <ProductCard
      media={<Poster exam={examName} org={org} subtitle={subtitle} validity={validity} image={image} posterIcons={posterIcons} toneIndex={toneIndex} />}
      category={subtitle}
      languages={languages?.join(' · ')}
      title={title}
      meta={meta}
      price={price}
      originalPrice={originalPrice}
      priceNote={validity && `Valid for ${validity}`}
      offer={series.offer ?? series.offerLabel}
      coupon={series.coupon}
      actions={[
        detailsUrl && (
          <a key="details" href={detailsUrl} className={secondaryAction}>
            View Details
          </a>
        ),
        <EnrollButton key="enroll" to={enrollUrl} what={title} className={primaryAction}>
          Enroll Now
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </EnrollButton>,
      ]}
    />
  )
}

/** series: array of test series packages, shown as a responsive grid. */
export default function TestSeriesSection({ examName, org, series, freeTestCount = 0, intro }) {
  if (!series?.length) return null
  return (
    <SectionShell
      icon={ClipboardCheck}
      id="test-series"
      title={`${examName} Test Series`}
      intro={intro ?? `Practise for ${examName} with exam-focused tests that follow the real exam pattern.`}
    >
      <ProductGrid noun="test series">
        {series.map((s, i) => (
          <SeriesCard key={s.id} series={s} examName={examName} org={org} freeTestCount={freeTestCount} toneIndex={i} />
        ))}
      </ProductGrid>
    </SectionShell>
  )
}
