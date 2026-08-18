import Trip from '../models/Trip.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { serializeTrip, serializeTripList } from '../utils/serialize.js';

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
    .populate('employee', 'name email designation grade department employeeId')
    .populate('company', 'name')
    .populate('approver', 'name email')
    .populate('approvals.manager', 'name');

const genRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `TR-${out}`;
};

const notify = (userId, data) => {
  if (!userId) return null;
  return Notification.create({ userId, ...data }).catch(() => null);
};

/**
 * POST /api/trips — create a corporate travel request.
 */
export const createTrip = asyncHandler(async (req, res) => {
  const {
    destination, startDate, endDate, purpose, estimatedCost,
    title, from, client, project, costCenter, travellers,
    flight, hotel, policy, approverEmail,
  } = req.body;

  if (!destination || !startDate || !endDate || !purpose) {
    throw new AppError('Please provide destination, startDate, endDate and purpose', 400);
  }
  if (new Date(endDate) < new Date(startDate)) {
    throw new AppError('End date must be after start date', 400);
  }

  let approver = null;
  if (approverEmail) approver = await User.findOne({ email: approverEmail.toLowerCase() });

  const now = new Date();
  const request = {
    employee: req.user._id,
    company: req.user.company,
    destination,
    startDate,
    endDate,
    purpose,
    estimatedBudget: estimatedCost ?? 0,
    estimatedCost: estimatedCost ?? 0,
    ref: genRef(),
    title: title || `${from || ''} → ${destination}`.trim(),
    from: from || '',
    client: client || '',
    project: project || '',
    costCenter: costCenter || '',
    travellers: travellers || 1,
    flight: flight || null,
    hotel: hotel || null,
    policy: policy || { flight: 'none', hotel: 'none', violation: false },
    approver: approver?._id || null,
    status: 'pending',
    timeline: [
      { label: 'Request created', time: now, done: true },
      { label: policy?.violation ? 'Policy checked — exception flagged' : 'Policy checked — compliant', time: now, done: true },
      { label: 'Awaiting manager approval', time: '', done: false },
      { label: 'Booking confirmation', time: '', done: false },
      { label: 'Ticket generated', time: '', done: false },
    ],
  };

  const trip = await Trip.create(request);

  if (approver) {
    notify(approver._id, {
      type: 'pending',
      title: 'New approval request',
      text: `${req.user.name} requested travel to ${destination} (₹${(estimatedCost || 0).toLocaleString('en-IN')}).`,
      link: '/approvals',
    });
  }

  const full = await withRefs(Trip.findById(trip._id));
  res.status(201).json({ success: true, data: serializeTrip(full) });
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
  res.json({ success: true, count: trips.length, data: serializeTripList(trips) });
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

  res.json({ success: true, data: serializeTrip(trip) });
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

  if (isOwner && trip.status !== 'pending') {
    throw new AppError('Only pending trips can be edited', 400);
  }

  const editable = [
    'destination', 'startDate', 'endDate', 'purpose', 'estimatedBudget',
    'estimatedCost', 'title', 'from', 'client', 'project', 'costCenter',
    'travellers', 'flight', 'hotel', 'policy', 'approver',
  ];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) trip[field] = req.body[field];
  });

  if (req.body.status) {
    const allowedTransitions = {
      pending: ['cancelled'],
      approved: ['cancelled', 'completed'],
      ticketed: ['completed', 'cancelled'],
    };
    const transitions = allowedTransitions[trip.status] || [];
    if (!transitions.includes(req.body.status) && req.user.role !== 'admin') {
      throw new AppError(`Cannot change status from "${trip.status}" to "${req.body.status}"`, 400);
    }
    trip.status = req.body.status;
  }

  await trip.save();
  res.json({ success: true, data: serializeTrip(await withRefs(Trip.findById(trip._id))) });
});

/**
 * DELETE /api/trips/:id  (owner or admin) — soft cancel with reason.
 */
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new AppError('Trip not found', 404);

  const isOwner = String(trip.employee) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    throw new AppError('You can only cancel your own trips', 403);
  }

  if (trip.status === 'cancelled') throw new AppError('Trip is already cancelled', 400);

  const { reason } = req.body || {};
  trip.status = 'cancelled';
  trip.cancelledBy = isOwner ? 'Employee' : 'Admin';
  trip.cancelReason = reason || 'Cancelled';
  trip.timeline = (trip.timeline || []).filter((t) => t.label !== 'Awaiting manager approval');
  trip.timeline.push({ label: 'Cancelled', time: new Date(), done: true });
  await trip.save();

  await Booking.updateMany({ trip: trip._id, status: { $ne: 'cancelled' } }, { status: 'cancelled' });

  if (trip.approver) {
    notify(trip.approver, {
      type: 'cancelled',
      title: 'Trip cancelled',
      text: `${req.user.name} cancelled their ${trip.destination} trip (${trip.ref || trip._id}).`,
      link: '/approvals',
    });
  }

  res.json({ success: true, message: 'Trip cancelled', data: serializeTrip(await withRefs(Trip.findById(trip._id))) });
});

/**
 * PATCH /api/trips/:id/ticket  (manager/admin) — confirm booking + issue ticket.
 */
export const ticketTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new AppError('Trip not found', 404);
  if (trip.status !== 'approved') {
    throw new AppError(`Only approved trips can be ticketed (current status: ${trip.status})`, 400);
  }
  if (req.user.role === 'manager' && trip.company && String(trip.company) !== String(req.user.company)) {
    throw new AppError('You can only ticket trips from your own company', 403);
  }

  trip.status = 'ticketed';
  trip.timeline = (trip.timeline || []).filter((t) => t.label !== 'Awaiting manager approval');
  trip.timeline.push({ label: 'Booking confirmed & ticket generated', time: new Date(), done: true });
  await trip.save();

  notify(trip.employee, {
    type: 'ticket',
    title: 'Ticket generated',
    text: `E-ticket for your ${trip.destination} trip (${trip.ref || trip._id}) has been issued.`,
    link: `/trips/${trip._id}`,
  });

  res.json({ success: true, message: 'Trip ticketed', data: serializeTrip(await withRefs(Trip.findById(trip._id))) });
});
