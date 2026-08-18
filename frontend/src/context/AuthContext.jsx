import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/authApi.js'

const AuthContext = createContext(null)
const USER_KEY = 'sunrise_user'
const TOKEN_KEY = 'sunrise_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  // True once the persisted token has been validated (or there was none to
  // validate). Queries and route guards wait for this so a stale token can't
  // trigger a burst of 401s before it is cleared.
  const [sessionChecked, setSessionChecked] = useState(() => !localStorage.getItem(TOKEN_KEY))

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  // Validate a persisted token on app load: a stale/expired token must not
  // leave the app "authenticated" (it would 401 on every protected call).
  // Only a real 401 clears the session — transient network errors don't log
  // the user out.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    let cancelled = false
    authApi
      .me()
      .then((u) => {
        if (!cancelled) setUser(u)
        setSessionChecked(true)
      })
      .catch((e) => {
        if (e.status === 401) {
          localStorage.removeItem(TOKEN_KEY)
          if (!cancelled) setUser(null)
        }
        // Non-401 (e.g. network down): keep the session but stop blocking UI.
        setSessionChecked(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // The axios interceptor dispatches this when any authenticated request 401s
  // mid-session (e.g. token expires while the tab is open) — drop the user so
  // protected routes redirect to /login instead of retrying the API.
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null)
      setSessionChecked(true)
    }
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [])

  const login = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { user: u, token } = await authApi.login(payload)
      localStorage.setItem(TOKEN_KEY, token)
      setSessionChecked(true)
      setUser(u)
      return u
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { user: u, token } = await authApi.register(payload)
      localStorage.setItem(TOKEN_KEY, token)
      setSessionChecked(true)
      setUser(u)
      return u
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
    }
  }, [])

  const updateUser = useCallback((patch) => {
    setUser((u) => (u ? { ...u, ...patch } : u))
  }, [])

  const value = useMemo(() => {
    const role = user?.role || (user ? 'employee' : null)
    return {
      user,
      role,
      isAuthenticated: !!user,
      isEmployee: !!user && role === 'employee',
      isApprover: !!user && ['approver', 'admin'].includes(role),
      isFinance: !!user && role === 'finance',
      isAdmin: !!user && role === 'admin',
      loading,
      sessionChecked,
      login,
      register,
      logout,
      updateUser,
    }
  }, [user, loading, sessionChecked, login, register, logout, updateUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
