import { delay } from '../lib/api.js'
import { DEMO_USER, NOTIFICATIONS } from '../data/users.js'

export const userApi = {
  async getProfile() {
    // Real: return (await api.get('/users/me')).data
    await delay(300)
    return DEMO_USER
  },

  async updateProfile(patch) {
    // Real: return (await api.put('/users/me', patch)).data
    await delay(700)
    return { ...DEMO_USER, ...patch }
  },

  async updatePreferences(preferences) {
    // Real: return (await api.put('/users/me/preferences', preferences)).data
    await delay(500)
    return { ...DEMO_USER, preferences }
  },

  async getNotifications() {
    await delay(300)
    return NOTIFICATIONS
  },

  async changePassword({ current, next }) {
    // Real: return (await api.put('/users/me/password', ...)).data
    await delay(800)
    if (!current || (next || '').length < 8) throw new Error('New password must be at least 8 characters.')
    return { success: true }
  },
}
