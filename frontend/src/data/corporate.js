/**
 * Corporate travel domain data.
 *
 * This module holds the organisation structure (company, departments,
 * designations), the designation-based travel policy defaults, corporate
 * user profiles and the seed travel requests / notifications used by the
 * mock `corporateApi` service. Policies are editable by the admin and the
 * live copy lives in localStorage (see services/corporateApi.js).
 */

export const COMPANY = {
  id: 'cmp_acme',
  name: 'Acme Technologies Pvt. Ltd.',
  shortName: 'Acme Corp',
  industry: 'Software & IT Services',
  contactEmail: 'travel@acme.com',
  contactPhone: '+91 22 4000 1234',
  address: 'Cyber City, Tower B, Gurugram 122002',
  travelDesk: 'Travel Desk · Ext 4231 · Mon–Sat 8:00–20:00 IST',
}

export const DEPARTMENTS = [
  { id: 'dept_tech', name: 'Technology', code: 'TECH' },
  { id: 'dept_sales', name: 'Sales & Business Development', code: 'SALES' },
  { id: 'dept_finance', name: 'Finance', code: 'FIN' },
  { id: 'dept_hr', name: 'Human Resources', code: 'HR' },
  { id: 'dept_mkt', name: 'Marketing', code: 'MKT' },
  { id: 'dept_ops', name: 'Operations', code: 'OPS' },
]

/**
 * Designation → travel grade map. Grade letters drive the policy engine
 * (A is the most restrictive, H the most senior).
 */
export const DESIGNATIONS = [
  { id: 'des_je', name: 'Junior Executive', grade: 'A', salaryBand: '₹4–8 LPA' },
  { id: 'des_exe', name: 'Executive', grade: 'B', salaryBand: '₹8–15 LPA' },
  { id: 'des_sr', name: 'Senior Executive', grade: 'C', salaryBand: '₹15–25 LPA' },
  { id: 'des_mgr', name: 'Manager', grade: 'D', salaryBand: '₹25–40 LPA' },
  { id: 'des_sm', name: 'Senior Manager', grade: 'E', salaryBand: '₹40–60 LPA' },
  { id: 'des_dir', name: 'Director', grade: 'F', salaryBand: '₹60–90 LPA' },
  { id: 'des_vp', name: 'Vice President', grade: 'G', salaryBand: '₹90 LPA+', international: true },
  { id: 'des_c', name: 'C-Level Executive', grade: 'H', salaryBand: 'Board level', international: true },
]

/**
 * Default travel policies per designation. The admin can edit these at
 * runtime; `corporateApi.savePolicies` persists the working copy.
 *
 * flightClass is the *highest* permitted cabin. hotelStars is the max
 * star category. hotelLimit is per-night in INR.
 */
export const DEFAULT_POLICIES = [
  { id: 'pol_je', designation: 'Junior Executive', grade: 'A', flightClass: 'Economy', premiumEconomy: false, business: false, hotelStars: 3, hotelLimit: 4000, dailyAllowance: 1200, advanceDays: 7, international: 'Economy only' },
  { id: 'pol_exe', designation: 'Executive', grade: 'B', flightClass: 'Economy', premiumEconomy: false, business: false, hotelStars: 3, hotelLimit: 5000, dailyAllowance: 1500, advanceDays: 7, international: 'Economy only' },
  { id: 'pol_sr', designation: 'Senior Executive', grade: 'C', flightClass: 'Economy', premiumEconomy: false, business: false, hotelStars: 4, hotelLimit: 6000, dailyAllowance: 1800, advanceDays: 5, international: 'Economy only' },
  { id: 'pol_mgr', designation: 'Manager', grade: 'D', flightClass: 'Economy', premiumEconomy: false, business: false, hotelStars: 4, hotelLimit: 8000, dailyAllowance: 2200, advanceDays: 5, international: 'Economy only' },
  { id: 'pol_sm', designation: 'Senior Manager', grade: 'E', flightClass: 'Premium Economy', premiumEconomy: true, business: false, hotelStars: 4, hotelLimit: 10000, dailyAllowance: 2500, advanceDays: 3, international: 'Premium Economy permitted' },
  { id: 'pol_dir', designation: 'Director', grade: 'F', flightClass: 'Premium Economy', premiumEconomy: true, business: false, hotelStars: 5, hotelLimit: 12000, dailyAllowance: 3000, advanceDays: 3, international: 'Premium Economy permitted' },
  { id: 'pol_vp', designation: 'Vice President', grade: 'G', flightClass: 'Business', premiumEconomy: true, business: true, hotelStars: 5, hotelLimit: 15000, dailyAllowance: 3500, advanceDays: 2, international: 'Business class permitted' },
  { id: 'pol_c', designation: 'C-Level Executive', grade: 'H', flightClass: 'Business', premiumEconomy: true, business: true, hotelStars: 5, hotelLimit: 25000, dailyAllowance: 5000, advanceDays: 1, international: 'Business class permitted' },
]

