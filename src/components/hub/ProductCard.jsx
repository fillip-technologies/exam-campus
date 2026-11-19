import { Children, useEffect, useState } from 'react'
import { Check, ChevronDown, Copy, TicketPercent } from 'lucide-react'
import { formatDate, formatRupees } from '@/lib/format'

/**
 * Coupon shape: { code, discountPercent?, discountAmount?, label?, validTill?: 'YYYY-MM-DD' }.
 * Returns null for a missing code or an expired coupon, so stale offers never show.
 */
function activeCoupon(coupon, price) {
  if (!coupon?.code) return null
  const till = coupon.validTill ? String(coupon.validTill).slice(0, 10) : null
  if (till && till < new Date().toLocaleDateString('en-CA')) return null // en-CA = local YYYY-MM-DD
  const finalPrice = coupon.discountPercent
    ? Math.round(price * (1 - coupon.discountPercent / 100))
    : coupon.discountAmount
      ? Math.max(0, price - coupon.discountAmount)
      : null
  const label = coupon.label ?? (coupon.discountPercent ? `Extra ${coupon.discountPercent}% off` : coupon.discountAmount ? `Extra ${formatRupees(coupon.discountAmount)} off` : null)
  return { code: coupon.code, finalPrice: finalPrice != null && finalPrice < price ? finalPrice : null, label, validTill: formatDate(till) }
}

/** Coupon strip: the offer on the left, the code on the right (tap the code to copy it). */
function CouponStrip({ coupon }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked (http / permissions): the code stays visible to type by hand
    }
  }
  const headline = coupon.finalPrice != null ? `Get it for ${formatRupees(coupon.finalPrice)}` : (coupon.label ?? 'Coupon available')
  const details = [coupon.finalPrice != null && coupon.label, coupon.validTill && `Valid till ${coupon.validTill}`].filter(Boolean).join(' · ')

  return (
    <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-emerald-50 px-3 py-2 ring-1 ring-inset ring-emerald-200">
      <TicketPercent className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-tight text-emerald-900">{headline}</p>
        {details && <p className="mt-0.5 text-[0.7rem] leading-snug text-emerald-700">{details}</p>}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy coupon code ${coupon.code}`}
        title="Copy code"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-dashed border-emerald-500 bg-white px-2 py-1.5 font-mono text-xs font-bold tracking-wider text-emerald-800 transition-colors hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-600"
      >
        {copied ? (
          <>
            <Check className="size-3.5" aria-hidden="true" />
            <span className="font-sans tracking-normal">Copied</span>
          </>
        ) : (
          <>
            {coupon.code}
            <Copy className="size-3.5" aria-hidden="true" />
          </>
        )}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'Coupon code copied' : ''}</span>
    </div>
  )
}

/**
 * Shared frame for the hub's product cards (courses and test series), in the compact style of the big
 * test-prep stores: edge-to-edge artwork, a category / language row, a two-line title, a few icon lines,
 * then price, an optional coupon and two actions pinned to the bottom so cards in a row line up.
 *
 * media: node (carousel or poster) · badge: node over the artwork's top-left corner
 * meta: [{ icon, text }] · offer: short text tag · coupon: see activeCoupon · actions: one or two buttons/links
 */
export default function ProductCard({ media, badge, category, languages, title, meta = [], price, originalPrice, priceNote, offer, coupon, actions }) {
  const hasDiscount = originalPrice > price
  const off = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const actionCount = Array.isArray(actions) ? actions.filter(Boolean).length : 1
  const liveCoupon = activeCoupon(coupon, price)

  return (
    // `relative` keeps the card's screen-reader-only text (absolutely positioned) inside the card. Without it, inside a
    // sideways carousel that text escaped the carousel's clipping and made the whole page scroll sideways.
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-900/10">
      <div className="relative">
        {media}
        {badge && <div className="pointer-events-none absolute left-3 top-3">{badge}</div>}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {(category || languages) && (
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-xs font-bold uppercase tracking-wide text-accent-600">{category}</p>
            {languages && (
              <span className="shrink-0 rounded border border-slate-300 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-slate-600">
                {languages}
              </span>
            )}
          </div>
        )}

        <h3 title={title} className="mt-1.5 line-clamp-2 text-[1.0625rem] font-bold leading-snug text-ink">
          {title}
        </h3>

        {meta.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            {meta.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2">
                <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3 border-t border-dashed border-slate-200 pt-3">
            <div className="min-w-0">
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-xl font-extrabold text-ink">{formatRupees(price)}</span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    <span className="sr-only">Original price </span>
                    {formatRupees(originalPrice)}
                  </span>
                )}
              </p>
              {priceNote && <p className="text-xs text-slate-500">{priceNote}</p>}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              {offer && <span className="rounded bg-accent-100 px-2 py-0.5 text-[0.7rem] font-bold text-accent-700">{offer}</span>}
              {off > 0 && <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{off}% OFF</span>}
            </div>
          </div>
          {liveCoupon && <CouponStrip coupon={liveCoupon} />}
          <div className={`mt-3 grid gap-2 ${actionCount > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>{actions}</div>
        </div>
      </div>
    </article>
  )
}

// cards per row at each width of ProductGrid (must match its grid-cols classes)
const ROW_QUERIES = [
  ['(min-width: 1536px)', 4],
  ['(min-width: 1024px)', 3],
  ['(min-width: 640px)', 2],
]
const cardsPerRow = () => ROW_QUERIES.find(([q]) => window.matchMedia(q).matches)?.[1] ?? 1

/** Cards per row right now; follows window resizes. */
function useCardsPerRow() {
  const [perRow, setPerRow] = useState(cardsPerRow)
  useEffect(() => {
    const lists = ROW_QUERIES.map(([q]) => window.matchMedia(q))
    const update = () => setPerRow(cardsPerRow())
    lists.forEach((l) => l.addEventListener('change', update))
    return () => lists.forEach((l) => l.removeEventListener('change', update))
  }, [])
  return perRow
}

/**
 * Card grid that shows one full row (two on phones/tablets) and a "View all N" toggle for the rest, like
 * the stores' "View All Batches". One card stays narrow instead of stretching across the section.
 */
export function ProductGrid({ children, noun = 'items' }) {
  const items = Children.toArray(children)
  const [all, setAll] = useState(false)
  const perRow = useCardsPerRow()
  const limit = perRow >= 3 ? perRow : Math.max(perRow * 2, 3)
  const extra = items.length - limit
  return (
    <>
      <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${items.length === 1 ? 'max-w-sm sm:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1' : ''}`}>
        {all ? items : items.slice(0, limit)}
      </div>
      {extra > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setAll((v) => !v)}
            aria-expanded={all}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-5 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {all ? 'Show less' : `View all ${items.length} ${noun}`}
            <ChevronDown className={`size-4 transition-transform ${all ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  )
}

/** Button styles shared by the cards. */
export const primaryAction =
  'group inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent-500 px-3 py-2.5 text-sm font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
export const secondaryAction =
  'inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-ink ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

/** "● LIVE" style tag for artwork. */
export function ModeBadge({ mode }) {
  const live = mode === 'LIVE' || mode === 'HYBRID'
  const label = { LIVE: 'Live', RECORDED: 'Recorded', HYBRID: 'Live + Recorded' }[mode] ?? mode
  if (!label) return null
  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-white shadow ${live ? 'bg-red-600' : 'bg-slate-900/80'}`}>
      {live && <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />}
      {label}
    </span>
  )
}
