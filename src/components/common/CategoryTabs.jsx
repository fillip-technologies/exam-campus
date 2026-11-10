import { useRef } from 'react'

/**
 * Horizontally scrollable underline tabs (WAI-ARIA tabs pattern).
 * Panels live in the parent and should use ids `${idPrefix}-panel-${id}`.
 */
export default function CategoryTabs({ tabs, activeId, onChange, label, idPrefix }) {
  const refs = useRef({})

  const select = (id, focus = false) => {
    onChange(id)
    const el = refs.current[id]
    if (!el) return
    el.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
    if (focus) el.focus()
  }

  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === activeId)
    const last = tabs.length - 1
    const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    select(tabs[next].id, true)
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex min-w-max gap-1 border-b border-slate-200 sm:min-w-0 sm:gap-2"
      >
        {tabs.map((t) => {
          const selected = t.id === activeId
          return (
            <button
              key={t.id}
              ref={(el) => (refs.current[t.id] = el)}
              role="tab"
              id={`${idPrefix}-tab-${t.id}`}
              type="button"
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3.5 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600 sm:px-5 ${
                selected
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