/** Cabin classes a policy may permit, ordered from most to least restrictive. */
export const CABIN_ORDER = ['Economy', 'Premium Economy', 'Business', 'First Class']

export function policyForDesignation(designation) {
  return DEFAULT_POLICIES.find((p) => p.designation === designation) || DEFAULT_POLICIES[0]
}

export const TRAVEL_GRADES = [
  { grade: 'A', label: 'Grade A', maxClass: 'Economy', maxHotelStars: 3, hotelLimit: 4000 },
  { grade: 'B', label: 'Grade B', maxClass: 'Economy', maxHotelStars: 3, hotelLimit: 5000 },
  { grade: 'C', label: 'Grade C', maxClass: 'Economy', maxHotelStars: 4, hotelLimit: 6000 },
  { grade: 'D', label: 'Grade D', maxClass: 'Economy', maxHotelStars: 4, hotelLimit: 8000 },
  { grade: 'E', label: 'Grade E', maxClass: 'Premium Economy', maxHotelStars: 4, hotelLimit: 10000 },
  { grade: 'F', label: 'Grade F', maxClass: 'Premium Economy', maxHotelStars: 5, hotelLimit: 12000 },
  { grade: 'G', label: 'Grade G', maxClass: 'Business', maxHotelStars: 5, hotelLimit: 15000 },
  { grade: 'H', label: 'Grade H', maxClass: 'Business', maxHotelStars: 5, hotelLimit: 25000 },
]

/**
 * Corporate user directory. `role` is one of 'employee' | 'approver' | 'admin'
 * (the frontend's role model — mirrored from the backend's employee/manager/
 * admin roles). The logged-in profile returned by authApi is one of these.
 */
