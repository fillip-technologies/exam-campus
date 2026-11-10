import { useDeferredValue, useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { searchNow, useLayout, useSearch } from '@/api/public'

/**
 * Exam / class search with suggestions from GET /public/search (names, aliases, short words like "PO").
 * Choosing a suggestion or pressing Search opens the matching page in the same tab.
 * Results without a page yet (coming-soon exams) are listed but marked "Coming soon".
 * size: 'lg' (hero) | 'sm' (mobile header / search panel).
 */
export default function SearchCombobox({ size = 'lg', onNavigate, placeholder, autoFocus = false }) {
  const uid = useId()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [notFound, setNotFound] = useState(false)
  const large = size === 'lg'
  const { data: layout } = useLayout()
  const { data } = useSearch(deferred)
  const popular = layout?.search.popular ?? []

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  // empty box: the admin's "popular searches" as quick picks
  const results = query.trim() ? (data?.results ?? []) : popular.map((name) => ({ name, category: 'Popular', href: null, popular: true }))
  const hint = placeholder ?? layout?.site.searchPlaceholder ?? 'Search your exam, class or test series'

  const reset = () => {
    setOpen(false)
    setActive(-1)
    setNotFound(false)
  }

  const go = (path) => {
    reset()
    navigate(path)
    onNavigate?.()
  }

  const choose = async (r) => {
    if (r.popular) {
      setQuery(r.name)
      setActive(-1)
      return
    }
    if (r.href) go(r.href)
    else {
      setNotFound(true)
      setOpen(true)
    }
  }

  const submit = async () => {
    const q = query.trim()
    if (!q) return
    const res = await searchNow(q).catch(() => null)
    const hit = (data?.query === q ? data.results : res?.results)?.find((r) => r.href) ?? res?.results?.find((r) => r.href)
    if (hit) go(hit.href)
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
      choose(results[active])
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
          ref={inputRef}
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
          placeholder={hint}
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

      {open && (results.length > 0 || notFound || query.trim()) && (
        <ul
          id={`${uid}-list`}
          role="listbox"
          aria-label="Suggestions"
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-72 animate-pop overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 text-left shadow-xl shadow-primary-900/10"
        >
          {notFound && (
            <li role="presentation" className="px-4 py-3 text-sm text-slate-500">
              That page is not available yet. Try “SSC”, “Banking” or “Class 6”.
            </li>
          )}
          {!notFound && query.trim() && data && results.length === 0 && (
            <li role="presentation" className="px-4 py-3 text-sm text-slate-500">
              Nothing found. Try “SSC”, “Banking” or “Class 9”.
            </li>
          )}
          {results.map((r, i) => (
            <li
              key={`${r.type ?? 'p'}-${r.slug ?? r.name}`}
              id={`${uid}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(r)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm ${
                i === active ? 'bg-primary-50 text-primary-800' : 'text-slate-700'
              }`}
            >
              <span className="font-semibold">{r.name}</span>
              <span className="shrink-0 text-xs text-slate-500">{r.popular || r.href ? r.category : `${r.category} · Coming soon`}</span>
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
