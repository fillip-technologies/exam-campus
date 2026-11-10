import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The API caches public pages for 60 s too; content changes are rare.
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // 4xx answers (404, 403) are final; retry network / 5xx failures twice.
      retry: (count, err) => !(err instanceof ApiError && err.status >= 400 && err.status < 500) && count < 2,
    },
  },
})
