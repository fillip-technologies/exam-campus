import { useSearchParams } from 'react-router-dom'

/**
 * One URL query parameter as state: [value | null, setValue]. Setting null removes it. Updates replace the
 * history entry and keep the scroll position, so filters never jump the page or clutter the back button.
 * Builds on the address bar as it is right now, so quick successive changes to different params never drop one.
 */
export function useQueryParam(key) {
  const [params, setParams] = useSearchParams()
  const set = (value) => {
    const next = new URLSearchParams(window.location.search)
    if (value == null || value === '') next.delete(key)
    else next.set(key, String(value))
    setParams(next, { replace: true, preventScrollReset: true })
  }
  return [params.get(key), set]
}
