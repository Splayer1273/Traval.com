import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import companyRoutes from './company.routes.js';
import tripRoutes from './trip.routes.js';
import bookingRoutes from './booking.routes.js';
import approvalRoutes from './approval.routes.js';
import expenseRoutes from './expense.routes.js';
import policyRoutes from './policy.routes.js';
import notificationRoutes from './notification.routes.js';
import travelRoutes from './travel.routes.js';
import reportRoutes from './report.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/approvals', approvalRoutes);
router.use('/expenses', expenseRoutes);
router.use('/policies', policyRoutes);
router.use('/notifications', notificationRoutes);
router.use('/travel', travelRoutes);
router.use('/reports', reportRoutes);

export default router;
