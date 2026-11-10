import EnrollButton from '@/components/common/EnrollButton'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import ExamLogo from './ExamLogo'
import { hasExamPage } from '@/data/exams'
import { freeTests } from '@/data/freeTests'

const tones = [
  { bg: 'bg-primary-800', text: 'text-white', sub: 'text-accent-400', strip: 'bg-white/10 text-primary-100' },
  { bg: 'bg-primary-100', text: 'text-primary-900', sub: 'text-primary-600', strip: 'bg-white text-primary-800' },
  { bg: 'bg-sun-400', text: 'text-primary-900', sub: 'text-primary-800', strip: 'bg-white/60 text-primary-900' },
]

/** Poster artwork. Pass `image` on the product to show real artwork instead. */
export function Poster({ exam, org, subtitle, validity, image, posterIcons, toneIndex }) {
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
        <span className="absolute left-0 top-0 rounded-br-sm bg-primary-900 px-2.5 py-1 text-xs font-bold text-white">
          {validity}
        </span>
        </>
      )}
    </div>
  )
}

// Total of the test counts in the card features ("30+" counts as 30), and the free tests for this exam.
const totalTests = (features) => features.reduce((n, f) => n + (parseInt(f.value, 10) || 0), 0)

const rupees = (n) => `₹${n.toLocaleString('en-IN')}`

/** Product card: poster, chips, key features, price and actions. Used for courses and test series. */
export default function CourseCard({ product, toneIndex = 0 }) {
  const { exam, org, slug, title, subtitle, language, tag, validity, price, mrp, features, posterIcons, offer, image } = product
  const [saved, setSaved] = useState(false)
  const off = Math.round(((mrp - price) / mrp) * 100)
  const total = totalTests(features)
  const free = freeTests.filter((t) => t.slug === slug).length

  return (
    <article className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-3 transition-shadow duration-200 hover:shadow-lg hover:shadow-primary-900/10">
      <Poster
        exam={exam}
        org={org}
        subtitle={subtitle}
        validity={validity}
        image={image}
        posterIcons={posterIcons}
        toneIndex={toneIndex}
      />

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{language}</span>
          <span className="rounded-sm bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700">{tag}</span>
        </div>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
          onClick={() => setSaved((s) => !s)}
          className="grid size-8 shrink-0 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-primary-600"
        >
          <Heart className={`size-5 ${saved ? 'fill-accent-500 text-accent-500' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">{title}</h3>
      <p className="mt-1 text-sm font-semibold text-primary-700">
        {total}+ tests{free > 0 && ` · ${free} free test${free > 1 ? "s" : ""}`}
      </p>

      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.8rem] text-slate-600">
        {features.map(({ icon: Icon, value, label }) => (
          <li key={label} className="flex items-start gap-1.5">
            <Icon className="mt-0.5 size-3.5 shrink-0 text-primary-600" aria-hidden="true" />
            <span>
              <span className="font-semibold text-ink">{value}</span> {label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 border-t border-slate-100 pt-4">
        <span className="text-2xl font-bold text-ink">{rupees(price)}</span>
        <span className="text-sm text-slate-400 line-through">{rupees(mrp)}</span>
        <span className="text-sm font-semibold text-accent-700">({off}% off)</span>
      </div>
      {offer && (
        <p className="mt-2 w-fit rounded-sm bg-accent-100 px-2 py-1 text-xs font-bold text-accent-700">{offer}</p>
      )}

      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        {hasExamPage(slug) ? (
          <Link to={`/exams/${slug}`} className="inline-flex items-center justify-center rounded-md px-3 py-2.5 text-sm font-bold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-primary-50 hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
            View Details
          </Link>
        ) : (
          <a href={`#test-series/${slug}`} className="inline-flex items-center justify-center rounded-md px-3 py-2.5 text-sm font-bold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-primary-50 hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
            View Details
          </a>
        )}
        <EnrollButton to={`/enroll/${slug}`} what={title} className="inline-flex items-center justify-center rounded-md bg-accent-500 px-3 py-2.5 text-sm font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
          Enroll Now
        </EnrollButton>
      </div>
    </article>
  )
}
