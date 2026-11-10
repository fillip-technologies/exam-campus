/**
 * Authentication service backed by the ExamCampus API (/api/v1/auth/*).
 *
 * Same return shapes as the old localStorage demo: every call resolves to the session user
 * `{ id, name, identifier, email, mobile, role }`. The access token stays in memory (api/client.js);
 * the refresh token is an httpOnly cookie, so a page reload restores the session with `restoreSession()`.
 * Customers and staff log in the same way; `role` decides whether the admin panel opens.
 */
import { api, refreshSession, setAccessToken } from '@/api/client'

export const normalizeIdentifier = (value) => value.trim().toLowerCase()
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
export const isMobile = (value) => /^[6-9]\d{9}$/.test(value.replace(/[\s-]/g, ''))

/** The API rule (shared/identity.ts): at least 8 characters. */
export const PASSWORD_MIN = 8

const cleanIdentifier = (value) => (isMobile(value) ? value.replace(/[\s-]/g, '') : normalizeIdentifier(value))

const start = ({ accessToken, user }) => {
  setAccessToken(accessToken)
  return user
}

export async function signup({ name, identifier, password }) {
  return start(await api('/auth/signup', { method: 'POST', body: { name: name.trim(), identifier: cleanIdentifier(identifier), password } }))
}

export async function login({ identifier, password }) {
  return start(await api('/auth/login', { method: 'POST', body: { identifier: cleanIdentifier(identifier), password } }))
}

/** Sends a one-time code (LOGIN or RESET_PASSWORD). The API answers the same whether or not the account exists. */
export async function requestOtp({ identifier, purpose = 'LOGIN' }) {
  await api('/auth/otp/request', { method: 'POST', body: { identifier: cleanIdentifier(identifier), purpose } })
}

export async function verifyOtp({ identifier, code }) {
  return start(await api('/auth/otp/verify', { method: 'POST', body: { identifier: cleanIdentifier(identifier), code: code.trim() } }))
}

export async function resetPassword({ identifier, code, newPassword }) {
  return start(await api('/auth/password/reset', { method: 'POST', body: { identifier: cleanIdentifier(identifier), code: code.trim(), newPassword } }))
}

/** Restores the session from the refresh cookie (page load). Resolves to the user or null. */
export async function restoreSession() {
  const session = await refreshSession().catch(() => null)
  return session?.user ?? null
}

export async function logout() {
  try {
    await api('/auth/logout', { method: 'POST' })
  } finally {
    setAccessToken(null)
  }
}

export const STAFF_ROLES = ['SUPPORT', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']
const RANK = { STUDENT: 0, SUPPORT: 1, EDITOR: 2, ADMIN: 3, SUPER_ADMIN: 4 }

/** True when `user` has `min` role or higher. */
export const hasRole = (user, min) => Boolean(user) && (RANK[user.role] ?? 0) >= RANK[min]
export const isStaff = (user) => hasRole(user, 'SUPPORT')
