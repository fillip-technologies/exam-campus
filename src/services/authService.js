/**
 * Authentication service.
 *
 * DEMO IMPLEMENTATION: accounts and the session live in this browser's localStorage, so it only
 * proves the login flow in the UI. Before launch, replace `signup`, `login`, `getSession` and
 * `logout` with calls to the real backend (and keep the same return shapes), for example an
 * HTTP-only cookie session. Nothing else in the app needs to change.
 */
const USERS_KEY = 'examcampus.demo.users'
const SESSION_KEY = 'examcampus.session'

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode): the session just will not persist */
  }
}

const sha256 = async (text) => {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

export const normalizeIdentifier = (value) => value.trim().toLowerCase()
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
export const isMobile = (value) => /^[6-9]\d{9}$/.test(value.replace(/[\s-]/g, ''))

const cleanIdentifier = (value) => (isMobile(value) ? value.replace(/[\s-]/g, '') : normalizeIdentifier(value))

const toSession = (user) => ({ id: user.id, name: user.name, identifier: user.identifier })

export async function signup({ name, identifier, password }) {
  const id = cleanIdentifier(identifier)
  const users = readJson(USERS_KEY, {})
  if (users[id]) throw new Error('An account with this email or mobile number already exists. Please log in.')

  const user = { id, name: name.trim(), identifier: id, passwordHash: await sha256(`${id}:${password}`) }
  users[id] = user
  writeJson(USERS_KEY, users)

  const session = toSession(user)
  writeJson(SESSION_KEY, session)
  return session
}

export async function login({ identifier, password }) {
  const id = cleanIdentifier(identifier)
  const user = readJson(USERS_KEY, {})[id]
  if (!user || user.passwordHash !== (await sha256(`${id}:${password}`))) {
    throw new Error('Incorrect email / mobile number or password.')
  }
  const session = toSession(user)
  writeJson(SESSION_KEY, session)
  return session
}

export const getSession = () => readJson(SESSION_KEY, null)

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}
