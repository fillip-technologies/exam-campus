import { createContext } from 'react'

/** Holds { user, isLoggedIn, login, signup, logout, openLogin, closeLogin, requireAuth, modal }. */
export const AuthContext = createContext(null)
