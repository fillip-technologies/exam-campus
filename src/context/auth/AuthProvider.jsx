import { useCallback, useMemo, useRef, useState } from 'react'
import * as authService from '@/services/authService'
import { AuthContext } from './AuthContext'

const CLOSED = { open: false, reason: null, tab: 'login' }

/**
 * Keeps the logged-in user and the state of the login popup.
 *
 * requireAuth(action, reason): runs `action` right away when the user is logged in; otherwise it opens
 * the login popup and runs `action` after a successful login or sign-up.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession())
  const [modal, setModal] = useState(CLOSED)
  const pendingRef = useRef(null)

  const openLogin = useCallback(({ reason = null, tab = 'login', onSuccess = null } = {}) => {
    pendingRef.current = onSuccess
    setModal({ open: true, reason, tab })
  }, [])

  const closeLogin = useCallback(() => {
    pendingRef.current = null
    setModal(CLOSED)
  }, [])

  const completeAuth = useCallback((session) => {
    setUser(session)
    setModal(CLOSED)
    const next = pendingRef.current
    pendingRef.current = null
    if (next) next()
  }, [])

  const login = useCallback(async (credentials) => completeAuth(await authService.login(credentials)), [completeAuth])
  const signup = useCallback(async (details) => completeAuth(await authService.signup(details)), [completeAuth])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const requireAuth = useCallback(
    (action, reason) => {
      if (user) action()
      else openLogin({ reason, onSuccess: action })
    },
    [user, openLogin],
  )

  const value = useMemo(
    () => ({ user, isLoggedIn: Boolean(user), login, signup, logout, openLogin, closeLogin, requireAuth, modal }),
    [user, login, signup, logout, openLogin, closeLogin, requireAuth, modal],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
