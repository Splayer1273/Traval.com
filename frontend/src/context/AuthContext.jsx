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

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  const login = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { user: u, token } = await authApi.login(payload)
      localStorage.setItem(TOKEN_KEY, token)
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

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, loading, login, register, logout, updateUser }),
    [user, loading, login, register, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
