import { Router } from 'express';
import { createTrip, getTrips, getTrip, updateTrip, deleteTrip } from '../controllers/tripController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.route('/').get(protect, getTrips).post(protect, createTrip);

router.route('/:id').get(protect, getTrip).put(protect, updateTrip).delete(protect, deleteTrip);

export default router;
