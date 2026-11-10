import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/client'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

/** Placeholder shown while a page's data loads. */
export function PageLoader({ label = 'Loading…' }) {
  return (
    <div role="status" aria-live="polite" className="mx-auto grid min-h-[50vh] w-full place-items-center px-4">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <span className="size-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600" aria-hidden="true" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  )
}

/** Error block with a retry button (network / server problems). */
export function LoadError({ error, onRetry, className = '' }) {
  return (
    <div role="alert" className={`mx-auto max-w-xl rounded-md border border-red-200 bg-red-50 px-5 py-6 text-center ${className}`}>
      <p className="font-semibold text-red-800">We could not load this content.</p>
      <p className="mt-1 text-sm text-red-700">{error?.message ?? 'Please check your connection and try again.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-800 ring-1 ring-inset ring-red-200 hover:bg-red-100">
          Try again
        </button>
      )}
    </div>
  )
}

/** A renamed slug answers 404 with `redirect`: follow it without adding a history entry. */
function Redirect({ to }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to + window.location.hash, { replace: true })
  }, [navigate, to])
  return <PageLoader />
}

/**
 * Standard handling for a page query: loader, 404 page (or slug redirect), error with retry.
 * Returns null when the data is ready, so callers can write `return pageState(query) ?? <Page />`.
 */
export function pageState(query) {
  if (query.isPending) return <PageLoader />
  if (query.isError) {
    const err = query.error
    if (err instanceof ApiError && err.status === 404) return err.redirect ? <Redirect to={err.redirect} /> : <NotFoundPage />
    return <LoadError error={err} onRetry={() => query.refetch()} className="my-16" />
  }
  return null
}
