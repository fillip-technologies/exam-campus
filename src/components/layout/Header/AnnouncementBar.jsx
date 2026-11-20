import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import SmartLink from '@/components/common/SmartLink'

const themes = {
  dark: { bar: 'bg-primary-900 text-primary-100', cta: 'text-accent-400 hover:text-white focus-visible:outline-accent-400', dot: 'bg-primary-400' },
  accent: { bar: 'bg-accent-500 text-primary-900', cta: 'text-primary-900 hover:text-white focus-visible:outline-primary-900', dot: 'bg-primary-900/50' },
  light: { bar: 'bg-primary-50 text-primary-900', cta: 'text-primary-700 hover:text-primary-900 focus-visible:outline-primary-600', dot: 'bg-primary-300' },
}

/** Scroll speed in pixels per second, so a long list moves at the same pace as a short one. */
const SPEED = 60

function Item({ announcement, t, tabbable }) {
  const { text, mobileText, cta } = announcement
  return (
    <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap">
      <span className={mobileText ? 'hidden sm:inline' : undefined}>{text}</span>
      {mobileText && <span className="sm:hidden">{mobileText}</span>}
      {cta?.href && (
        <SmartLink
          href={cta.href}
          tabIndex={tabbable ? undefined : -1}
          className={`group inline-flex items-center gap-1 font-semibold transition-colors focus-visible:outline-2 ${t.cta}`}
        >
          {cta.label}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </SmartLink>
      )}
    </span>
  )
}

/**
 * Every announcement in a row, each followed by a dot, repeated `repeat` times so the row is at least as wide
 * as the bar (a single short announcement would otherwise leave an empty gap while it scrolls).
 * Only the very first set is read out and tabbable; the repeats are decoration.
 */
function Run({ items, t, copy, repeat = 1 }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={copy ? 'true' : undefined}>
      {Array.from({ length: repeat }, (_, r) => items.map((a) => ({ a, r }))).flat().map(({ a, r }) => (
        <span key={`${r}-${a.id}`} className="inline-flex items-center" aria-hidden={!copy && r > 0 ? 'true' : undefined}>
          <Item announcement={a} t={t} tabbable={!copy && r === 0} />
          <span className={`mx-8 size-1 shrink-0 rounded-full ${t.dot}`} aria-hidden="true" />
        </span>
      ))}
    </div>
  )
}

/**
 * Top strip with every active announcement from the admin panel, in one row that scrolls right to left
 * without stopping (it pauses while the mouse is over it or a link inside has focus). The colour and the
 * close button come from the first announcement. No announcements = no bar.
 */
export default function AnnouncementBar({ announcements }) {
  const [dismissed, setDismissed] = useState(false)
  const boxRef = useRef(null)
  const runRef = useRef(null)
  const [repeat, setRepeat] = useState(1)
  const [duration, setDuration] = useState(30)

  // The row is drawn twice and moved left by one copy's width, so the second copy takes the first's place
  // and the loop has no seam. One copy repeats the announcements until it is at least as wide as the bar,
  // so there is never empty space. The time for one loop follows the copy's width (constant speed).
  useLayoutEffect(() => {
    const box = boxRef.current
    const run = runRef.current
    if (!box || !run) return
    const measure = () => {
      const setWidth = run.offsetWidth / repeat
      if (!setWidth) return
      const needed = Math.max(1, Math.ceil(box.clientWidth / setWidth))
      if (needed !== repeat) setRepeat(needed)
      else setDuration(Math.max(run.offsetWidth / SPEED, 8))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [announcements, dismissed, repeat])

  if (!announcements?.length || dismissed) return null
  const first = announcements[0]
  const t = themes[first.theme] ?? themes.dark

  return (
    <div className={t.bar}>
      <div className="flex h-9 w-full items-center text-xs">
        <div ref={boxRef} className="announcement-marquee relative min-w-0 flex-1 overflow-hidden" role="region" aria-label="Announcements">
          <div className="announcement-track flex w-max" style={{ '--marquee-duration': `${duration}s` }}>
            <div ref={runRef} className="flex shrink-0">
              <Run items={announcements} t={t} repeat={repeat} />
            </div>
            <Run items={announcements} t={t} repeat={repeat} copy />
          </div>
        </div>
        {first.dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcements"
            className="mx-2 grid size-6 shrink-0 place-items-center rounded opacity-80 hover:opacity-100 sm:mr-4"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
