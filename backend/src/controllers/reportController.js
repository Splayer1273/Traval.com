import Trip from '../models/Trip.js';
import Expense from '../models/Expense.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthLabel = (key) => {
  if (!key || key.length !== 7) return key;
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

const monthKey = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/** Trips whose estimated cost counts toward spend. */
const TRIP_SPEND_STATUSES = ['approved', 'ticketed', 'completed'];

/** Expenses whose amount counts toward spend. */
const EXPENSE_SPEND_STATUSES = ['approved', 'reimbursed'];

/**
 * GET /api/reports/spend  (admin)
 * Company-wide spend aggregation across travel requests and expense claims.
 */
export const getSpendReport = asyncHandler(async (req, res) => {
  const trips = await Trip.find().populate('employee', 'department').lean();
  const expenses = await Expense.find().populate('employee', 'department').lean();

  // --- Summary ---
  const spendableTrips = trips.filter((t) => TRIP_SPEND_STATUSES.includes(t.status));
  const spendableExpenses = expenses.filter((e) => EXPENSE_SPEND_STATUSES.includes(e.status));
  const tripSpend = spendableTrips.reduce((s, t) => s + (t.estimatedCost ?? t.estimatedBudget ?? 0), 0);
  const expenseSpend = spendableExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const pendingExpenseValue = expenses
    .filter((e) => e.status === 'pending')
    .reduce((s, e) => s + (e.amount || 0), 0);

  const summary = {
    tripSpend,
    expenseSpend,
    totalSpend: tripSpend + expenseSpend,
    tripCount: trips.length,
    expenseCount: expenses.length,
    spendableTripCount: spendableTrips.length,
    avgTripCost: spendableTrips.length ? Math.round(tripSpend / spendableTrips.length) : 0,
    pendingTrips: trips.filter((t) => t.status === 'pending').length,
    pendingExpenseValue,
  };

  // --- By month (last 6 calendar months, zero-filled) ---
  const now = new Date();
  const byMonth = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    byMonth.push({ label: monthLabel(key), trips: 0, expenses: 0, total: 0 });
  }
  const monthIdx = new Map(byMonth.map((m, i) => [m.label, i]));
  trips.forEach((t) => {
    const idx = monthIdx.get(monthLabel(monthKey(t.createdAt)));
    if (idx === undefined) return;
    const cost = TRIP_SPEND_STATUSES.includes(t.status) ? (t.estimatedCost ?? t.estimatedBudget ?? 0) : 0;
    byMonth[idx].trips += cost;
    byMonth[idx].total += cost;
  });
  expenses.forEach((e) => {
    const idx = monthIdx.get(monthLabel(monthKey(e.createdAt)));
    if (idx === undefined) return;
    const amount = EXPENSE_SPEND_STATUSES.includes(e.status) ? (e.amount || 0) : 0;
    byMonth[idx].expenses += amount;
    byMonth[idx].total += amount;
  });

  // --- By department (trips + expenses) ---
  const deptMap = new Map();
  const bumpDept = (department, tripsCost, expenseCost, count) => {
    const key = department || 'Unassigned';
    const cur = deptMap.get(key) || { department: key, trips: 0, expenses: 0, total: 0, count: 0 };
    cur.trips += tripsCost;
    cur.expenses += expenseCost;
    cur.total += tripsCost + expenseCost;
    cur.count += count;
    deptMap.set(key, cur);
  };
  spendableTrips.forEach((t) => bumpDept(t.employee?.department, t.estimatedCost ?? t.estimatedBudget ?? 0, 0, 1));
  spendableExpenses.forEach((e) => bumpDept(e.employee?.department, 0, e.amount || 0, 1));
  const byDepartment = [...deptMap.values()].sort((a, b) => b.total - a.total);

  // --- By destination (spendable trips) ---
  const destMap = new Map();
  spendableTrips.forEach((t) => {
    const key = t.destination || 'Unknown';
    const cur = destMap.get(key) || { destination: key, count: 0, total: 0 };
    cur.count += 1;
    cur.total += t.estimatedCost ?? t.estimatedBudget ?? 0;
    destMap.set(key, cur);
  });
  const byDestination = [...destMap.values()].sort((a, b) => b.total - a.total);

  // --- By status ---
  const tripStatus = {};
  trips.forEach((t) => { tripStatus[t.status] = (tripStatus[t.status] || 0) + 1; });
  const expenseStatus = {};
  expenses.forEach((e) => { expenseStatus[e.status] = (expenseStatus[e.status] || 0) + 1; });

  // --- Expenses by category ---
  const catMap = new Map();
  expenses.forEach((e) => {
    const key = e.category || 'misc';
    const cur = catMap.get(key) || { category: key, count: 0, total: 0 };
    cur.count += 1;
    cur.total += e.amount || 0;
    catMap.set(key, cur);
  });
  const byCategory = [...catMap.values()].sort((a, b) => b.total - a.total);

  res.json({
    success: true,
    data: { summary, byMonth, byDepartment, byDestination, byStatus: { trips: tripStatus, expenses: expenseStatus }, byCategory },
  });
});

const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const toDay = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const toIso = (d) => (d ? new Date(d).toISOString() : '');

/**
 * GET /api/reports/export?type=trips|expenses  (admin)
 * Streams a UTF-8 CSV (BOM included for Excel) of the selected scope.
 */
export const exportCsv = asyncHandler(async (req, res) => {
  const type = req.query.type === 'expenses' ? 'expenses' : 'trips';

  let rows;
  if (type === 'expenses') {
    const expenses = await Expense.find()
      .populate('employee', 'name department designation employeeId')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });
    rows = [
      ['ID', 'Employee', 'Employee ID', 'Department', 'Designation', 'Category', 'Amount', 'Currency', 'Merchant', 'Spent On', 'Trip Ref', 'Trip Title', 'Status', 'Reviewed By', 'Reviewed At', 'Created At'],
      ...expenses.map((e) => [
        e._id.toString(), e.employee?.name || '', e.employee?.employeeId || '', e.employee?.department || '',
        e.employee?.designation || '', e.category, e.amount, e.currency, e.merchant || '', toDay(e.spentOn),
        e.tripRef || '', e.tripTitle || '', e.status, e.reviewedBy?.name || '', toIso(e.reviewedAt), toIso(e.createdAt),
      ]),
    ];
  } else {
    const trips = await Trip.find()
      .populate('employee', 'name department designation employeeId')
      .sort({ createdAt: -1 });
    rows = [
      ['Ref', 'Title', 'Employee', 'Employee ID', 'Department', 'Designation', 'From', 'Destination', 'Start Date', 'End Date', 'Purpose', 'Status', 'Estimated Cost', 'Cost Center', 'Created At'],
      ...trips.map((t) => [
        t.ref || '', t.title || '', t.employee?.name || '', t.employee?.employeeId || '', t.employee?.department || '',
        t.employee?.designation || '', t.from || '', t.destination, toDay(t.startDate), toDay(t.endDate),
        t.purpose || '', t.status, t.estimatedCost ?? t.estimatedBudget ?? 0, t.costCenter || '', toIso(t.createdAt),
      ]),
    ];
  }

  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="sunrise-${type}-report-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});
