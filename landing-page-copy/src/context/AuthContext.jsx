import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = useCallback(async (payload) => {
    // Mock login for demo
    const mockUser = {
      id: 'demo-user',
      firstName: payload?.email?.split('@')[0] || 'Demo',
      lastName: 'User',
      email: payload?.email || 'demo@example.com',
      role: 'employee',
      department: 'Business Development',
      designation: 'Senior Executive',
      grade: 'B',
    }
    setUser(mockUser)
    return mockUser
  }, [])

  const register = useCallback(async (payload) => {
    const mockUser = {
      id: 'demo-user',
      firstName: payload?.firstName || 'Demo',
      lastName: payload?.lastName || 'User',
      email: payload?.email || 'demo@example.com',
      role: 'employee',
      department: 'Business Development',
      designation: 'Senior Executive',
      grade: 'B',
    }
    setUser(mockUser)
    return mockUser
  }, [])

  const logout = useCallback(async () => {
    setUser(null)
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
      loading: false,
      sessionChecked: true,
      login,
      register,
      logout,
      updateUser,
    }
  }, [user, login, register, logout, updateUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
