import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import SmartLink from './SmartLink'
import { trackBannerClick } from '@/api/public'

const DEFAULT_INTERVAL = 5000

/**
 * Auto-rotating banner carousel (scroll-snap). One banner fills the width by default.
 * banners: [{ id, src, mobileSrc?, alt, href }] from the admin's Banners. Clicks are counted (fire and forget).
 * Pauses on hover/focus, has a pause button, and never auto-plays for users who prefer reduced motion.
 */
export default function BannerCarousel({ banners, label = 'Featured test series', slideClass = 'basis-full', interval = DEFAULT_INTERVAL }) {
  const trackRef = useRef(null)
  const hoverRef = useRef(false)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)

  const metrics = () => {
    const el = trackRef.current
    const step = el.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0)
    return { el, step, max: el.scrollWidth - el.clientWidth }
  }

  const go = useCallback((dir) => {
    const el = trackRef.current
    if (!el) return
    const { step, max } = metrics()
    const atEnd = el.scrollLeft >= max - 4
    const atStart = el.scrollLeft <= 4
    const left = dir > 0 ? (atEnd ? 0 : el.scrollLeft + step) : atStart ? max : el.scrollLeft - step
    el.scrollTo({ left, behavior: 'smooth' })
  }, [])

  const onScroll = () => {
    const { el, step } = metrics()
    setActive(Math.min(banners.length - 1, Math.round(el.scrollLeft / step)))
  }

  useEffect(() => {
    if (!playing || !interval || banners.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => {
      if (!hoverRef.current && !document.hidden) go(1)
    }, interval)
    return () => clearInterval(t)
  }, [playing, go, interval, banners.length])

  const goTo = (i) => {
    const { el, step, max } = metrics()
    el.scrollTo({ left: Math.min(i * step, max), behavior: 'smooth' })
  }

  const arrow =
    'absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-primary-800 shadow-md ring-1 ring-slate-200 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:size-10'
  const slideCls = `block shrink-0 snap-start overflow-hidden rounded-2xl ring-1 ring-slate-200 transition-shadow hover:shadow-lg hover:shadow-primary-900/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${slideClass}`

  return (
    <div aria-roledescription="carousel" aria-label={label}>
      <div
        className="relative"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        onFocus={() => (hoverRef.current = true)}
        onBlur={() => (hoverRef.current = false)}
      >
        <button type="button" aria-label="Previous banner" onClick={() => go(-1)} className={`${arrow} left-3`}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Next banner" onClick={() => go(1)} className={`${arrow} right-3`}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>

        <div ref={trackRef} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth">
          {banners.map((b, i) => {
            const img = (
              <picture>
                {b.mobileSrc && <source media="(max-width: 639px)" srcSet={b.mobileSrc} />}
                <img src={b.src} alt={b.alt} loading={i === 0 ? 'eager' : 'lazy'} className="aspect-video w-full object-cover" />
              </picture>
            )
            const aria = `${i + 1} of ${banners.length}`
            return (
              <SmartLink
                key={b.id ?? b.src}
                href={b.href}
                aria-label={aria}
                className={slideCls}
                onClick={() => trackBannerClick(b.id)}
                fallback={<div key={b.id ?? b.src} className={slideCls}>{img}</div>}
              >
                {img}
              </SmartLink>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label={playing ? 'Pause banner rotation' : 'Play banner rotation'}
          onClick={() => setPlaying((p) => !p)}
          className="grid size-7 place-items-center rounded-full text-slate-500 ring-1 ring-inset ring-slate-300 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          {playing ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
        </button>
        <div className="flex items-center gap-2">
          {banners.map((b, i) => (
            <button
              key={b.src}
              type="button"
              aria-label={`Go to banner ${i + 1}`}
              aria-current={active === i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                active === i ? 'w-6 bg-primary-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
