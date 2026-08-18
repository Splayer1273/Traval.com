import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

const withRefs = (q) =>
  q
    .populate('employee', 'name email designation department employeeId grade')
    .populate('trip', 'title destination startDate endDate ref status')
    .populate('reviewedBy', 'name');

const ref = (doc) => (doc && typeof doc === 'object' && doc._id ? doc._id.toString() : doc);

/** Stable API shape: `id` instead of `_id`, populated refs flattened. */
const serialize = (e) => ({
  id: e._id.toString(),
  employee:
    e.employee && typeof e.employee === 'object'
      ? {
          id: ref(e.employee),
          name: e.employee.name,
          email: e.employee.email,
          designation: e.employee.designation,
          department: e.employee.department,
          employeeId: e.employee.employeeId,
          grade: e.employee.grade,
        }
      : e.employee,
  trip:
    e.trip && typeof e.trip === 'object'
      ? {
          id: ref(e.trip),
          title: e.trip.title,
          destination: e.trip.destination,
          startDate: e.trip.startDate,
          endDate: e.trip.endDate,
          ref: e.trip.ref,
          status: e.trip.status,
        }
      : e.trip,
  tripRef: e.tripRef,
  tripTitle: e.tripTitle,
  tripDestination: e.tripDestination,
  category: e.category,
  amount: e.amount,
  currency: e.currency,
  spentOn: e.spentOn,
  merchant: e.merchant,
  receipts: e.receipts,
  description: e.description,
  status: e.status,
  reviewNote: e.reviewNote,
  reviewedBy: e.reviewedBy ? (typeof e.reviewedBy === 'object' ? { id: ref(e.reviewedBy), name: e.reviewedBy.name } : e.reviewedBy) : null,
  reviewedAt: e.reviewedAt,
  reimbursedAt: e.reimbursedAt,
  createdAt: e.createdAt,
});

const notify = (userId, data) => {
  if (!userId) return null;
  return Notification.create({ userId, ...data }).catch(() => null);
};

/** Finance contacts for a company (or any finance user if the company has none). */
const financeContacts = async (companyId) => {
  const query = { role: 'finance' };
  if (companyId) query.company = companyId;
  let finance = await User.find(query);
  if (!finance.length && companyId) finance = await User.find({ role: 'finance' });
  return finance;
};

const claimRef = (expense) => expense.tripRef || expense.tripTitle || expense.tripDestination || 'expense';

/**
 * POST /api/expenses — employee files a claim against a ticketed/completed trip.
 */
export const createExpense = asyncHandler(async (req, res) => {
  const { trip, category, amount, currency, spentOn, merchant, receipts, description } = req.body;

  if (amount === undefined || !category) {
    throw new AppError('Please provide amount and category', 400);
  }
  if (!trip) {
    throw new AppError('Expense claims must be linked to a completed trip', 400);
  }
  if (Number(amount) <= 0) {
    throw new AppError('Amount must be greater than zero', 400);
  }

  const found = await Trip.findById(trip);
  if (!found) throw new AppError('Trip not found', 404);

  const isOwner =
    String(found.employee) === String(req.user._id) || req.user.role === 'admin';
  if (!isOwner) {
    throw new AppError('You can only file claims against your own trips', 403);
  }
  if (!['ticketed', 'completed'].includes(found.status)) {
    throw new AppError(
      `Claims can only be filed on ticketed or completed trips (current status: ${found.status})`,
      400,
    );
  }

  const expense = await Expense.create({
    employee: req.user._id,
    company: found.company || req.user.company || null,
    trip: found._id,
    tripRef: found.ref || '',
    tripTitle: found.title || '',
    tripDestination: found.destination || '',
    category,
    amount: Number(amount),
    currency: currency || 'INR',
    spentOn: spentOn || null,
    merchant: merchant || '',
    receipts: Number(receipts) || 0,
    description: description || '',
  });

  // Notify finance so the claim lands in the review queue.
  const finance = await financeContacts(found.company);
  finance.forEach((f) =>
    notify(f._id, {
      type: 'claim',
      title: 'New expense claim',
      text: `${req.user.name} filed a ${category} claim of ₹${Number(amount).toLocaleString('en-IN')} for ${found.destination || 'a completed trip'}.`,
      link: '/claims',
    }),
  );

  res.status(201).json({ success: true, data: serialize(await withRefs(Expense.findById(expense._id))) });
});

