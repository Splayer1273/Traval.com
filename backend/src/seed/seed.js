import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Trip from '../models/Trip.js';
import Booking from '../models/Booking.js';
import Expense from '../models/Expense.js';
import TravelPolicy from '../models/TravelPolicy.js';
import Notification from '../models/Notification.js';

const PASSWORD = process.env.SEED_PASSWORD || 'Password@123';
const MONGO_URI = process.env.MONGO_URI;

/** Designation-based travel policies (admin-editable via PUT /api/policies). */
const POLICIES = [
  { designation: 'Junior Executive', grade: 'A', salaryBand: '₹4–8 LPA', flightClass: 'Economy', premiumEconomy: false, business: false, hotelStars: 3, hotelLimit: 4000, dailyAllowance: 1200, advanceDays: 7, international: 'Economy only' },
  { designation: 'Executive', grade: 'B', salaryBand: '₹8–15 LPA', flightClass: 'Economy', premiumEconomy: false, business: false, hotelStars: 3, hotelLimit: 5000, dailyAllowance: 1500, advanceDays: 7, international: 'Economy only' },
  { designation: 'Senior Executive', grade: 'C', salaryBand: '₹15–25 LPA', flightClass: 'Economy', premiumEconomy: false, business: false, hotelStars: 4, hotelLimit: 6000, dailyAllowance: 1800, advanceDays: 5, international: 'Economy only' },
  { designation: 'Manager', grade: 'D', salaryBand: '₹25–40 LPA', flightClass: 'Economy', premiumEconomy: false, business: false, hotelStars: 4, hotelLimit: 8000, dailyAllowance: 2200, advanceDays: 5, international: 'Economy only' },
  { designation: 'Senior Manager', grade: 'E', salaryBand: '₹40–60 LPA', flightClass: 'Premium Economy', premiumEconomy: true, business: false, hotelStars: 4, hotelLimit: 10000, dailyAllowance: 2500, advanceDays: 3, international: 'Premium Economy permitted' },
  { designation: 'Director', grade: 'F', salaryBand: '₹60–90 LPA', flightClass: 'Premium Economy', premiumEconomy: true, business: false, hotelStars: 5, hotelLimit: 12000, dailyAllowance: 3000, advanceDays: 3, international: 'Premium Economy permitted' },
  { designation: 'Vice President', grade: 'G', salaryBand: '₹90 LPA+', flightClass: 'Business', premiumEconomy: true, business: true, hotelStars: 5, hotelLimit: 15000, dailyAllowance: 3500, advanceDays: 2, international: 'Business class permitted' },
  { designation: 'C-Level Executive', grade: 'H', salaryBand: 'Board level', flightClass: 'Business', premiumEconomy: true, business: true, hotelStars: 5, hotelLimit: 25000, dailyAllowance: 5000, advanceDays: 1, international: 'Business class permitted' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('🗑️  Clearing existing data…');
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Trip.deleteMany({}),
    Booking.deleteMany({}),
    Expense.deleteMany({}),
    TravelPolicy.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('🏢 Creating companies…');
  const [acme] = await Company.create([
    { name: 'Acme Technologies Pvt. Ltd.', industry: 'Software & IT Services', contactEmail: 'travel@acme.com', contactPhone: '+91 22 4000 1234', address: 'Cyber City, Tower B, Gurugram 122002' },
    { name: 'Globex Inc.', industry: 'Manufacturing', contactEmail: 'people@globex.com', contactPhone: '+1 312 555 0142', address: '500 W Madison St, Chicago, IL' },
    { name: 'Initech', industry: 'Finance', contactEmail: 'admin@initech.io', contactPhone: '+1 212 555 0177', address: '1 Liberty Plaza, New York, NY' },
  ]);

  console.log('👤 Creating users…');
  const [admin, manager, finance, emma, john, priya, vikram, rahul, amit, acmeAdmin] = await User.create([
    { name: 'Alex Morgan', email: 'admin@sunrise.io', password: PASSWORD, role: 'admin', title: 'Platform Administrator', company: null },
    { name: 'Sarah Chen', email: 'manager@acme.com', password: PASSWORD, role: 'manager', title: 'VP of Operations', company: acme._id, designation: 'Vice President', grade: 'G', department: 'Operations', employeeId: 'EMP-0900' },
    { name: 'David Okafor', email: 'finance@acme.com', password: PASSWORD, role: 'finance', title: 'Finance Lead', company: acme._id, designation: 'Senior Manager', grade: 'E', department: 'Finance', employeeId: 'FIN-0001' },
    { name: 'Emma Wilson', email: 'emma@acme.com', password: PASSWORD, role: 'employee', title: 'Solutions Engineer', company: acme._id, designation: 'Executive', grade: 'B', department: 'Technology', employeeId: 'EMP-1025', manager: 'Amit Sharma', managerEmail: 'amit@acme.com' },
    { name: 'John Carter', email: 'john@globex.com', password: PASSWORD, role: 'employee', title: 'Field Sales', company: null, designation: 'Manager', grade: 'D', department: 'Sales & Business Development', employeeId: 'EMP-2001' },
    { name: 'Priya Sharma', email: 'priya@initech.com', password: PASSWORD, role: 'employee', title: 'Consultant', company: null, designation: 'Senior Executive', grade: 'C', department: 'Finance', employeeId: 'EMP-3001' },
    { name: 'Vikram Rao', email: 'vikram@acme.com', password: PASSWORD, role: 'employee', title: 'Enterprise Sales Lead', company: acme._id, designation: 'Manager', grade: 'D', department: 'Sales & Business Development', employeeId: 'EMP-1250', manager: 'Amit Sharma', managerEmail: 'amit@acme.com', location: 'Bengaluru' },
    { name: 'Rahul Sharma', email: 'rahul@acme.com', password: PASSWORD, role: 'employee', title: 'Software Engineer', company: acme._id, designation: 'Executive', grade: 'B', department: 'Technology', employeeId: 'EMP-1024', manager: 'Amit Sharma', managerEmail: 'amit@acme.com', costCenter: 'CC-4201', projectCode: 'SUNRISE-PLT', location: 'Gurugram' },
    { name: 'Amit Sharma', email: 'amit@acme.com', password: PASSWORD, role: 'manager', title: 'VP of Engineering', company: acme._id, designation: 'Vice President', grade: 'G', department: 'Technology', employeeId: 'EMP-0901', manager: 'Board', costCenter: 'CC-4000', location: 'Gurugram' },
    { name: 'Neha Verma', email: 'admin@acme.com', password: PASSWORD, role: 'admin', title: 'Travel Administrator', company: acme._id, designation: 'C-Level Executive', grade: 'H', department: 'Operations', employeeId: 'ADM-0001', location: 'Gurugram' },
  ]);

  console.log('🧾 Creating travel policies…');
  await TravelPolicy.create(POLICIES);

  console.log('✈️  Creating travel requests…');
  const today = new Date();
  const iso = (offsetDays) => new Date(today.getTime() + offsetDays * 86400000).toISOString().slice(0, 10);
  const at = (offsetDays, hour = 9, minute = 30) => {
    const d = new Date(today.getTime() + offsetDays * 86400000);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  const mkApproval = (managerId, decision, comment, date) => ({ manager: managerId, decision, comment, date });

  const [tripBengaluru, tripDelhi, tripPune, tripLuxury, tripCancelled] = await Trip.create([
    {
      employee: rahul._id, company: acme._id, destination: 'Bengaluru', startDate: iso(12), endDate: iso(15),
      purpose: 'Product demo & sprint planning with ABC Technologies', estimatedBudget: 19229, estimatedCost: 19229,
      ref: 'TR-8K3M2A', title: 'Client Meeting — Bengaluru', from: 'Mumbai', client: 'ABC Technologies', project: 'Project Sunrise', costCenter: 'CC-4201', travellers: 1,
      flight: { airline: 'IndiGo', flightNumber: '6E-6111', cabin: 'Economy', from: { code: 'BOM', city: 'Mumbai' }, to: { code: 'BLR', city: 'Bengaluru' }, dep: at(12, 8, 30), arr: at(12, 10, 10), durationMin: 100, stops: 0, price: 3299, baggage: '23 kg', refundable: false },
      hotel: { name: 'Royal Orchid Central', city: 'Bengaluru', star: 3, room: 'Executive Room', pricePerNight: 4500, nights: 3, total: 15930, taxPct: 18 },
      policy: { flight: 'within', hotel: 'within', violation: false },
      status: 'pending', approver: amit._id,
      timeline: [
        { label: 'Request created', time: at(-1, 16, 45), done: true },
        { label: 'Policy checked — compliant', time: at(-1, 16, 46), done: true },
        { label: 'Awaiting manager approval', time: '', done: false },
        { label: 'Booking confirmation', time: '', done: false },
        { label: 'Ticket generated', time: '', done: false },
      ],
    },
    {
      employee: rahul._id, company: acme._id, destination: 'Delhi', startDate: iso(30), endDate: iso(33),
      purpose: 'Attend SaaS India Summit 2026', estimatedBudget: 23907, estimatedCost: 23907,
      ref: 'TR-9PL2QW', title: 'Tech Conference — Delhi', from: 'Mumbai', project: 'Project Sunrise', costCenter: 'CC-4201', travellers: 1,
      flight: { airline: 'Vistara', flightNumber: 'UK-911', cabin: 'Economy', from: { code: 'BOM', city: 'Mumbai' }, to: { code: 'DEL', city: 'Delhi' }, dep: at(30, 9, 0), arr: at(30, 11, 25), durationMin: 145, stops: 0, price: 5499, baggage: '23 kg', refundable: true },
      hotel: { name: 'Courtyard by Marriott', city: 'Delhi', star: 3, room: 'Standard Room', pricePerNight: 5200, nights: 3, total: 18408, taxPct: 18 },
      policy: { flight: 'within', hotel: 'within', violation: false },
      status: 'approved', approver: amit._id, approvedBy: amit._id, approvedAt: at(0, 10, 15),
      approvals: [mkApproval(amit._id, 'approved', 'Approved — aligns with Q3 conference budget.', at(0, 10, 15))],
      timeline: [
        { label: 'Request created', time: at(-3, 11, 20), done: true },
        { label: 'Policy checked — compliant', time: at(-3, 11, 21), done: true },
        { label: 'Approved by Amit Sharma', time: at(0, 10, 15), done: true },
        { label: 'Booking confirmation', time: '', done: false },
        { label: 'Ticket generated', time: '', done: false },
      ],
    },
    {
      employee: rahul._id, company: acme._id, destination: 'Pune', startDate: iso(-24), endDate: iso(-22),
      purpose: 'On-site integration workshop with partner team', estimatedBudget: 3899, estimatedCost: 3899,
      ref: 'TR-5H6T8U', title: 'Partner Workshop — Pune', from: 'Mumbai', client: 'Nexus Systems', project: 'Project Horizon', costCenter: 'CC-4201', travellers: 1,
      flight: { airline: 'Air India', flightNumber: 'AI-606', cabin: 'Economy', from: { code: 'BOM', city: 'Mumbai' }, to: { code: 'PNQ', city: 'Pune' }, dep: at(-24, 7, 15), arr: at(-24, 8, 10), durationMin: 55, stops: 0, price: 3899, baggage: '23 kg', refundable: true },
      hotel: null,
      policy: { flight: 'within', hotel: 'none', violation: false },
      status: 'completed', approver: amit._id, approvedBy: amit._id, approvedAt: at(-26, 9, 0),
      approvals: [mkApproval(amit._id, 'approved', 'Approved.', at(-26, 9, 0))],
      timeline: [
        { label: 'Request created', time: at(-27, 14, 30), done: true },
        { label: 'Policy checked — compliant', time: at(-27, 14, 31), done: true },
        { label: 'Approved by Amit Sharma', time: at(-26, 9, 0), done: true },
        { label: 'Ticket issued', time: at(-25, 10, 0), done: true },
        { label: 'Trip completed', time: at(-22, 18, 0), done: true },
      ],
    },
    {
      employee: priya._id, company: acme._id, destination: 'Mumbai', startDate: iso(8), endDate: iso(11),
      purpose: 'Statutory audit support at HO', estimatedBudget: 92929, estimatedCost: 92929,
      ref: 'TR-2V4X6Z', title: 'Auditor Visit — Mumbai', from: 'Delhi', costCenter: 'CC-4403', travellers: 1,
      flight: { airline: 'Air India', flightNumber: 'AI-864', cabin: 'Economy', from: { code: 'DEL', city: 'Delhi' }, to: { code: 'BOM', city: 'Mumbai' }, dep: at(8, 12, 0), arr: at(8, 14, 30), durationMin: 150, stops: 0, price: 6199, baggage: '23 kg', refundable: true },
      hotel: { name: 'The Taj Mahal Palace', city: 'Mumbai', star: 5, room: 'Heritage Room', pricePerNight: 24500, nights: 3, total: 86730, taxPct: 18 },
      policy: { flight: 'within', hotel: 'outside', violation: true },
      status: 'pending', approver: amit._id,
      timeline: [
        { label: 'Request created', time: at(-1, 9, 5), done: true },
        { label: 'Policy checked — hotel above limit', time: at(-1, 9, 6), done: true },
        { label: 'Awaiting manager approval', time: '', done: false },
        { label: 'Booking confirmation', time: '', done: false },
        { label: 'Ticket generated', time: '', done: false },
      ],
    },
    {
      employee: vikram._id, company: acme._id, destination: 'Hyderabad', startDate: iso(-8), endDate: iso(-6),
      purpose: 'Enterprise deal pitch to TechNova', estimatedBudget: 3499, estimatedCost: 3499,
      ref: 'TR-7W9X1Y', title: 'Client Pitch — Hyderabad', from: 'Bengaluru', client: 'TechNova', costCenter: 'CC-4301', travellers: 1,
      flight: { airline: 'IndiGo', flightNumber: '6E-231', cabin: 'Economy', from: { code: 'BLR', city: 'Bengaluru' }, to: { code: 'HYD', city: 'Hyderabad' }, dep: at(-8, 6, 30), arr: at(-8, 7, 35), durationMin: 65, stops: 0, price: 3499, baggage: '23 kg', refundable: false },
      hotel: null,
      policy: { flight: 'within', hotel: 'none', violation: false },
      status: 'cancelled', approver: amit._id, approvedBy: amit._id, approvedAt: at(-9, 12, 0), cancelledBy: 'Employee', cancelReason: 'Client meeting postponed to next quarter.',
      approvals: [mkApproval(amit._id, 'approved', 'Approved.', at(-9, 12, 0))],
      timeline: [
        { label: 'Request created', time: at(-10, 10, 0), done: true },
        { label: 'Policy checked — compliant', time: at(-10, 10, 1), done: true },
        { label: 'Approved by Amit Sharma', time: at(-9, 12, 0), done: true },
        { label: 'Cancelled by employee', time: at(-8, 15, 40), done: true },
      ],
    },
  ]);

  console.log('🔔 Creating notifications…');
  await Notification.create([
    { userId: rahul._id, type: 'approval', title: 'Approval received', text: 'Your Delhi conference trip was approved by Amit Sharma.', link: `/trips/${tripDelhi._id}`, read: false },
    { userId: rahul._id, type: 'pending', title: 'Awaiting approval', text: 'Your Bengaluru trip request is waiting for manager approval.', link: `/trips/${tripBengaluru._id}`, read: false },
    { userId: rahul._id, type: 'ticket', title: 'Trip completed', text: 'Partner Workshop — Pune marked as completed. Submit expenses if any.', link: `/trips/${tripPune._id}`, read: true },
    { userId: amit._id, type: 'pending', title: 'New approval request', text: 'Priya Nair requested travel to Mumbai (₹92,929) — policy exception flagged.', link: '/approvals', read: false },
    { userId: amit._id, type: 'pending', title: 'New approval request', text: 'Rahul Sharma requested travel to Bengaluru (₹19,229).', link: '/approvals', read: false },
    { userId: acmeAdmin._id, type: 'report', title: 'Weekly travel report ready', text: 'This week: 14 trips, ₹4.6L estimated spend, 2 policy exceptions.', link: '/admin', read: false },
  ]);

  console.log('🏨 Creating bookings…');
  await Booking.create([
    { trip: tripDelhi._id, employee: rahul._id, type: 'flight', provider: 'Vistara UK-911', reference: 'UK-911', cost: 5499, bookingDate: at(-1, 11, 0), status: 'confirmed' },
    { trip: tripDelhi._id, employee: rahul._id, type: 'hotel', provider: 'Courtyard by Marriott Delhi', reference: 'MAR-4472', cost: 15600, bookingDate: at(-1, 11, 5), status: 'confirmed' },
    { trip: tripPune._id, employee: rahul._id, type: 'flight', provider: 'Air India AI-606', reference: 'AI-606', cost: 3899, bookingDate: at(-25, 10, 0), status: 'confirmed' },
  ]);

  console.log('💸 Creating expense claims…');
  const spentOn = (offsetDays) => new Date(today.getTime() + offsetDays * 86400000);
  await Expense.create([
    { employee: rahul._id, company: acme._id, trip: tripPune._id, tripRef: tripPune.ref, tripTitle: tripPune.title, tripDestination: tripPune.destination, category: 'meals', amount: 1850, spentOn: spentOn(-23), merchant: 'Indian Coffee House, Pune', receipts: 2, description: 'Client lunch with Nexus Systems team', status: 'reimbursed', reviewedBy: finance._id, reviewedAt: at(-21, 11, 0), reviewNote: 'Receipts verified', reimbursedAt: at(-20, 16, 30) },
    { employee: rahul._id, company: acme._id, trip: tripPune._id, tripRef: tripPune.ref, tripTitle: tripPune.title, tripDestination: tripPune.destination, category: 'transport', amount: 2350, spentOn: spentOn(-24), merchant: 'Uber India', receipts: 3, description: 'Airport transfers and local travel during workshop', status: 'approved', reviewedBy: finance._id, reviewedAt: at(-21, 11, 15), reviewNote: 'Receipts verified' },
    { employee: rahul._id, company: acme._id, trip: tripPune._id, tripRef: tripPune.ref, tripTitle: tripPune.title, tripDestination: tripPune.destination, category: 'misc', amount: 3200, spentOn: spentOn(-23), merchant: 'Barbeque Nation, Pune', receipts: 1, description: 'Team dinner — evening of integration workshop' },
  ]);

  console.log('🔔 Creating claim notifications…');
  await Notification.create([
    { userId: finance._id, type: 'claim', title: 'New expense claim', text: 'Rahul Sharma filed a misc claim of ₹3,200 for Pune.', link: '/claims', read: false },
    { userId: rahul._id, type: 'claim', title: 'Expense claim approved', text: 'Your transport claim of ₹2,350 (Partner Workshop — Pune) was approved.', link: '/claims', read: false },
    { userId: rahul._id, type: 'claim', title: 'Expense reimbursed', text: '₹1,850 for Partner Workshop — Pune has been reimbursed to your account.', link: '/claims', read: true },
  ]);

  console.log('\n✅ Seed complete!');
  console.log('──────────────────────────────────────');
  console.log('Accounts (password: %s)', PASSWORD);
  console.log('  Employee  rahul@acme.com   (Executive, Grade B)');
  console.log('  Approver  amit@acme.com    (VP Engineering, manager)');
  console.log('  Admin     admin@acme.com   (Travel Administrator)');
  console.log('  Finance   finance@acme.com (Finance Lead)');
  console.log('  Also: emma@acme.com · john@globex.com · priya@initech.com');
  console.log('  · manager@acme.com · admin@sunrise.io');
  console.log('──────────────────────────────────────');

  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
