import { api } from '../lib/api.js'

/**
 * Auth service — now wired to the real Express/Mongoose API.
 *
 * Backend roles (employee / manager / finance / admin) map to the portal's
 * frontend roles (employee / approver / finance / admin): manager → approver,
 * finance → finance, admin → admin, everything else → employee.
 */

function mapUser(u) {
  if (!u) return null
  const names = (u.name || '').split(' ')
  return {
    id: u.id,
    firstName: names[0] || (u.email || '').split('@')[0] || 'User',
    lastName: names.slice(1).join(' '),
    email: u.email,
    phone: u.phone || '',
    role: u.role === 'manager' ? 'approver' : u.role === 'finance' ? 'finance' : u.role === 'admin' ? 'admin' : 'employee',
    title: u.title || '',
    company: u.company || '',
    employeeId: u.employeeId || '',
    designation: u.designation || '',
    grade: u.grade || '',
    department: u.department || '',
    manager: u.manager || '',
    managerEmail: u.managerEmail || '',
    costCenter: u.costCenter || '',
    projectCode: u.projectCode || '',
    location: u.location || '',
    isCorporate: true,
    avatar: null,
    memberSince: u.createdAt ? String(u.createdAt).slice(0, 10) : new Date().toISOString().slice(0, 10),
    preferences: { currency: 'INR', language: 'en' },
  }
}

export const authApi = {
  async login(payload) {
    const res = await api.post('/auth/login', payload)
    return { user: mapUser(res.data.user), token: res.data.token }
  },
  async register(payload) {
    const res = await api.post('/auth/register', {
      name: `${payload.firstName || ''} ${payload.lastName || ''}`.trim(),
      email: payload.email,
      password: payload.password,
    })
    return { user: mapUser(res.data.user), token: res.data.token }
  },
  async me() {
    const res = await api.get('/auth/me')
    return mapUser(res.data.user)
  },
  async forgotPassword(email) {
    // No backend endpoint yet — keep the demo behaviour.
    if (!/^\S+@\S+\.\S+$/.test(email || '')) throw new Error('Please enter a valid email address.')
    return { success: true }
  },
  async resetPassword({ token, password }) {
    // No backend endpoint yet — keep the demo behaviour.
    if ((password || '').length < 8) throw new Error('Password must be at least 8 characters.')
    return { success: true }
  },
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Token may already be invalid — sign out locally regardless.
    }
    return { success: true }
  },
  async googleLogin(credential) {
    const res = await api.post('/auth/google', { credential })
    return { user: mapUser(res.data.user), token: res.data.token }
  },
}