/**
 * GET /api/expenses?status=&category=&trip=
 *  - employee → own claims
 *  - manager / finance → claims of their company
 *  - admin → everything
 */
export const getExpenses = asyncHandler(async (req, res) => {
  const { status, category, trip } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (trip) filter.trip = trip;

  if (req.user.role === 'employee') {
    filter.employee = req.user._id;
  } else if (req.user.role === 'finance' || req.user.role === 'manager') {
    filter.company = req.user.company;
  }

  const expenses = await withRefs(Expense.find(filter)).sort({ createdAt: -1 });
  res.json({ success: true, count: expenses.length, data: expenses.map(serialize) });
});

/**
 * GET /api/expenses/:id
 */
export const getExpense = asyncHandler(async (req, res) => {
  const expense = await withRefs(Expense.findById(req.params.id));
  if (!expense) throw new AppError('Expense not found', 404);
  res.json({ success: true, data: serialize(expense) });
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

  const editable = ['category', 'amount', 'currency', 'spentOn', 'merchant', 'receipts', 'description'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) expense[field] = req.body[field];
  });

  await expense.save();
  res.json({ success: true, data: serialize(await withRefs(Expense.findById(expense._id))) });
});

/**
 * DELETE /api/expenses/:id  (owner, pending only) — withdraw a claim.
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) throw new AppError('Expense not found', 404);
  if (String(expense.employee) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new AppError('You can only withdraw your own expenses', 403);
  }
  if (expense.status !== 'pending') {
    throw new AppError('Only pending claims can be withdrawn', 400);
  }

  await expense.deleteOne();
  res.json({ success: true, message: 'Expense withdrawn' });
});

/**
 * PATCH /api/expenses/:id/status  (finance/admin)
 *  pending → approved | rejected
 *  approved → reimbursed
 */
export const updateExpenseStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!['approved', 'rejected', 'reimbursed'].includes(status)) {
    throw new AppError('Status must be "approved", "rejected" or "reimbursed"', 400);
  }

  const expense = await Expense.findById(req.params.id);
  if (!expense) throw new AppError('Expense not found', 404);

  if (status === 'reimbursed') {
    if (expense.status !== 'approved') {
      throw new AppError('Only approved claims can be marked as reimbursed', 400);
    }
  } else if (expense.status !== 'pending') {
    throw new AppError(`This claim has already been ${expense.status}`, 400);
  }

  expense.status = status;
  expense.reviewedBy = req.user._id;
  expense.reviewedAt = new Date();
  expense.reviewNote = note || expense.reviewNote || '';
  if (status === 'reimbursed') expense.reimbursedAt = new Date();
  await expense.save();

  const notifyType = status === 'rejected' ? 'rejected' : 'claim';
  notify(expense.employee, {
    type: notifyType,
    title:
      status === 'approved'
        ? 'Expense claim approved'
        : status === 'reimbursed'
          ? 'Expense reimbursed'
          : 'Expense claim rejected',
    text:
      status === 'approved'
        ? `Your ${expense.category} claim of ₹${expense.amount.toLocaleString('en-IN')} (${claimRef(expense)}) was approved.`
        : status === 'reimbursed'
          ? `₹${expense.amount.toLocaleString('en-IN')} for ${claimRef(expense)} has been reimbursed to your account.`
          : `Your claim of ₹${expense.amount.toLocaleString('en-IN')} (${claimRef(expense)}) was rejected${note ? ` — ${note}` : '.'}`,
    link: '/claims',
  });

  res.json({ success: true, data: serialize(await withRefs(Expense.findById(expense._id))) });
});
