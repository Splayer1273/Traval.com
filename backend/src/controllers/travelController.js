import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import {
  searchFlights as searchFlightsUtil,
  getFlightById,
  searchHotels as searchHotelsUtil,
  getHotelById,
} from '../utils/travelSearch.js';

/**
 * GET /api/travel/flights/search?from=BOM&to=BLR&date=2026-09-12&returnDate=&cabin=Economy&adults=1
 * Public — inventory search is available to guests and employees alike.
 */
export const searchFlights = asyncHandler(async (req, res) => {
  const { from, to, date, returnDate, cabin, adults } = req.query;
  const result = searchFlightsUtil({ from, to, date, returnDate, cabin, adults });
  res.json({ success: true, data: result });
});

/**
 * GET /api/travel/flights/:id — flight detail by `${flightNumber}-${dateISO}` id.
 */
export const getFlight = asyncHandler(async (req, res) => {
  const flight = getFlightById(req.params.id);
  if (!flight) throw new AppError('Flight not found', 404);
  res.json({ success: true, data: flight });
});

/**
 * GET /api/travel/hotels/search?destination=Bengaluru&checkIn=&checkOut=&guests=&rooms=
 */
export const searchHotels = asyncHandler(async (req, res) => {
  const { destination, checkIn, checkOut, guests, rooms } = req.query;
  const hotels = searchHotelsUtil({ destination });
  res.json({ success: true, count: hotels.length, data: hotels });
});

/**
 * GET /api/travel/hotels/:id
 */
export const getHotel = asyncHandler(async (req, res) => {
  const hotel = getHotelById(req.params.id);
  if (!hotel) throw new AppError('Hotel not found', 404);
  res.json({ success: true, data: hotel });
});
