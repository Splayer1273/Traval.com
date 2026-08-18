import { api, delay } from '../lib/api.js'
import { FLIGHT_ROUTES } from '../data/flights.js'
import { getAirline } from '../data/airlines.js'
import { getAirport } from '../data/airports.js'
import { addDays } from '../utils/format.js'

/**
 * Flight service — search and detail now come from the backend API
 * (`GET /api/travel/flights/*`), which serves the same mock inventory the
 * app used to search locally. Flight status + price alerts remain client
 * mocks (demo extras, not part of the booking flow).
 */

const unwrap = (res) => res.data?.data ?? res.data

export const flightApi = {
  /** Search outbound (and optionally return) flights. */
  async searchFlights({ from, to, date, returnDate, cabin = 'Economy', adults = 1 }) {
    const res = await api.get('/travel/flights/search', {
      params: { from, to, date, returnDate, cabin, adults },
    })
    return unwrap(res)
  },

  /** Flight detail — id is `${flightNumber}-${dateISO}` (resolved server-side). */
  async getFlight(id) {
    const res = await api.get(`/travel/flights/${encodeURIComponent(id)}`)
    return unwrap(res)
  },

  async getPriceAlerts() {
    await delay(200)
    return [
      { id: 'pa1', from: 'BOM', to: 'DXB', target: 14999, current: 16999, email: 'aarav@example.com' },
      { id: 'pa2', from: 'DEL', to: 'LHR', target: 45999, current: 48999, email: 'aarav@example.com' },
      { id: 'pa3', from: 'BOM', to: 'GOI', target: 2599, current: 2999, email: 'aarav@example.com' },
    ]
  },

  /** Flight status lookup — deterministic-ish based on the flight number. */
  async getFlightStatus(flightNumber) {
    await delay(650)
    if (!flightNumber) return null
    const base = FLIGHT_ROUTES.find((f) => f.flightNumber.toLowerCase() === flightNumber.toLowerCase())
    if (!base) return null
    const airline = getAirline(base.airline)
    const date = addDays(new Date(), 1)
    const d = new Date(date)
    d.setMinutes(d.getMinutes() + base.dep)
    return {
      flightNumber: base.flightNumber,
      airline: airline.name,
      aircraft: base.aircraft,
      origin: getAirport(base.route[0]),
      destination: getAirport(base.route[1]),
      scheduledDep: d.toISOString(),
      scheduledArr: new Date(d.getTime() + base.dur * 60000).toISOString(),
      status: 'On Time',
      gate: String.fromCharCode(65 + (base.dep % 10)) + (base.dur % 40),
      terminal: getAirport(base.route[0]).terminal,
      checkedIn: base.refundable,
    }
  },
}
