import { Circle } from 'lucide-react'
import { iconFor } from '@/lib/icons'

/**
 * Exam category picker: a seven tiles per row on desktop, a three-column grid on mobile. Click the selected one again to clear it, a two-column grid on mobile.
 * Selecting a category filters the test series below the carousel.
 */
export default function HeroCategories({ categories, activeId, onChange }) {
  return (
    <nav aria-label="Exam categories">
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7 lg:gap-3">
        {categories.map((c) => {
          const selected = c.id === activeId
          const Icon = iconFor(c.icon, Circle)
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(selected ? null : c.id)}
                className={`flex h-full min-h-[4.5rem] w-full flex-col items-center justify-center gap-1.5 rounded-xl border px-1.5 py-2.5 text-center text-xs sm:min-h-14 sm:flex-row sm:gap-2.5 sm:px-3 sm:py-3 sm:text-sm font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 lg:min-h-20 lg:flex-row lg:gap-3 ${
                  selected
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-slate-200 bg-white text-ink hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800'
                }`}
              >
                <Icon className={`size-5 shrink-0 lg:size-6 ${selected ? 'text-white' : 'text-primary-600'}`} aria-hidden="true" />
                <span className="leading-tight">{c.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
