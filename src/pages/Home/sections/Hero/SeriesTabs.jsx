import { useRef } from 'react'
import { seriesTabs } from '@/data/heroExplorer'

/** Pill-style tabs (WAI-ARIA tabs pattern) that scroll horizontally on small screens. Panel id: `st-panel`. */
export default function SeriesTabs({ activeId, onChange }) {
  const refs = useRef({})

  const select = (id, focus = false) => {
    onChange(id)
    const el = refs.current[id]
    el?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
    if (focus) el?.focus()
  }

  const onKeyDown = (e) => {
    const i = seriesTabs.findIndex((t) => t.id === activeId)
    const last = seriesTabs.length - 1
    const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    select(seriesTabs[next].id, true)
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 py-1 no-scrollbar sm:mx-0 sm:px-0">
      <div role="tablist" aria-label="Test series type" onKeyDown={onKeyDown} className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap">
        {seriesTabs.map((t) => {
          const selected = t.id === activeId
          const Icon = t.icon
          return (
            <button
              key={t.id}
              ref={(el) => (refs.current[t.id] = el)}
              role="tab"
              id={`st-tab-${t.id}`}
              type="button"
              aria-selected={selected}
              aria-controls="st-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:text-base ${
                selected
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800'
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
