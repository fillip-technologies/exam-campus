import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { searchSuggestions } from '@/data/nav'

/** Expands beneath the main bar when the search icon is toggled. */
export default function SearchPanel({ id, onClose }) {
  const ref = useRef(null)
  useEffect(() => ref.current?.focus(), [])

  return (
    <div id={id} className="animate-pop border-t border-slate-200 bg-white">
      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); onClose() }}
        className="mx-auto max-w-3xl px-4 py-4 sm:px-6"
      >
        <div className="flex items-center gap-2 rounded-lg bg-surface px-3 ring-1 ring-slate-200 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-accent-600">
          <Search className="size-5 text-slate-400" aria-hidden="true" />
          <input
            ref={ref}
            type="search"
            aria-label="Search classes, subjects and exams"
            placeholder="Search classes, subjects, exams or tests…"
            className="h-12 w-full bg-transparent text-base text-ink placeholder:text-slate-400 focus:outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-200/60 focus-visible:outline-2 focus-visible:outline-accent-600">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-slate-500">Trending</span>
          {searchSuggestions.map((s) => (
            <a key={s} href="#" onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-600 transition-colors hover:border-accent-500 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-accent-600">
              {s}
            </a>
          ))}
        </p>
      </form>
    </div>
  )
}
