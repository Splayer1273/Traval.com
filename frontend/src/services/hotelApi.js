import { api } from '../lib/api.js'

/**
 * Hotel service — search and detail now come from the backend API
 * (`GET /api/travel/hotels/*`), which serves the same inventory the app
 * used to search locally.
 */

const unwrap = (res) => res.data?.data ?? res.data

export const hotelApi = {
  async searchHotels({ destination, checkIn, checkOut, guests = 2, rooms = 1 }) {
    const res = await api.get('/travel/hotels/search', {
      params: { destination, checkIn, checkOut, guests, rooms },
    })
    return unwrap(res)
  },

  async getHotel(id) {
    const res = await api.get(`/travel/hotels/${encodeURIComponent(id)}`)
    return unwrap(res)
  },
}
