import { Router } from 'express';
import {
  getNotifications, unreadCount, markRead, markAllRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, unreadCount);
router.patch('/read-all', protect, markAllRead);
router.patch('/:id/read', protect, markRead);

export default router;
