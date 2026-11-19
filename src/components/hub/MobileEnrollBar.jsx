import { useEffect, useState } from 'react'
import EnrollButton from '@/components/common/EnrollButton'
import { formatRupees } from '@/lib/format'
import { primaryAction } from './ProductCard'

/**
 * Phones and tablets: a bottom bar with the main product's price and Enroll. It appears once the `startAfter`
 * element (the hero) has scrolled away and goes away from the `endAt` element (the closing call to action)
 * down, so it never covers the footer.
 * product: { title, price, originalPrice?, enrollUrl }
 */
export default function MobileEnrollBar({ product, startAfter = 'overview', endAt = 'get-started' }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const start = document.getElementById(startAfter)
    const end = document.getElementById(endAt)
    if (!start) return
    const state = { started: false, ended: false }
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const above = e.boundingClientRect.bottom <= 0 // scrolled past, above the viewport
        if (e.target === start) state.started = !e.isIntersecting && above
        if (e.target === end) state.ended = e.isIntersecting || above
      }
      setShow(state.started && !state.ended)
    })
    observer.observe(start)
    if (end) observer.observe(end)
    return () => observer.disconnect()
  }, [startAfter, endAt])

  if (!product) return null
  const { title, price, originalPrice, enrollUrl } = product
  const off = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(15,23,42,0.08)] backdrop-blur transition-transform duration-300 lg:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-500">{title}</p>
          <p className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-lg font-extrabold text-ink">{formatRupees(price)}</span>
            {off > 0 && (
              <>
                <span className="text-xs text-slate-400 line-through">{formatRupees(originalPrice)}</span>
                <span className="text-xs font-bold text-emerald-700">{off}% OFF</span>
              </>
            )}
          </p>
        </div>
        <EnrollButton to={enrollUrl} what={title} className={`${primaryAction} shrink-0 px-6`}>
          Enroll Now
        </EnrollButton>
      </div>
    </div>
  )
}
