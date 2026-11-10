import { useId, useState } from 'react'
import { Minus, Plus } from 'lucide-react'

/**
 * Accessible accordion.
 * items: [{ id, title, meta?, content }]  (content is any React node)
 * multiple: allow several panels open at once.
 */
export default function Accordion({ items, multiple = false, defaultOpen = [] }) {
  const uid = useId()
  const [open, setOpen] = useState(() => new Set(defaultOpen))

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(multiple ? prev : [])
      if (prev.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <ul className="divide-y divide-slate-200 border-y border-slate-200">
      {items.map((item) => {
        const isOpen = open.has(item.id)
        const btnId = `${uid}-b-${item.id}`
        const panelId = `${uid}-p-${item.id}`
        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600"
              >
                <span className="text-base font-semibold text-ink sm:text-lg">
                  {item.title}
                  {item.meta && <span className="ml-2 text-sm font-medium text-slate-500">{item.meta}</span>}
                </span>
                {isOpen ? (
                  <Minus className="size-5 shrink-0 text-primary-600" aria-hidden="true" />
                ) : (
                  <Plus className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
                )}
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={btnId} className="animate-fade-in pb-5 leading-relaxed text-slate-600">
                {item.content}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
