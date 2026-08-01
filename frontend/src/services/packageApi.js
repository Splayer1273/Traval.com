import { delay } from '../lib/api.js'
import { PACKAGES } from '../data/packages.js'
import { DESTINATIONS } from '../data/destinations.js'

export const packageApi = {
  async getPackages() {
    // Real: return (await api.get('/packages')).data
    await delay(700)
    return PACKAGES
  },

  async getPackage(id) {
    await delay(300)
    return PACKAGES.find((p) => p.id === id) ?? null
  },

  async getDestinations() {
    // Real: return (await api.get('/destinations')).data
    await delay(700)
    return DESTINATIONS
  },

  async getDestination(slug) {
    await delay(300)
    return DESTINATIONS.find((d) => d.slug === slug) ?? null
  },
}
