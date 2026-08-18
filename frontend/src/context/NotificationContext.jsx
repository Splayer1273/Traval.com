import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { corporateApi } from '../services/corporateApi.js'
import { useAuth } from './AuthContext.jsx'

/**
 * Corporate notification center. Loads the signed-in user's notifications
 * (server-scoped by token) and exposes an unread count for the navbar bell.
 */
const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated, sessionChecked } = useAuth()
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !sessionChecked) {
      setNotifs([])
      return
    }
    setLoading(true)
    try {
      const list = await corporateApi.getNotifications()
      setNotifs(list)
    } catch {
      // API unavailable — keep the last known list.
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, sessionChecked])

  useEffect(() => {
    refresh()
  }, [refresh])

  const markRead = useCallback(async (id) => {
    await corporateApi.markRead(id)
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllRead = useCallback(async () => {
    await corporateApi.markAllRead()
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const value = useMemo(
    () => ({
      notifs,
      loading,
      unread: notifs.filter((n) => !n.read).length,
      markRead,
      markAllRead,
      refresh,
    }),
    [notifs, loading, markRead, markAllRead, refresh],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
