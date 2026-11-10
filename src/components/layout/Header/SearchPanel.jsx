import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import SearchCombobox from '@/components/common/SearchCombobox'
import { searchNow } from '@/api/public'

/** Expands beneath the main bar when the search icon is toggled. Trending chips open the best match. */
export default function SearchPanel({ id, suggestions = [], onClose }) {
  const navigate = useNavigate()
  const [missing, setMissing] = useState(null)

  const openSuggestion = async (term) => {
    const hit = (await searchNow(term).catch(() => null))?.results?.find((r) => r.href)
    if (hit) {
      navigate(hit.href)
      onClose()
    } else setMissing(term)
  }

  return (
    <div id={id} className="animate-pop border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <SearchCombobox size="sm" autoFocus onNavigate={onClose} />
          </div>
          <button type="button" onClick={onClose} aria-label="Close search" className="mt-1 grid size-10 place-items-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-accent-600">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {suggestions.length > 0 && (
          <p className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-500">Trending</span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => openSuggestion(s)}
                className="rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-600 transition-colors hover:border-accent-500 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-accent-600"
              >
                {s}
              </button>
            ))}
          </p>
        )}
        {missing && (
          <p role="status" className="mt-2 text-sm text-slate-500">
            The {missing} page is coming soon.
          </p>
        )}
      </div>
    </div>
  )
}
