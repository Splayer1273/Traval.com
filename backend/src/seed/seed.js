import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Trip from '../models/Trip.js';
import Booking from '../models/Booking.js';
import Expense from '../models/Expense.js';

const PASSWORD = process.env.SEED_PASSWORD || 'Password@123';
const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('🗑️  Clearing existing data…');
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Trip.deleteMany({}),
    Booking.deleteMany({}),
    Expense.deleteMany({}),
  ]);

  console.log('🏢 Creating companies…');
  const [acme, globex, initech] = await Company.create([
    { name: 'Acme Corporation', industry: 'Software', contactEmail: 'hr@acme.com', contactPhone: '+1 415 555 0100', address: '100 Market St, San Francisco, CA' },
    { name: 'Globex Inc.', industry: 'Manufacturing', contactEmail: 'people@globex.com', contactPhone: '+1 312 555 0142', address: '500 W Madison St, Chicago, IL' },
    { name: 'Initech', industry: 'Finance', contactEmail: 'admin@initech.io', contactPhone: '+1 212 555 0177', address: '1 Liberty Plaza, New York, NY' },
  ]);

  console.log('👤 Creating users…');
  const [admin, manager, finance, emma, john, priya] = await User.create([
    { name: 'Alex Morgan', email: 'admin@sunrise.io', password: PASSWORD, role: 'admin', title: 'Platform Administrator', company: null },
    { name: 'Sarah Chen', email: 'manager@acme.com', password: PASSWORD, role: 'manager', title: 'VP of Operations', company: acme._id },
    { name: 'David Okafor', email: 'finance@acme.com', password: PASSWORD, role: 'finance', title: 'Finance Lead', company: acme._id },
    { name: 'Emma Wilson', email: 'emma@acme.com', password: PASSWORD, role: 'employee', title: 'Solutions Engineer', company: acme._id },
    { name: 'John Carter', email: 'john@globex.com', password: PASSWORD, role: 'employee', title: 'Field Sales', company: globex._id },
    { name: 'Priya Sharma', email: 'priya@initech.com', password: PASSWORD, role: 'employee', title: 'Consultant', company: initech._id },
  ]);

  console.log('✈️  Creating trips…');
  const today = new Date();
  const iso = (offsetDays) => new Date(today.getTime() + offsetDays * 86400000).toISOString().slice(0, 10);

  const [tripPending, tripApproved, tripRejected, tripGlobex, tripCompleted] = await Trip.create([
    {
      employee: emma._id, company: acme._id, destination: 'New York, USA',
      startDate: iso(10), endDate: iso(15), purpose: 'Client kickoff & product demo',
      estimatedBudget: 3200, status: 'pending',
    },
    {
      employee: emma._id, company: acme._id, destination: 'Austin, TX',
      startDate: iso(-20), endDate: iso(-16), purpose: 'Industry conference (TechConf)',
      estimatedBudget: 2400, status: 'approved',
      approvedBy: manager._id, approvedAt: new Date(),
      approvals: [{ manager: manager._id, decision: 'approved', comment: 'Approved — great value for the conference.', date: new Date() }],
    },
    {
      employee: emma._id, company: acme._id, destination: 'Tokyo, Japan',
      startDate: iso(40), endDate: iso(48), purpose: 'Exploratory partnership meeting',
      estimatedBudget: 6800, status: 'rejected', rejectionReason: 'Not in the current quarter budget.',
      approvedBy: manager._id, approvedAt: new Date(),
      approvals: [{ manager: manager._id, decision: 'rejected', comment: 'Not in the current quarter budget.', date: new Date() }],
    },
    {
      employee: john._id, company: globex._id, destination: 'Denver, CO',
      startDate: iso(5), endDate: iso(8), purpose: 'Site visit — new warehouse partner',
      estimatedBudget: 1800, status: 'pending',
    },
    {
      employee: priya._id, company: initech._id, destination: 'London, UK',
      startDate: iso(-45), endDate: iso(-38), purpose: 'Quarterly board review',
      estimatedBudget: 4200, status: 'completed', actualCost: 3950,
      approvedBy: admin._id, approvedAt: new Date(),
      approvals: [{ manager: admin._id, decision: 'approved', comment: 'Approved', date: new Date() }],
    },
  ]);

  console.log('🏨 Creating bookings…');
  await Booking.create([
    { trip: tripApproved._id, employee: emma._id, type: 'flight', provider: 'Delta Airlines', reference: 'DL-8821', cost: 640, bookingDate: iso(-19) },
    { trip: tripApproved._id, employee: emma._id, type: 'hotel', provider: 'Marriott Downtown', reference: 'MAR-4472', cost: 760, bookingDate: iso(-18) },
    { trip: tripApproved._id, employee: emma._id, type: 'cab', provider: 'Uber', reference: 'UB-11903', cost: 120, bookingDate: iso(-17) },
    { trip: tripCompleted._id, employee: priya._id, type: 'flight', provider: 'British Airways', reference: 'BA-3301', cost: 1250, bookingDate: iso(-44) },
    { trip: tripCompleted._id, employee: priya._id, type: 'hotel', provider: 'The Savoy', reference: 'SAV-0091', cost: 2700, bookingDate: iso(-44) },
  ]);

  // Keep the approved trip's actual cost in sync with its bookings
  tripApproved.actualCost = 640 + 760 + 120;
  await tripApproved.save();

  console.log('💸 Creating expenses…');
  await Expense.create([
    { employee: emma._id, trip: tripApproved._id, category: 'transport', amount: 45.5, description: 'Airport rides during conference', status: 'pending' },
    { employee: emma._id, trip: tripApproved._id, category: 'meals', amount: 132.0, description: 'Team dinner with prospects', status: 'approved', reviewedBy: finance._id, reviewedAt: new Date(), reviewNote: 'Receipt verified' },
    { employee: priya._id, trip: tripCompleted._id, category: 'lodging', amount: 520.0, description: 'Extended stay — client site', status: 'approved', reviewedBy: finance._id, reviewedAt: new Date() },
    { employee: priya._id, trip: tripCompleted._id, category: 'meals', amount: 90.0, description: 'Meals during board review', status: 'rejected', reviewedBy: finance._id, reviewedAt: new Date(), reviewNote: 'Missing itemized receipt' },
    { employee: john._id, category: 'transport', amount: 28.0, description: 'Parking at Denver office', status: 'pending' },
  ]);

  console.log('\n✅ Seed complete!');
  console.log('──────────────────────────────────────');
  console.log('Accounts (password: %s)', PASSWORD);
  console.log('  Admin    admin@sunrise.io  (role: admin)');
  console.log('  Manager  manager@acme.com  (role: manager)');
  console.log('  Finance  finance@acme.com  (role: finance)');
  console.log('  Employee emma@acme.com    (role: employee)');
  console.log('  Employee john@globex.com  (role: employee)');
  console.log('  Employee priya@initech.com (role: employee)');
  console.log('──────────────────────────────────────');

  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
