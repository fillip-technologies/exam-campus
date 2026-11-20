import { ArrowRight, BarChart3, ClipboardCheck, History, ListChecks, Timer } from 'lucide-react'
import EnrollButton from '@/components/common/EnrollButton'
import ProductCard, { primaryAction, secondaryAction } from '@/components/hub/ProductCard'
import ExamLogo from './ExamLogo'
import SmartLink from './SmartLink'
import { subHref } from '@/lib/links'

/** Decorative strip on generated posters (cards without artwork). */
const defaultPosterIcons = [
  { icon: ClipboardCheck, label: 'Mock Tests' },
  { icon: Timer, label: 'Timed' },
  { icon: BarChart3, label: 'Analysis' },
  { icon: History, label: 'PYPs' },
]

const tones = [
  { bg: 'bg-primary-800', text: 'text-white', sub: 'text-accent-400', strip: 'bg-white/10 text-primary-100' },
  { bg: 'bg-primary-100', text: 'text-primary-900', sub: 'text-primary-600', strip: 'bg-white text-primary-800' },
  { bg: 'bg-sun-400', text: 'text-primary-900', sub: 'text-primary-800', strip: 'bg-white/60 text-primary-900' },
]

/** Poster artwork. Pass `image` on the product to show real artwork instead. */
export function Poster({ exam, org, subtitle, validity, image, posterIcons = defaultPosterIcons, toneIndex }) {
  const t = tones[toneIndex % tones.length]
  return (
    <div className={`relative aspect-video overflow-hidden rounded-sm ${t.bg}`}>
      {image ? (
        <img src={image} alt="" className="size-full object-cover" loading="lazy" />
      ) : (
        <>
          <div className={`flex h-full flex-col items-center justify-center px-4 pb-10 text-center ${t.text}`}>
            <p className="text-3xl font-extrabold leading-none tracking-tight sm:text-[2rem]">{exam}</p>
            <p className={`mt-2 text-xs font-bold uppercase tracking-[0.16em] ${t.sub}`}>{subtitle}</p>
          </div>
          <ul className={`absolute inset-x-3 bottom-3 grid grid-cols-4 rounded-sm py-1.5 text-center text-[0.6rem] font-semibold ${t.strip}`}>
            {posterIcons.map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-0.5">
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </>
      )}
      {!image && (
        <>
        <ExamLogo org={org} name={exam} className="absolute right-2.5 top-2.5 size-9" />
        {validity && (
          <span className="absolute left-0 top-0 rounded-br-sm bg-primary-900 px-2.5 py-1 text-xs font-bold text-white">
            {validity}
          </span>
        )}
        </>
      )}
    </div>
  )
}

const featureText = ({ value, label }) => `${typeof value === 'number' ? `${value}+` : value} ${label}`

/**
 * Store card for a test series (GET /public/series items), in the same frame as the exam hub's cards.
 * "View Details" shows only when the exam has a hub page; otherwise Enroll is the single action.
 */
export default function CourseCard({ product, toneIndex = 0 }) {
  const { exam, org, slug, title, subtitle, language, tag, validity, price, mrp, features = [], offer, image, examHref, href } = product
  const total = product.totalTests ?? features.reduce((n, f) => n + (Number(f.value) || 0), 0)
  const free = product.freeTests ?? 0

  const meta = [
    total > 0 && { icon: ClipboardCheck, text: `${total}+ Tests${free > 0 ? ` · ${free} Free` : ''}` },
    features.length > 0 && { icon: ListChecks, text: features.slice(0, 3).map(featureText).join(' · ') },
  ].filter(Boolean)

  return (
    <ProductCard
      media={<Poster exam={exam} org={org} subtitle={subtitle} validity={validity} image={image} toneIndex={toneIndex} />}
      category={tag ?? subtitle}
      languages={language}
      title={title}
      meta={meta}
      price={price}
      originalPrice={mrp}
      priceNote={validity && `Valid for ${validity}`}
      offer={offer}
      coupon={product.coupon}
      actions={[
        examHref && (
          <SmartLink key="details" href={subHref(examHref, '#test-series')} className={secondaryAction}>
            View Details
          </SmartLink>
        ),
        <EnrollButton key="enroll" to={href ?? `/enroll/${slug}`} what={title} className={primaryAction}>
          Enroll Now
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </EnrollButton>,
      ]}
    />
  )
}
