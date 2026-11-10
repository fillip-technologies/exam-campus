import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { MegaShell } from './MegaPanels'
import ExamLogo from '@/components/common/ExamLogo'

/**
 * Two-part mega menu: categories on the left, the exams of the selected category on the right.
 * menu: [{ id, label, exams: [{ name, org, slug }] }]  linkFor(exam) returns the route each exam opens.
 */
export default function ExamMegaMenu({ id, idPrefix, menu, label, footer, linkFor, onNavigate }) {
  const [activeId, setActiveId] = useState(menu[0].id)
  const active = menu.find((c) => c.id === activeId)

  const onKeyDown = (e) => {
    const i = menu.findIndex((c) => c.id === activeId)
    const last = menu.length - 1
    const next = { ArrowDown: i === last ? 0 : i + 1, ArrowUp: i === 0 ? last : i - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    setActiveId(menu[next].id)
    document.getElementById(`${idPrefix}-tab-${menu[next].id}`)?.focus()
  }

  return (
    <MegaShell
      id={id}
      bare
      footer={footer}
      onNavigate={onNavigate}
    >
      <div className="grid min-h-[26rem] grid-cols-[25%_1fr] border-x border-slate-200">
        {/* Left: categories (25%) */}
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={label}
          onKeyDown={onKeyDown}
          className="space-y-2 border-r border-slate-200 bg-surface p-5"
        >
          {menu.map((c) => {
            const selected = c.id === activeId
            return (
              <button
                key={c.id}
                id={`${idPrefix}-tab-${c.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${idPrefix}-panel-${c.id}`}
                tabIndex={selected ? 0 : -1}
                onMouseEnter={() => setActiveId(c.id)}
                onClick={() => setActiveId(c.id)}
                className={`flex w-full items-center justify-between rounded-sm border px-4 py-3 text-left text-[0.95rem] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600 ${
                  selected
                    ? 'border-primary-200 bg-primary-50 text-primary-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary-200 hover:text-primary-700'
                }`}
              >
                {c.label}
                <ChevronRight className={`size-4 ${selected ? 'text-primary-600' : 'text-slate-400'}`} aria-hidden="true" />
              </button>
            )
          })}
        </div>

        {/* Right: exams (75%), three columns */}
        <div
          key={active.id}
          role="tabpanel"
          id={`${idPrefix}-panel-${active.id}`}
          aria-labelledby={`${idPrefix}-tab-${active.id}`}
          className="animate-fade-in p-6"
        >
          <ul className="grid grid-cols-3 gap-3">
            {active.exams.map((e) => (
              <li key={e.slug}>
                <Link
                  to={linkFor(e)}
                  onClick={onNavigate}
                  className="group flex items-center gap-3 rounded-sm border border-slate-200 bg-white px-3.5 py-3 transition-colors duration-150 hover:border-primary-300 hover:bg-primary-50/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600"
                >
                  <ExamLogo org={e.org} name={e.name} />
                  <span className="min-w-0 truncate text-sm font-semibold text-ink group-hover:text-primary-700">
                    {e.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MegaShell>
  )
}
