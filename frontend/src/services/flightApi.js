import { delay } from '../lib/api.js'
import { FLIGHT_ROUTES, CABIN_MULTIPLIER } from '../data/flights.js'
import { getAirline } from '../data/airlines.js'
import { getAirport } from '../data/airports.js'
import { addDays, todayISO } from '../utils/format.js'

/**
 * Flight service. Mock search over a real inventory — structured so the
 * methods can be swapped for backend calls later.
 */

function minutesToISO(dateISO, minutes) {
  const d = new Date(`${dateISO}T00:00:00`)
  d.setMinutes(d.getMinutes() + minutes)
  return d.toISOString()
}

function routeKey(from, to) {
  return [from, to].sort().join('-')
}

function buildFlight(base, dateISO, cabin, direction) {
  const airline = getAirline(base.airline)
  const fromCode = direction === 'out' ? base.route[0] : base.route[1]
  const toCode = direction === 'out' ? base.route[1] : base.route[0]
  const dep = base.dep + (direction === 'return' ? Math.floor(Math.random() * 8) * 15 : 0)
  const arr = dep + base.dur
  const multiplier = CABIN_MULTIPLIER[cabin] ?? 1
  const price = Math.round((base.price * multiplier) / 10) * 10
  return {
    // Deterministic id (flight number) so FlightDetails can re-find this flight.
    id: `${base.flightNumber}-${dateISO}`,
    flightNumber: base.flightNumber,
    airlineId: base.airline,
    airline: airline.name,
    airlineCode: airline.code,
    airlineColor: airline.color,
    aircraft: base.aircraft,
    cabin,
    origin: getAirport(fromCode),
    destination: getAirport(toCode),
    departure: minutesToISO(dateISO, dep),
    arrival: minutesToISO(dateISO, arr),
    durationMin: base.dur,
    stops: base.stops,
    stopCity: base.stopCity ? getAirport(base.stopCity)?.city : null,
    price,
    refundable: base.refundable,
    baggage: { cabin: '7 kg', checkin: base.route[0] === base.route[1] ? '15 kg' : '23 kg' },
    seatsLeft: 2 + Math.floor(Math.random() * 8),
  }
}

export const flightApi = {
  /** Search outbound (and optionally return) flights. */
  async searchFlights({ from, to, date, returnDate, cabin = 'Economy', adults = 1 }) {
    // Real: return (await api.get('/flights/search', { params })).data
    await delay(800)
    if (!from || !to) return { outbound: [], returnFlights: null }
    if (from === to) throw new Error('Origin and destination cannot be the same.')
    const outbound = FLIGHT_ROUTES.filter(
      (f) => routeKey(f.route[0], f.route[1]) === routeKey(from, to),
    ).map((f) => buildFlight(f, date || todayISO(1), cabin, 'out'))

    let returnFlights = null
    if (returnDate) {
      returnFlights = FLIGHT_ROUTES.filter(
        (f) => routeKey(f.route[0], f.route[1]) === routeKey(from, to),
      ).map((f) => buildFlight(f, returnDate, cabin, 'return'))
    }
    return { outbound, returnFlights }
  },

  async getFlight(id) {
    // Real: return (await api.get(`/flights/${id}`)).data
    await delay(350)
    // id = `${flightNumber}-${dateISO}`; flight numbers contain hyphens, so split at the LAST hyphen.
    const raw = id || ''
    const idx = raw.lastIndexOf('-')
    if (idx === -1) return null // malformed id (no date suffix)
    const flightNumber = raw.slice(0, idx)
    const date = raw.slice(idx + 1)
    const base = FLIGHT_ROUTES.find((f) => f.flightNumber === flightNumber)
    if (!base) return null
    return buildFlight(base, date || todayISO(3), 'Economy', 'out')
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
