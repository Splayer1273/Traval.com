import Trip from '../models/Trip.js';
import Booking from '../models/Booking.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

/**
 * Build the trip scope filter for a user based on their role.
 *  - admin        → everything
 *  - manager/finance → trips of their company
 *  - employee     → only their own trips
 */
const scopedFilter = (user, extra = {}) => {
  const filter = { ...extra };
  if (user.role === 'admin') return filter;

  if (user.role === 'employee') {
    filter.employee = user._id;
  } else if (user.company) {
    // Company trips plus company-less trips (e.g. newly registered users)
    filter.$or = [{ company: user.company }, { company: null }];
  } else {
    filter.employee = user._id;
  }
  return filter;
};

const withRefs = (q) =>
  q
    .populate('employee', 'name email title')
    .populate('company', 'name')
    .populate('approvals.manager', 'name');

/**
 * POST /api/trips
 */
export const createTrip = asyncHandler(async (req, res) => {
  const { destination, startDate, endDate, purpose, estimatedBudget } = req.body;

  if (!destination || !startDate || !endDate || !purpose || estimatedBudget === undefined) {
    throw new AppError('Please provide destination, startDate, endDate, purpose and estimatedBudget', 400);
  }
  if (new Date(endDate) < new Date(startDate)) {
    throw new AppError('End date must be after start date', 400);
  }

  const trip = await Trip.create({
    employee: req.user._id,
    company: req.user.company,
    destination,
    startDate,
    endDate,
    purpose,
    estimatedBudget,
  });

  const full = await withRefs(Trip.findById(trip._id));
  res.status(201).json({ success: true, data: full });
});

/**
 * GET /api/trips?status=&destination=&from=&to=&company=
 */
export const getTrips = asyncHandler(async (req, res) => {
  const { status, destination, from, to, company } = req.query;
  const filter = scopedFilter(req.user);

  if (status) filter.status = status;
  if (destination) filter.destination = new RegExp(destination, 'i');
  if (company) filter.company = company;
  if (from || to) {
    filter.startDate = {};
    if (from) filter.startDate.$gte = new Date(from);
    if (to) filter.startDate.$lte = new Date(to);
  }

  const trips = await withRefs(Trip.find(filter)).sort({ createdAt: -1 });
  res.json({ success: true, count: trips.length, data: trips });
});

/**
 * GET /api/trips/:id
 */
export const getTrip = asyncHandler(async (req, res) => {
  const trip = await withRefs(Trip.findById(req.params.id));
  if (!trip) throw new AppError('Trip not found', 404);

  const canAccess =
    req.user.role === 'admin' ||
    String(trip.employee?._id || trip.employee) === String(req.user._id) ||
    (req.user.company && String(trip.company?._id || trip.company) === String(req.user.company));
  if (!canAccess) throw new AppError('Not authorized to view this trip', 403);

  res.json({ success: true, data: trip });
});

/**
 * PUT /api/trips/:id  (owner while pending, or admin)
 */
export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new AppError('Trip not found', 404);

  const isOwner = String(trip.employee) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    throw new AppError('You can only edit your own trips', 403);
  }

  // Only pending trips may be edited by their owner (admin can edit anything)
  if (isOwner && trip.status !== 'pending') {
    throw new AppError('Only pending trips can be edited', 400);
  }

  const editable = ['destination', 'startDate', 'endDate', 'purpose', 'estimatedBudget'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) trip[field] = req.body[field];
  });

  if (req.body.status) {
    const allowedTransitions = {
      pending: ['cancelled'],
      approved: ['cancelled', 'completed'],
    };
    const transitions = allowedTransitions[trip.status] || [];
    if (!transitions.includes(req.body.status) && req.user.role !== 'admin') {
      throw new AppError(`Cannot change status from "${trip.status}" to "${req.body.status}"`, 400);
    }
    trip.status = req.body.status;
  }

  await trip.save();
  res.json({ success: true, data: await withRefs(Trip.findById(trip._id)) });
});

/**
 * DELETE /api/trips/:id  (owner or admin) — soft cancel
 */
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new AppError('Trip not found', 404);

  const isOwner = String(trip.employee) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    throw new AppError('You can only cancel your own trips', 403);
  }

  if (trip.status === 'cancelled') throw new AppError('Trip is already cancelled', 400);

  trip.status = 'cancelled';
  await trip.save();

  await Booking.updateMany({ trip: trip._id, status: { $ne: 'cancelled' } }, { status: 'cancelled' });

  res.json({ success: true, message: 'Trip cancelled', data: trip });
});
