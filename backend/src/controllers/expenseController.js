import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

const withRefs = (q) =>
  q
    .populate('employee', 'name email')
    .populate('trip', 'destination startDate endDate')
    .populate('reviewedBy', 'name');

/**
 * POST /api/expenses
 */
export const createExpense = asyncHandler(async (req, res) => {
  const { trip, category, amount, currency, description } = req.body;

  if (amount === undefined || !category) {
    throw new AppError('Please provide amount and category', 400);
  }

  let validTrip = null;
  if (trip) {
    const found = await Trip.findById(trip);
    if (!found) throw new AppError('Trip not found', 404);
    const canAccess =
      req.user.role === 'admin' ||
      String(found.employee) === String(req.user._id) ||
      (req.user.company && String(found.company) === String(req.user.company));
    if (!canAccess) throw new AppError('You can only file expenses against your own trips', 403);
    validTrip = trip;
  }

  const expense = await Expense.create({
    employee: req.user._id,
    trip: validTrip,
    category,
    amount,
    currency: currency || 'USD',
    description,
  });

  res.status(201).json({ success: true, data: await withRefs(Expense.findById(expense._id)) });
});

/**
 * GET /api/expenses?status=&category=&trip=
 */
export const getExpenses = asyncHandler(async (req, res) => {
  const { status, category, trip } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (trip) filter.trip = trip;

  if (req.user.role === 'employee') {
    filter.employee = req.user._id;
  } else if (req.user.role === 'manager' && req.user.company) {
    const employeeIds = await Trip.find({ company: req.user.company }).distinct('employee');
    filter.employee = { $in: employeeIds };
  }

  const expenses = await withRefs(Expense.find(filter)).sort({ createdAt: -1 });
  res.json({ success: true, count: expenses.length, data: expenses });
});

/**
 * GET /api/expenses/:id
 */
export const getExpense = asyncHandler(async (req, res) => {
  const expense = await withRefs(Expense.findById(req.params.id));
  if (!expense) throw new AppError('Expense not found', 404);
  res.json({ success: true, data: expense });
});

/**
 * PUT /api/expenses/:id  (owner, pending only)
 */
export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) throw new AppError('Expense not found', 404);
  if (String(expense.employee) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new AppError('You can only edit your own expenses', 403);
  }
  if (expense.status !== 'pending') {
    throw new AppError('Only pending expenses can be edited', 400);
  }

  const editable = ['trip', 'category', 'amount', 'currency', 'description'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) expense[field] = req.body[field];
  });

  await expense.save();
  res.json({ success: true, data: await withRefs(Expense.findById(expense._id)) });
});

/**
 * DELETE /api/expenses/:id  (owner, pending only)
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) throw new AppError('Expense not found', 404);
  if (String(expense.employee) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new AppError('You can only delete your own expenses', 403);
  }
  if (expense.status !== 'pending') {
    throw new AppError('Only pending expenses can be deleted', 400);
  }

  await expense.deleteOne();
  res.json({ success: true, message: 'Expense deleted' });
});

/**
 * PATCH /api/expenses/:id/status  (finance/admin)
 */
export const updateExpenseStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    throw new AppError('Status must be "approved" or "rejected"', 400);
  }

  const expense = await Expense.findById(req.params.id);
  if (!expense) throw new AppError('Expense not found', 404);
  if (expense.status !== 'pending') {
    throw new AppError(`This expense has already been ${expense.status}`, 400);
  }

  expense.status = status;
  expense.reviewedBy = req.user._id;
  expense.reviewedAt = new Date();
  expense.reviewNote = note || '';
  await expense.save();

  res.json({ success: true, data: await withRefs(Expense.findById(expense._id)) });
});
