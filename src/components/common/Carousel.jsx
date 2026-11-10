import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Scroll-snap carousel. Shows 1+ / 2 / 3 / 4 items per view by breakpoint and
 * only shows the arrow controls when there are more items than fit.
 * Pass each slide as a direct child.
 */
export default function Carousel({ label, children }) {
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update, children])

  const scrollByPage = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  const scrollable = canPrev || canNext

  return (
    <div>
      {scrollable && (
        <div className="mb-4 flex justify-end gap-2">
          {[
            { dir: -1, Icon: ChevronLeft, text: 'Previous', disabled: !canPrev },
            { dir: 1, Icon: ChevronRight, text: 'Next', disabled: !canNext },
          ].map(({ dir, Icon, text, disabled }) => (
            <button
              key={text}
              type="button"
              aria-label={`${text} ${label}`}
              disabled={disabled}
              onClick={() => scrollByPage(dir)}
              className="grid size-10 place-items-center rounded-md text-primary-700 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-white hover:ring-primary-600 disabled:cursor-not-allowed disabled:text-slate-300 disabled:ring-slate-200 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <Icon className="size-5" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      <ul
        ref={trackRef}
        onScroll={update}
        tabIndex={0}
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:-mx-0 sm:px-0"
      >
        {Children.map(children, (child) => (
          <li className="flex shrink-0 basis-[82%] snap-start scroll-ml-4 min-[560px]:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)] xl:basis-[calc((100%-3.75rem)/4)]">
            <div className="w-full">{child}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