export const CORPORATE_USERS = [
  {
    id: 'emp_rahul',
    employeeId: 'EMP-1024',
    role: 'employee',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul@acme.com',
    phone: '+91 98111 22334',
    designation: 'Executive',
    grade: 'B',
    department: 'Technology',
    manager: 'Amit Sharma',
    managerEmail: 'amit@acme.com',
    costCenter: 'CC-4201',
    projectCode: 'SUNRISE-PLT',
    joined: '2023-04-10',
    location: 'Gurugram',
    avatar: null,
  },
  {
    id: 'emp_sneha',
    employeeId: 'EMP-1107',
    role: 'employee',
    firstName: 'Sneha',
    lastName: 'Iyer',
    email: 'sneha@acme.com',
    phone: '+91 98222 33445',
    designation: 'Junior Executive',
    grade: 'A',
    department: 'Human Resources',
    manager: 'Amit Sharma',
    managerEmail: 'amit@acme.com',
    costCenter: 'CC-4102',
    joined: '2024-01-22',
    location: 'Gurugram',
    avatar: null,
  },
  {
    id: 'emp_priya',
    employeeId: 'EMP-1188',
    role: 'employee',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya@acme.com',
    phone: '+91 98333 44556',
    designation: 'Senior Executive',
    grade: 'C',
    department: 'Finance',
    manager: 'Amit Sharma',
    managerEmail: 'amit@acme.com',
    costCenter: 'CC-4403',
    joined: '2022-08-15',
    location: 'Mumbai',
    avatar: null,
  },
  {
    id: 'emp_vikram',
    employeeId: 'EMP-1250',
    role: 'employee',
    firstName: 'Vikram',
    lastName: 'Rao',
    email: 'vikram@acme.com',
    phone: '+91 98444 55667',
    designation: 'Manager',
    grade: 'D',
    department: 'Sales & Business Development',
    manager: 'Amit Sharma',
    managerEmail: 'amit@acme.com',
    costCenter: 'CC-4301',
    joined: '2021-02-01',
    location: 'Bengaluru',
    avatar: null,
  },
  {
    id: 'emp_amit',
    employeeId: 'EMP-0901',
    role: 'approver',
    firstName: 'Amit',
    lastName: 'Sharma',
    email: 'amit@acme.com',
    phone: '+91 98555 66778',
    designation: 'Vice President',
    grade: 'G',
    department: 'Technology',
    manager: 'Board',
    managerEmail: '',
    costCenter: 'CC-4000',
    joined: '2018-06-01',
    location: 'Gurugram',
    avatar: null,
  },
  {
    id: 'emp_admin',
    employeeId: 'ADM-0001',
    role: 'admin',
    firstName: 'Neha',
    lastName: 'Verma',
    email: 'admin@acme.com',
    phone: '+91 98666 77889',
    designation: 'Travel Administrator',
    grade: 'H',
    department: 'Operations',
    manager: '—',
    managerEmail: '',
    costCenter: '—',
    joined: '2019-11-20',
    location: 'Gurugram',
    avatar: null,
  },
]

export const getUserByEmail = (email) =>
  CORPORATE_USERS.find((u) => u.email.toLowerCase() === (email || '').toLowerCase())

export const DEPARTMENT_OF = (name) => DEPARTMENTS.find((d) => d.name === name) || { id: 'dept_other', name, code: 'OTH' }

/** Request statuses used across the workflow. */
export const REQUEST_STATUSES = [
  { id: 'pending', label: 'Pending Approval', variant: 'warning' },
  { id: 'approved', label: 'Approved', variant: 'default' },
  { id: 'rejected', label: 'Rejected', variant: 'danger' },
  { id: 'ticketed', label: 'Ticketed', variant: 'success' },
  { id: 'completed', label: 'Completed', variant: 'secondary' },
  { id: 'cancelled', label: 'Cancelled', variant: 'outline' },
]

export const requestStatusMeta = (status) =>
  REQUEST_STATUSES.find((s) => s.id === status) || { id: status, label: status, variant: 'secondary' }

/** Expense claim statuses shown in the claims flow. */
export const CLAIM_STATUSES = [
  { id: 'pending', label: 'Pending', variant: 'warning' },
  { id: 'approved', label: 'Approved', variant: 'default' },
  { id: 'rejected', label: 'Rejected', variant: 'danger' },
  { id: 'reimbursed', label: 'Reimbursed', variant: 'success' },
]

export const claimStatusMeta = (status) =>
  CLAIM_STATUSES.find((s) => s.id === status) || { id: status, label: status, variant: 'secondary' }

/** Claim categories with labels + icons used across the claims UI. */
export const CLAIM_CATEGORIES = [
  { id: 'flight', label: 'Flight', emoji: '✈️' },
  { id: 'lodging', label: 'Lodging', emoji: '🏨' },
  { id: 'meals', label: 'Meals', emoji: '🍽️' },
  { id: 'transport', label: 'Transport', emoji: '🚕' },
  { id: 'misc', label: 'Other', emoji: '🧾' },
]

export const claimCategoryMeta = (id) =>
  CLAIM_CATEGORIES.find((c) => c.id === id) || { id, label: id || 'Other', emoji: '🧾' }

/**
 * Seed travel requests so the demo has a believable queue on day one.
 * Dates are relative to "today" so the dashboard always looks alive.
 */
