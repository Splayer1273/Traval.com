import { delay } from '../lib/api.js'
import { HOTELS } from '../data/hotels.js'

/**
 * Hotel service — mock search + detail, API-ready shape.
 */

const LOWER = (s) => (s || '').toLowerCase()

export const hotelApi = {
  async searchHotels({ destination, checkIn, checkOut, guests = 2, rooms = 1 }) {
    // Real: return (await api.get('/hotels', { params })).data
    await delay(850)
    let results = HOTELS
    if (destination) {
      const q = LOWER(destination)
      results = HOTELS.filter(
        (h) =>
          LOWER(h.name).includes(q) ||
          LOWER(h.city).includes(q) ||
          LOWER(h.country).includes(q),
      )
    }
    return results.map((h) => ({
      ...h,
      nights: null,
      totalForStay: null,
    }))
  },

  async getHotel(id) {
    // Real: return (await api.get(`/hotels/${id}`)).data
    await delay(350)
    return HOTELS.find((h) => h.id === id) ?? null
  },
}
