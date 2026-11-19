import { useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { youtubeId, youtubeThumbnail } from '@/lib/youtube'

/** media: [{ type: 'image' | 'youtube', url, alt?, title? }] -> slides we can show (bad links are dropped). */
const toSlides = (media = []) =>
  media
    .map((m) => {
      if (!m?.url) return null
      const id = m.type === 'image' ? null : youtubeId(m.url)
      if (id) return { kind: 'video', id, title: m.title }
      return m.type === 'youtube' ? null : { kind: 'image', src: m.url, alt: m.alt ?? '' }
    })
    .filter(Boolean)

// Always visible on touch screens; on desktop they fade in when the pointer is over the carousel.
const arrowCls =
  'absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:opacity-0 lg:group-hover/media:opacity-100'

/**
 * 16:9 swipeable carousel of images and YouTube videos for a course card. A video slide shows its thumbnail
 * with a play button; `onPlay({ id, title })` opens it in the popup player. Without usable media, renders `fallback`.
 */
export default function CourseMediaCarousel({ media, title, fallback = null, onPlay }) {
  const slides = useMemo(() => toSlides(media), [media])
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  if (!slides.length) return fallback

  const count = slides.length
  const goTo = (i) => {
    const el = trackRef.current
    if (el) el.scrollTo({ left: ((i + count) % count) * el.clientWidth, behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = trackRef.current
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={`${title}: photos and videos`} className="group/media relative aspect-video overflow-hidden bg-slate-900">
      <ul ref={trackRef} onScroll={onScroll} className="no-scrollbar flex size-full snap-x snap-mandatory overflow-x-auto">
        {slides.map((s, i) => (
          <li key={`${s.kind}-${s.id ?? s.src}-${i}`} aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} className="relative size-full shrink-0 snap-center">
            {s.kind === 'image' ? (
              <img src={s.src} alt={s.alt} loading="lazy" className="size-full object-cover" />
            ) : (
              <button
                type="button"
                onClick={() => onPlay?.({ id: s.id, title: s.title || title })}
                aria-label={`Play video: ${s.title || title}`}
                className="group/play relative block size-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
              >
                <img src={youtubeThumbnail(s.id)} alt="" loading="lazy" className="size-full object-cover" />
                <span className="absolute inset-0 bg-slate-950/25 transition-colors group-hover/play:bg-slate-950/10" />
                <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover/play:scale-110">
                  <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>

      {count > 1 && (
        <>
          <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous slide" className={`${arrowCls} left-2`}>
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => goTo(index + 1)} aria-label="Next slide" className={`${arrowCls} right-2`}>
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <div className="absolute inset-x-0 bottom-1.5 flex justify-center">
            {slides.map((s, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className="p-1 focus-visible:outline-2 focus-visible:outline-white"
              >
                <span className={`block h-1.5 rounded-full shadow transition-all ${i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
