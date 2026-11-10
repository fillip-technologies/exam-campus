/**
 * HTTP client for the ExamCampus API (separate host, see VITE_API_URL).
 *
 * - The access token lives in memory only; the refresh token is an httpOnly cookie the browser sends to /auth/*.
 * - A 401 on an authenticated call triggers one refresh (shared by every caller, and serialised across tabs with
 *   navigator.locks so two tabs never rotate the same cookie at once), then the call is retried once.
 * - Errors are thrown as ApiError with the server's { statusCode, message, issues?, redirect? }.
 */
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/$/, '')
const BASE = `${API_URL}/api/v1`

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || `Request failed (${status})`)
    this.status = status
    this.issues = body?.issues ?? []
    this.redirect = body?.redirect ?? null
  }

  /** { fieldPath: message } for forms */
  get fieldErrors() {
    return Object.fromEntries(this.issues.map((i) => [i.path, i.message]))
  }
}

let accessToken = null
let onSessionChange = () => {}

export const setAccessToken = (token) => {
  accessToken = token
}

/** AuthProvider registers this so a failed refresh (session expired elsewhere) logs the UI out. */
export const onSessionLost = (fn) => {
  onSessionChange = fn
}

async function parse(res) {
  if (res.status === 204) return null
  const type = res.headers.get('content-type') ?? ''
  const body = type.includes('application/json') ? await res.json().catch(() => null) : await res.text()
  if (!res.ok) throw new ApiError(res.status, typeof body === 'object' ? body : { message: body })
  return body
}

function rawRequest(path, { method = 'GET', body, headers = {}, signal } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData
  return fetch(`${BASE}${path}`, {
    method,
    signal,
    credentials: 'include',
    headers: {
      ...(body !== undefined && !isForm ? { 'content-type': 'application/json' } : {}),
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  })
}

let refreshing = null

/** POST /auth/refresh once at a time. Resolves to { accessToken, user } or null when there is no session. */
export function refreshSession() {
  if (refreshing) return refreshing
  const run = async () => {
    const res = await fetch(`${BASE}/auth/refresh`, { method: 'POST', credentials: 'include' })
    if (!res.ok) {
      accessToken = null
      return null
    }
    const data = await res.json()
    accessToken = data.accessToken
    return data
  }
  const locked = typeof navigator !== 'undefined' && navigator.locks ? () => navigator.locks.request('examcampus-refresh', run) : run
  refreshing = locked().finally(() => {
    refreshing = null
  })
  return refreshing
}

/** JSON request. `auth: true` (default when a token exists) retries once after refreshing an expired token. */
export async function api(path, options = {}) {
  let res = await rawRequest(path, options)
  if (res.status === 401 && accessToken && !path.startsWith('/auth/')) {
    const session = await refreshSession()
    if (!session) {
      onSessionChange(null)
      return parse(res)
    }
    onSessionChange(session.user)
    res = await rawRequest(path, options)
  }
  return parse(res)
}

/** Builds "?a=1&b=2", skipping empty values. */
export const qs = (params = {}) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  return entries.length ? `?${new URLSearchParams(entries).toString()}` : ''
}

/** Fetches a file (CSV export) with the auth header and saves it. */
export async function download(path, filename) {
  let res = await rawRequest(path)
  if (res.status === 401 && (await refreshSession())) res = await rawRequest(path)
  if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null))
  const url = URL.createObjectURL(await res.blob())
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click()
  URL.revokeObjectURL(url)
}
