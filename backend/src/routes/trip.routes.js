import { Router } from 'express';
import { createTrip, getTrips, getTrip, updateTrip, deleteTrip, ticketTrip } from '../controllers/tripController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.route('/').get(protect, getTrips).post(protect, createTrip);

router.patch('/:id/ticket', protect, authorize('manager', 'admin'), ticketTrip);

router.route('/:id').get(protect, getTrip).put(protect, updateTrip).delete(protect, deleteTrip);

export default router;
