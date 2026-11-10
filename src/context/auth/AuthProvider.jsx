import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { onSessionLost } from '@/api/client'
import * as authService from '@/services/authService'
import { AuthContext } from './AuthContext'

const CLOSED = { open: false, reason: null, tab: 'login' }

/**
 * Keeps the logged-in user and the state of the login popup.
 *
 * On load the session is restored from the refresh cookie (`ready` turns true when that check is done).
 * requireAuth(action, reason): runs `action` right away when the user is logged in; otherwise it opens
 * the login popup and runs `action` after a successful login or sign-up.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [modal, setModal] = useState(CLOSED)
  const pendingRef = useRef(null)

  useEffect(() => {
    let alive = true
    onSessionLost((next) => alive && setUser(next))
    authService.restoreSession().then((u) => {
      if (!alive) return
      setUser(u)
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [])

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
    return session
  }, [])

  const login = useCallback(async (credentials) => completeAuth(await authService.login(credentials)), [completeAuth])
  const signup = useCallback(async (details) => completeAuth(await authService.signup(details)), [completeAuth])
  const loginWithOtp = useCallback(async (details) => completeAuth(await authService.verifyOtp(details)), [completeAuth])
  const resetPassword = useCallback(async (details) => completeAuth(await authService.resetPassword(details)), [completeAuth])

  const logout = useCallback(async () => {
    setUser(null)
    await authService.logout().catch(() => {})
  }, [])

  const requireAuth = useCallback(
    (action, reason) => {
      if (user) action()
      else openLogin({ reason, onSuccess: action })
    },
    [user, openLogin],
  )

  const value = useMemo(
    () => ({
      user,
      ready,
      isLoggedIn: Boolean(user),
      login,
      signup,
      loginWithOtp,
      resetPassword,
      logout,
      openLogin,
      closeLogin,
      requireAuth,
      modal,
    }),
    [user, ready, login, signup, loginWithOtp, resetPassword, logout, openLogin, closeLogin, requireAuth, modal],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
