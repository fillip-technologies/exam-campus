import { useEffect, useRef, useState } from 'react'

/**
 * Sticky in-page navigation with scroll-spy.
 * items: [{ id, label }]  (ids of the sections on the page)
 */
export default function StickySectionNav({ items }) {
  const [active, setActive] = useState(items[0]?.id)
  const itemRefs = useRef({})
  const listRef = useRef(null)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean)
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  // keep the active tab visible in the horizontally scrollable bar (scrolls the bar only, never the page)
  useEffect(() => {
    const el = itemRefs.current[active]
    const bar = listRef.current
    if (el && bar) bar.scrollTo({ left: el.offsetLeft - (bar.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' })
  }, [active])

  return (
    <nav aria-label="On this page" className="sticky top-[165px] z-30 md:top-[6.75rem] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <ul ref={listRef} className="relative no-scrollbar flex gap-1 overflow-x-auto">
          {items.map((item) => {
            const isActive = item.id === active
            return (
              <li key={item.id} className="shrink-0">
                <a
                  ref={(el) => (itemRefs.current[item.id] = el)}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`block border-b-2 px-3 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600 sm:px-4 ${
                    isActive ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-600 hover:text-primary-700'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
