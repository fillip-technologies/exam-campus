import { useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { popularSearches, searchableCourses } from '@/data/searchCatalog'
import { pathForCatalogEntry, resolveSearchTarget } from '@/lib/search'

/**
 * Exam / class search with suggestions. Choosing a suggestion or pressing Search opens the matching
 * page in the same tab (client-side navigation). size: 'lg' (hero) | 'sm' (mobile header).
 */
export default function SearchCombobox({ size = 'lg', onNavigate }) {
  const uid = useId()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [notFound, setNotFound] = useState(false)
  const large = size === 'lg'

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = q
      ? searchableCourses.filter((c) => `${c.name} ${c.category}`.toLowerCase().includes(q))
      : searchableCourses.filter((c) => popularSearches.some((p) => c.name.startsWith(p)))
    return pool.slice(0, 6)
  }, [query])

  const open_ = (path) => {
    setOpen(false)
    setActive(-1)
    setNotFound(false)
    navigate(path)
    onNavigate?.()
  }

  const submit = () => {
    const path = resolveSearchTarget(query)
    if (path) open_(path)
    else {
      setNotFound(true)
      setOpen(true)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault()
      setOpen(true)
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (e.key === 'Enter' && open && active >= 0) {
      e.preventDefault()
      open_(pathForCatalogEntry(results[active]))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
      className="relative"
    >
      <div
        className={`flex items-center gap-2 bg-white ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-primary-600 ${
          large ? 'rounded-2xl p-2 shadow-lg shadow-primary-900/10' : 'rounded-xl p-1 pl-3'
        }`}
      >
        <Search className={`shrink-0 text-primary-600 ${large ? 'ml-3 hidden size-5 sm:block' : 'size-5'}`} aria-hidden="true" />
        <input
          id={`${uid}-input`}
          type="text"
          role="combobox"
          aria-label="Search your exam, class or test series"
          aria-expanded={open}
          aria-controls={`${uid}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? `${uid}-opt-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          placeholder={large ? 'Search your exam, class or test series' : 'Search exam, class or test series'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActive(-1)
            setNotFound(false)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`min-w-0 flex-1 bg-transparent text-ink placeholder:text-slate-400 focus:outline-none ${
            large ? 'h-12 px-2 text-base sm:h-14 sm:text-lg' : 'h-10 text-base'
          }`}
        />
        <button
          type="submit"
          aria-label="Search"
          className={`shrink-0 bg-primary-600 font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
            large ? 'h-12 rounded-xl px-5 text-sm sm:h-14 sm:px-8 sm:text-base' : 'grid size-10 place-items-center rounded-lg'
          }`}
        >
          {large ? 'Search' : <Search className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <ul
          id={`${uid}-list`}
          role="listbox"
          aria-label="Suggestions"
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-72 animate-pop overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-primary-900/10"
        >
          {(results.length === 0 || notFound) && (
            <li role="presentation" className="px-4 py-3 text-sm text-slate-500">
              Nothing found. Try “SSC”, “Banking” or “Class 9”.
            </li>
          )}
          {results.map((c, i) => (
            <li
              key={c.name}
              id={`${uid}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => open_(pathForCatalogEntry(c))}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between px-4 py-3 text-sm ${
                i === active ? 'bg-primary-50 text-primary-800' : 'text-slate-700'
              }`}
            >
              <span className="font-semibold">{c.name}</span>
              <span className="text-xs text-slate-500">{c.category}</span>
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
