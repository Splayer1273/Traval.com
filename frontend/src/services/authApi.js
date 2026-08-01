import { api, delay } from '../lib/api.js'
import { DEMO_USER } from '../data/users.js'

/**
 * Auth service.
 *
 * Mock implementation used today; swap `mockLogin` etc. for the real calls
 * (commented below) once the backend is wired in — nothing else changes.
 */

const MOCK_DELAY = 700

async function mockLogin({ email, password }) {
  await delay(MOCK_DELAY)
  if (!email || !password) throw new Error('Please enter your email and password.')
  const normalized = email.toLowerCase()
  if (normalized === 'demo@sunrise.travel') {
    return {
      user: { ...DEMO_USER, email },
      token: 'demo_token_sunrise',
    }
  }
  // Any valid-looking account can sign in for the demo.
  if (!/^\S+@\S+\.\S+$/.test(normalized)) throw new Error('That email address does not look valid.')
  if (password.length < 6) throw new Error('Password must be at least 6 characters.')
  return {
    user: { ...DEMO_USER, email, firstName: normalized.split('@')[0] },
    token: 'demo_token_sunrise',
  }
}

async function mockRegister({ firstName, lastName, email, phone, password }) {
  await delay(MOCK_DELAY)
  if (!/^\S+@\S+\.\S+$/.test(email || '')) throw new Error('Please enter a valid email address.')
  if ((password || '').length < 8) throw new Error('Password must be at least 8 characters.')
  return {
    user: { ...DEMO_USER, firstName, lastName, email, phone },
    token: 'demo_token_sunrise',
  }
}

export const authApi = {
  async login(payload) {
    // Real: return (await api.post('/auth/login', payload)).data
    return mockLogin(payload)
  },
  async register(payload) {
    // Real: return (await api.post('/auth/register', payload)).data
    return mockRegister(payload)
  },
  async me() {
    // Real: return (await api.get('/auth/me')).data
    await delay(200)
    return DEMO_USER
  },
  async forgotPassword(email) {
    // Real: return (await api.post('/auth/forgot-password', { email })).data
    await delay(MOCK_DELAY)
    if (!/^\S+@\S+\.\S+$/.test(email || '')) throw new Error('Please enter a valid email address.')
    return { success: true }
  },
  async resetPassword({ token, password }) {
    // Real: return (await api.post('/auth/reset-password', { token, password })).data
    await delay(MOCK_DELAY)
    if ((password || '').length < 8) throw new Error('Password must be at least 8 characters.')
    return { success: true }
  },
  async logout() {
    // Real: return (await api.post('/auth/logout')).data
    await delay(150)
    return { success: true }
  },
}
