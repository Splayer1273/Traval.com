/**
 * Server-side flight & hotel search over the shared mock inventory.
 * Mirrors the search semantics the frontend previously ran locally so the
 * API returns byte-for-byte-compatible results (same flight ids, airport
 * objects, cabin multipliers and image keys).
 */
import { FLIGHT_ROUTES, CABIN_MULTIPLIER } from '../data/flights.js';
import { HOTELS } from '../data/hotels.js';
import { getAirline } from '../data/airlines.js';
import { getAirport } from '../data/airports.js';
import AppError from './AppError.js';

const todayISO = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const minutesToISO = (dateISO, minutes) => {
  const d = new Date(`${dateISO}T00:00:00`);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
};

const routeKey = (from, to) => [from, to].sort().join('-');

const buildFlight = (base, dateISO, cabin, direction) => {
  const airline = getAirline(base.airline);
  const fromCode = direction === 'out' ? base.route[0] : base.route[1];
  const toCode = direction === 'out' ? base.route[1] : base.route[0];
  const dep = base.dep + (direction === 'return' ? Math.floor(Math.random() * 8) * 15 : 0);
  const arr = dep + base.dur;
  const multiplier = CABIN_MULTIPLIER[cabin] ?? 1;
  const price = Math.round((base.price * multiplier) / 10) * 10;
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
    baggage: { cabin: '7 kg', checkin: '23 kg' },
    seatsLeft: 2 + Math.floor(Math.random() * 8),
  };
};

/** Search outbound (and optionally return) flights on the given dates. */
export const searchFlights = ({ from, to, date, returnDate, cabin = 'Economy', adults = 1 }) => {
  if (!from || !to) return { outbound: [], returnFlights: null };
  if (from === to) throw new AppError('Origin and destination cannot be the same.', 400);

  const routes = FLIGHT_ROUTES.filter((f) => routeKey(f.route[0], f.route[1]) === routeKey(from, to));
  const outbound = routes.map((f) => buildFlight(f, date || todayISO(1), cabin, 'out'));

  let returnFlights = null;
  if (returnDate) {
    returnFlights = routes.map((f) => buildFlight(f, returnDate, cabin, 'return'));
  }

  return { outbound, returnFlights, adults: Number(adults) || 1 };
};

/**
 * Get a single flight by its search id (`${flightNumber}-${dateISO}`).
 * Both the flight number (e.g. 6E-6111) and the date suffix (YYYY-MM-DD)
 * contain hyphens, so match the trailing date explicitly instead of naively
 * splitting at the last hyphen.
 */
export const getFlightById = (id) => {
  const raw = String(id || '');
  const match = raw.match(/^(.*)-(\d{4}-\d{2}-\d{2})$/);
  if (!match) return null;
  const [, flightNumber, date] = match;
  const base = FLIGHT_ROUTES.find((f) => f.flightNumber === flightNumber);
  if (!base) return null;
  return buildFlight(base, date || todayISO(3), 'Economy', 'out');
};

/** Search hotels by destination (city / country / name substring). */
export const searchHotels = ({ destination } = {}) => {
  let results = HOTELS;
  if (destination) {
    const q = String(destination).toLowerCase();
    results = HOTELS.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q),
    );
  }
  return results;
};

export const getHotelById = (id) => HOTELS.find((h) => h.id === id) ?? null;
