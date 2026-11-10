import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { api, qs } from './client'

/**
 * Public content hooks. Each returns the API object as is: the backend already answers in the shapes the
 * components were written for (docs/backend/backend-plan.md §6-7).
 */
const get = (path) => () => api(`/public${path}`)

/** Site chrome: settings, announcement, nav tree, footer, search chips. Loaded once per visit. */
export const useLayout = () => useQuery({ queryKey: ['public', 'layout'], queryFn: get('/layout'), staleTime: 5 * 60_000 })

export const useHome = () => useQuery({ queryKey: ['public', 'home'], queryFn: get('/home') })

/** Hero test series cards; the tab rule and the category filter run on the server. */
export const useSeries = ({ tab, category }, { enabled = true, initialData } = {}) =>
  useQuery({
    queryKey: ['public', 'series', tab ?? null, category ?? null],
    queryFn: get(`/series${qs({ tab, category })}`),
    placeholderData: keepPreviousData,
    enabled,
    initialData,
  })

export const useExam = (slug) => useQuery({ queryKey: ['public', 'exam', slug], queryFn: get(`/exams/${encodeURIComponent(slug)}`) })
export const useClass = (slug) => useQuery({ queryKey: ['public', 'class', slug], queryFn: get(`/classes/${encodeURIComponent(slug)}`) })
export const useFreeTest = (slug) => useQuery({ queryKey: ['public', 'free-test', slug], queryFn: get(`/free-tests/${encodeURIComponent(slug)}`) })
export const useProduct = (slug) => useQuery({ queryKey: ['public', 'product', slug], queryFn: get(`/products/${encodeURIComponent(slug)}`) })
export const usePage = (slug) => useQuery({ queryKey: ['public', 'page', slug], queryFn: get(`/pages/${encodeURIComponent(slug)}`) })

export const useSearch = (q) =>
  useQuery({
    queryKey: ['public', 'search', q],
    queryFn: get(`/search${qs({ q, limit: 6 })}`),
    enabled: q.trim().length > 0,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
  })

export const searchNow = (q) => api(`/public/search${qs({ q, limit: 1 })}`)

export const useJoinWaitlist = () => useMutation({ mutationFn: (email) => api('/public/waitlist', { method: 'POST', body: { email } }) })

/** Fire-and-forget banner click counter. */
export const trackBannerClick = (id) => {
  if (id) api(`/public/banners/${encodeURIComponent(id)}/click`, { method: 'POST' }).catch(() => {})
}
