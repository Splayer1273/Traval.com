import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeRole,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.route('/').get(protect, authorize('admin'), getUsers);

router.route('/:id').get(protect, getUser).put(protect, updateUser).delete(protect, authorize('admin'), deleteUser);

router.patch('/:id/role', protect, authorize('admin'), changeRole);

export default router;
