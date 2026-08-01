import { delay } from '../lib/api.js'
import { SAMPLE_BOOKINGS } from '../data/bookings.js'
import { bookingRef, pnr } from '../utils/format.js'
import { uid } from '../lib/utils.js'

/**
 * Booking service — persists bookings to localStorage so the full
 * search → book → My Trips journey works end to end with mock data.
 */

const KEY = 'sunrise_bookings'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function write(bookings) {
  localStorage.setItem(KEY, JSON.stringify(bookings))
}

/** Seed localStorage with sample bookings once. */
export function ensureSeedBookings() {
  if (!localStorage.getItem(KEY)) write(SAMPLE_BOOKINGS)
}

export const bookingApi = {
  async getBookings({ status } = {}) {
    // Real: return (await api.get('/bookings', { params: { status } })).data
    ensureSeedBookings()
    await delay(600)
    let all = read()
    if (status) all = all.filter((b) => b.status === status)
    return all
  },

  async getBooking(id) {
    // Real: return (await api.get(`/bookings/${id}`)).data
    ensureSeedBookings()
    await delay(300)
    return read().find((b) => b.id === id) ?? null
  },

  async createBooking(payload) {
    // Real: return (await api.post('/bookings', payload)).data
    await delay(1200)
    const booking = {
      id: uid('bk'),
      pnr: pnr(),
      ref: bookingRef(),
      status: payload.status || 'confirmed',
      bookingDate: new Date().toISOString().slice(0, 10),
      ...payload,
    }
    const all = read()
    write([booking, ...all])
    return booking
  },

  async cancelBooking(id) {
    // Real: return (await api.patch(`/bookings/${id}/cancel`)).data
    await delay(800)
    const all = read().map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
    write(all)
    return all.find((b) => b.id === id)
  },
}