function iso(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const at = (offsetDays, hour = 9, minute = 30) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const SEED_REQUESTS = [
  {
    id: 'req_bangalore',
    ref: 'TR-8K3M2A',
    employee: { id: 'emp_rahul', name: 'Rahul Sharma', email: 'rahul@acme.com', department: 'Technology', designation: 'Executive', grade: 'B', employeeId: 'EMP-1024' },
    company: 'Acme Technologies Pvt. Ltd.',
    title: 'Client Meeting — Bengaluru',
    destination: 'Bengaluru',
    from: 'Mumbai',
    purpose: 'Product demo & sprint planning with ABC Technologies',
    client: 'ABC Technologies',
    project: 'Akbar Bizvoy',
    costCenter: 'CC-4201',
    travellers: 1,
    startDate: iso(12),
    endDate: iso(15),
    flight: {
      airline: 'IndiGo', flightNumber: '6E-6111', cabin: 'Economy',
      from: { code: 'BOM', city: 'Mumbai' }, to: { code: 'BLR', city: 'Bengaluru' },
      dep: at(12, 8, 30), arr: at(12, 10, 10), durationMin: 100, stops: 0,
      price: 3299, baggage: '23 kg', refundable: false,
    },
    hotel: {
      name: 'Royal Orchid Central', city: 'Bengaluru', star: 3, room: 'Executive Room',
      pricePerNight: 4500, nights: 3, total: 15930, taxPct: 18,
    },
    estimatedCost: 19229,
    policy: { flight: 'within', hotel: 'within', violation: false },
    status: 'pending',
    approver: { id: 'emp_amit', name: 'Amit Sharma', email: 'amit@acme.com' },
    approval: null,
    createdAt: at(-1, 16, 45),
    updatedAt: at(-1, 16, 45),
    timeline: [
      { label: 'Request created', time: at(-1, 16, 45), done: true },
      { label: 'Policy checked — compliant', time: at(-1, 16, 46), done: true },
      { label: 'Awaiting manager approval', time: '', done: false },
      { label: 'Booking confirmation', time: '', done: false },
      { label: 'Ticket generated', time: '', done: false },
    ],
  },
  {
    id: 'req_delhi',
    ref: 'TR-9PL2QW',
    employee: { id: 'emp_rahul', name: 'Rahul Sharma', email: 'rahul@acme.com', department: 'Technology', designation: 'Executive', grade: 'B', employeeId: 'EMP-1024' },
    company: 'Acme Technologies Pvt. Ltd.',
    title: 'Tech Conference — Delhi',
    destination: 'Delhi',
    from: 'Mumbai',
    purpose: 'Attend SaaS India Summit 2026',
    client: '—',
    project: 'Akbar Bizvoy',
    costCenter: 'CC-4201',
    travellers: 1,
    startDate: iso(30),
    endDate: iso(33),
    flight: {
      airline: 'Vistara', flightNumber: 'UK-911', cabin: 'Economy',
      from: { code: 'BOM', city: 'Mumbai' }, to: { code: 'DEL', city: 'Delhi' },
      dep: at(30, 9, 0), arr: at(30, 11, 25), durationMin: 145, stops: 0,
      price: 5499, baggage: '23 kg', refundable: true,
    },
    hotel: {
      name: 'Courtyard by Marriott', city: 'Delhi', star: 3, room: 'Standard Room',
      pricePerNight: 5200, nights: 3, total: 18408, taxPct: 18,
    },
    estimatedCost: 23907,
    policy: { flight: 'within', hotel: 'within', violation: false },
    status: 'approved',
    approver: { id: 'emp_amit', name: 'Amit Sharma', email: 'amit@acme.com' },
    approval: { decision: 'approved', comment: 'Approved — aligns with Q3 conference budget.', at: at(0, 10, 15) },
    createdAt: at(-3, 11, 20),
    updatedAt: at(0, 10, 15),
    timeline: [
      { label: 'Request created', time: at(-3, 11, 20), done: true },
      { label: 'Policy checked — compliant', time: at(-3, 11, 21), done: true },
      { label: 'Approved by Amit Sharma', time: at(0, 10, 15), done: true },
      { label: 'Booking confirmation', time: '', done: false },
      { label: 'Ticket generated', time: '', done: false },
    ],
  },
  {
    id: 'req_pune',
    ref: 'TR-5H6T8U',
    employee: { id: 'emp_rahul', name: 'Rahul Sharma', email: 'rahul@acme.com', department: 'Technology', designation: 'Executive', grade: 'B', employeeId: 'EMP-1024' },
    company: 'Acme Technologies Pvt. Ltd.',
    title: 'Partner Workshop — Pune',
    destination: 'Pune',
    from: 'Mumbai',
    purpose: 'On-site integration workshop with partner team',
    client: 'Nexus Systems',
    project: 'Project Horizon',
    costCenter: 'CC-4201',
    travellers: 1,
    startDate: iso(-24),
    endDate: iso(-22),
    flight: {
      airline: 'Air India', flightNumber: 'AI-606', cabin: 'Economy',
      from: { code: 'BOM', city: 'Mumbai' }, to: { code: 'PNQ', city: 'Pune' },
      dep: at(-24, 7, 15), arr: at(-24, 8, 10), durationMin: 55, stops: 0,
      price: 3899, baggage: '23 kg', refundable: true,
    },
    hotel: null,
    estimatedCost: 3899,
    policy: { flight: 'within', hotel: 'none', violation: false },
    status: 'completed',
    approver: { id: 'emp_amit', name: 'Amit Sharma', email: 'amit@acme.com' },
    approval: { decision: 'approved', comment: 'Approved.', at: at(-26, 9, 0) },
    createdAt: at(-27, 14, 30),
    updatedAt: at(-24, 8, 30),
    timeline: [
      { label: 'Request created', time: at(-27, 14, 30), done: true },
      { label: 'Policy checked — compliant', time: at(-27, 14, 31), done: true },
      { label: 'Approved by Amit Sharma', time: at(-26, 9, 0), done: true },
      { label: 'Ticket issued', time: at(-25, 10, 0), done: true },
      { label: 'Trip completed', time: at(-22, 18, 0), done: true },
    ],
  },
  {
    id: 'req_luxury',
    ref: 'TR-2V4X6Z',
    employee: { id: 'emp_priya', name: 'Priya Nair', email: 'priya@acme.com', department: 'Finance', designation: 'Senior Executive', grade: 'C', employeeId: 'EMP-1188' },
    company: 'Acme Technologies Pvt. Ltd.',
    title: 'Auditor Visit — Mumbai',
    destination: 'Mumbai',
    from: 'Delhi',
    purpose: 'Statutory audit support at HO',
    client: '—',
    project: '—',
    costCenter: 'CC-4403',
    travellers: 1,
    startDate: iso(8),
    endDate: iso(11),
    flight: {
      airline: 'Air India', flightNumber: 'AI-864', cabin: 'Economy',
      from: { code: 'DEL', city: 'Delhi' }, to: { code: 'BOM', city: 'Mumbai' },
      dep: at(8, 12, 0), arr: at(8, 14, 30), durationMin: 150, stops: 0,
      price: 6199, baggage: '23 kg', refundable: true,
    },
    hotel: {
      name: 'The Taj Mahal Palace', city: 'Mumbai', star: 5, room: 'Heritage Room',
      pricePerNight: 24500, nights: 3, total: 86730, taxPct: 18,
    },
    estimatedCost: 92929,
    policy: { flight: 'within', hotel: 'outside', violation: true },
    status: 'pending',
    approver: { id: 'emp_amit', name: 'Amit Sharma', email: 'amit@acme.com' },
    approval: null,
    createdAt: at(-1, 9, 5),
    updatedAt: at(-1, 9, 5),
    timeline: [
      { label: 'Request created', time: at(-1, 9, 5), done: true },
      { label: 'Policy checked — hotel above limit', time: at(-1, 9, 6), done: true },
      { label: 'Awaiting manager approval', time: '', done: false },
      { label: 'Booking confirmation', time: '', done: false },
      { label: 'Ticket generated', time: '', done: false },
    ],
  },
  {
    id: 'req_cancelled',
    ref: 'TR-7W9X1Y',
    employee: { id: 'emp_vikram', name: 'Vikram Rao', email: 'vikram@acme.com', department: 'Sales & Business Development', designation: 'Manager', grade: 'D', employeeId: 'EMP-1250' },
    company: 'Acme Technologies Pvt. Ltd.',
    title: 'Client Pitch — Hyderabad',
    destination: 'Hyderabad',
    from: 'Bengaluru',
    purpose: 'Enterprise deal pitch to TechNova',
    client: 'TechNova',
    project: '—',
    costCenter: 'CC-4301',
    travellers: 1,
    startDate: iso(-8),
    endDate: iso(-6),
    flight: {
      airline: 'IndiGo', flightNumber: '6E-231', cabin: 'Economy',
      from: { code: 'BLR', city: 'Bengaluru' }, to: { code: 'HYD', city: 'Hyderabad' },
      dep: at(-8, 6, 30), arr: at(-8, 7, 35), durationMin: 65, stops: 0,
      price: 3499, baggage: '23 kg', refundable: false,
    },
    hotel: null,
    estimatedCost: 3499,
    policy: { flight: 'within', hotel: 'none', violation: false },
    status: 'cancelled',
    approver: { id: 'emp_amit', name: 'Amit Sharma', email: 'amit@acme.com' },
    approval: { decision: 'approved', comment: 'Approved.', at: at(-9, 12, 0) },
    cancelledBy: 'Employee',
    cancelReason: 'Client meeting postponed to next quarter.',
    createdAt: at(-10, 10, 0),
    updatedAt: at(-8, 15, 40),
    timeline: [
      { label: 'Request created', time: at(-10, 10, 0), done: true },
      { label: 'Policy checked — compliant', time: at(-10, 10, 1), done: true },
      { label: 'Approved by Amit Sharma', time: at(-9, 12, 0), done: true },
      { label: 'Cancelled by employee', time: at(-8, 15, 40), done: true },
    ],
  },
]

export const SEED_NOTIFICATIONS = [
  { id: 'nt_1', userId: 'emp_rahul', type: 'approval', title: 'Approval received', text: 'Your Delhi conference trip was approved by Amit Sharma.', time: '2 hours ago', read: false, link: '/trips/req_delhi' },
  { id: 'nt_2', userId: 'emp_rahul', type: 'pending', title: 'Awaiting approval', text: 'Your Bengaluru trip request is waiting for manager approval.', time: '1 day ago', read: false, link: '/trips/req_bangalore' },
  { id: 'nt_3', userId: 'emp_rahul', type: 'policy', title: 'Policy check', text: 'Your Bengaluru hotel selection is within the corporate limit (₹5,000/night for Grade B).', time: '1 day ago', read: true, link: '/trips/req_bangalore' },
  { id: 'nt_4', userId: 'emp_rahul', type: 'ticket', title: 'Trip completed', text: 'Partner Workshop — Pune marked as completed. Submit expenses if any.', time: '3 days ago', read: true, link: '/trips/req_pune' },
  { id: 'nt_5', userId: 'emp_amit', type: 'pending', title: 'New approval request', text: 'Priya Nair requested travel to Mumbai (₹92,929) — policy exception flagged.', time: '1 day ago', read: false, link: '/approvals' },
  { id: 'nt_6', userId: 'emp_amit', type: 'pending', title: 'New approval request', text: 'Rahul Sharma requested travel to Bengaluru (₹19,229).', time: '1 day ago', read: false, link: '/approvals' },
  { id: 'nt_7', userId: 'emp_admin', type: 'report', title: 'Weekly travel report ready', text: 'This week: 14 trips, ₹4.6L estimated spend, 2 policy exceptions.', time: '5 hours ago', read: false, link: '/admin' },
]
