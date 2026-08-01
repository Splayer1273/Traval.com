import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.route('/').get(protect, getBookings).post(protect, createBooking);

router.route('/:id').get(protect, getBooking).put(protect, updateBooking).delete(protect, deleteBooking);

export default router;
