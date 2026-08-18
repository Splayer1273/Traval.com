import Trip from '../models/Trip.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { serializeTrip } from '../utils/serialize.js';

const withRefs = (q) =>
  q
    .populate('employee', 'name email designation grade department employeeId')
    .populate('company', 'name')
    .populate('approver', 'name email')
    .populate('approvedBy', 'name')
    .populate('approvals.manager', 'name');

/**
 * GET /api/approvals?status=pending|approved|rejected  (manager/admin/finance)
 */
export const getApprovals = asyncHandler(async (req, res) => {
  const { status = 'pending' } = req.query;
  const filter = { status };

  if (req.user.role === 'manager' && req.user.company) {
    // Company trips plus company-less trips (e.g. newly registered users)
    filter.$or = [{ company: req.user.company }, { company: null }];
  }

  const trips = await withRefs(Trip.find(filter)).sort({ createdAt: -1 });
  res.json({ success: true, count: trips.length, data: trips.map(serializeTrip) });
});

/**
 * PATCH /api/approvals/:tripId/approve  |  /reject
 */
export const decideTrip = (decision) =>
  asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    const { comment } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) throw new AppError('Trip not found', 404);
    if (trip.status !== 'pending') {
      throw new AppError(`This trip has already been ${trip.status}`, 400);
    }

    // Managers only review trips within their own company
    if (req.user.role === 'manager' && trip.company && String(trip.company) !== String(req.user.company)) {
      throw new AppError('You can only review trips from your own company', 403);
    }

    trip.status = decision;
    trip.approvedBy = req.user._id;
    trip.approvedAt = new Date();
    if (decision === 'rejected') trip.rejectionReason = comment || 'No reason provided';

    trip.approvals.push({
      manager: req.user._id,
      decision,
      comment: comment || '',
      date: new Date(),
    });

    // Keep the workflow timeline in sync with the decision.
    trip.timeline = (trip.timeline || []).filter((t) => t.label !== 'Awaiting manager approval');
    trip.timeline.push({
      label: decision === 'approved' ? 'Approved by manager' : 'Rejected by manager',
      time: new Date(),
      done: true,
    });

    await trip.save();

    // Notify the employee of the decision.
    await Notification.create({
      userId: trip.employee,
      type: decision === 'approved' ? 'approval' : 'rejected',
      title: decision === 'approved' ? 'Trip approved' : 'Travel request rejected',
      text:
        decision === 'approved'
          ? `Your ${trip.destination} trip was approved. Booking will be confirmed shortly.`
          : comment
            ? `Your ${trip.destination} trip was rejected. Reason: ${comment}`
            : `Your ${trip.destination} trip was rejected.`,
      link: `/trips/${trip._id}`,
    });

    res.json({ success: true, message: `Trip ${decision}`, data: serializeTrip(await withRefs(Trip.findById(trip._id))) });
  });
