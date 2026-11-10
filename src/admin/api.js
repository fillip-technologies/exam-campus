import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, qs } from '@/api/client'

/** Admin API (/api/v1/admin/*). Every write also clears the public site cache on the server. */
export const adminApi = {
  list: (resource, params) => api(`/admin/${resource}${qs(params)}`),
  get: (resource, id) => api(`/admin/${resource}/${encodeURIComponent(id)}`),
  create: (resource, body) => api(`/admin/${resource}`, { method: 'POST', body }),
  update: (resource, id, body) => api(`/admin/${resource}/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  remove: (resource, id) => api(`/admin/${resource}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  reorder: (resource, ids) => api(`/admin/${resource}/reorder`, { method: 'PATCH', body: { ids } }),
  action: (resource, id, action) => api(`/admin/${resource}/${encodeURIComponent(id)}/${action}`, { method: 'POST' }),
}

/** After any admin write: refetch admin lists and the public pages this tab may show. */
export function useInvalidate() {
  const qc = useQueryClient()
  return (resource) => {
    qc.invalidateQueries({ queryKey: resource ? ['admin', resource] : ['admin'] })
    qc.invalidateQueries({ queryKey: ['admin', 'options'] })
    qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    qc.invalidateQueries({ queryKey: ['public'] })
  }
}

export const useAdminList = (resource, params, options = {}) =>
  useQuery({ queryKey: ['admin', resource, 'list', params], queryFn: () => adminApi.list(resource, params), ...options })

export const useAdminRow = (resource, id, options = {}) =>
  useQuery({ queryKey: ['admin', resource, 'row', id], queryFn: () => adminApi.get(resource, id), enabled: Boolean(id), ...options })

/** All rows of a resource (for pickers). Lists are small (tens to hundreds of rows). */
export const useOptions = (resource, enabled = true) =>
  useQuery({
    queryKey: ['admin', 'options', resource],
    queryFn: () => adminApi.list(resource, { pageSize: 500 }).then((r) => r.items),
    enabled: Boolean(resource) && enabled,
    staleTime: 5 * 60_000,
  })

export function useAdminMutation(fn, { resource, onSuccess, onError } = {}) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: fn,
    onError,
    onSuccess: (data, vars) => {
      invalidate(resource)
      onSuccess?.(data, vars)
    },
  })
}

export const useDashboard = () => useQuery({ queryKey: ['admin', 'dashboard'], queryFn: () => api('/admin/dashboard'), staleTime: 30_000 })
