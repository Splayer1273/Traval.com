import Booking from '../models/Booking.js';
import Trip from '../models/Trip.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

/** Recompute a trip's actualCost from its active bookings. */
const syncTripCost = async (tripId) => {
  const agg = await Booking.aggregate([
    { $match: { trip: tripId, status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$cost' } } },
  ]);
  const total = agg[0]?.total || 0;
  await Trip.updateOne({ _id: tripId }, { actualCost: total });
};

const withRefs = (q) =>
  q
    .populate('trip', 'destination startDate endDate status')
    .populate('employee', 'name email');

/**
 * POST /api/bookings
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { trip: tripId, type, provider, cost, bookingDate, reference } = req.body;

  if (!tripId || !type || !provider || cost === undefined) {
    throw new AppError('Please provide trip, type, provider and cost', 400);
  }

  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);

  const canAccess =
    req.user.role === 'admin' ||
    String(trip.employee) === String(req.user._id) ||
    (req.user.company && String(trip.company) === String(req.user.company));
  if (!canAccess) throw new AppError('You can only add bookings to your own trips', 403);

  const booking = await Booking.create({
    trip: tripId,
    employee: trip.employee,
    type,
    provider,
    cost,
    bookingDate: bookingDate || Date.now(),
    reference,
  });

  await syncTripCost(tripId);
  const full = await withRefs(Booking.findById(booking._id));
  res.status(201).json({ success: true, data: full });
});

/**
 * GET /api/bookings?trip=&type=&status=
 */
export const getBookings = asyncHandler(async (req, res) => {
  const { trip, type, status } = req.query;
  const filter = {};
  if (trip) filter.trip = trip;
  if (type) filter.type = type;
  if (status) filter.status = status;

  // Non-admins only see bookings on trips they can access
  if (req.user.role !== 'admin') {
    const tripFilter = {};
    if (req.user.role === 'employee') {
      tripFilter.employee = req.user._id;
    } else if (req.user.company) {
      tripFilter.$or = [{ company: req.user.company }, { company: null }];
    } else {
      tripFilter.employee = req.user._id;
    }
    const tripIds = await Trip.find(tripFilter).distinct('_id');
    if (trip) {
      // Respect the ?trip= filter, but only if that trip is accessible
      if (!tripIds.some((id) => String(id) === String(trip))) {
        filter.trip = { $in: [] };
      }
    } else {
      filter.trip = { $in: tripIds };
    }
  }

  const bookings = await withRefs(Booking.find(filter)).sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, data: bookings });
});

/**
 * GET /api/bookings/:id
 */
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await withRefs(Booking.findById(req.params.id));
  if (!booking) throw new AppError('Booking not found', 404);
  res.json({ success: true, data: booking });
});

/**
 * PUT /api/bookings/:id
 */
export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);

  const trip = await Trip.findById(booking.trip);
  const isOwner = String(booking.employee) === String(req.user._id);
  const canEdit =
    req.user.role === 'admin' ||
    isOwner ||
    (req.user.company && trip && String(trip.company) === String(req.user.company));
  if (!canEdit) throw new AppError('Not authorized to edit this booking', 403);
  if (booking.status === 'cancelled') throw new AppError('Cancelled bookings cannot be edited', 400);

  const editable = ['type', 'provider', 'reference', 'cost', 'bookingDate', 'status'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) booking[field] = req.body[field];
  });

  await booking.save();
  await syncTripCost(booking.trip);
  res.json({ success: true, data: await withRefs(Booking.findById(booking._id)) });
});

/**
 * DELETE /api/bookings/:id — cancel
 */
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);

  const trip = await Trip.findById(booking.trip);
  const isOwner = String(booking.employee) === String(req.user._id);
  const canDelete =
    req.user.role === 'admin' ||
    isOwner ||
    (req.user.company && trip && String(trip.company) === String(req.user.company));
  if (!canDelete) throw new AppError('Not authorized to cancel this booking', 403);

  booking.status = 'cancelled';
  await booking.save();
  await syncTripCost(booking.trip);
  res.json({ success: true, message: 'Booking cancelled', data: booking });
});
