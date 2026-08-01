import { Router } from 'express';
import { getApprovals, decideTrip } from '../controllers/approvalController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, authorize('manager', 'admin', 'finance'), getApprovals);

router.patch('/:tripId/approve', protect, authorize('manager', 'admin'), decideTrip('approved'));
router.patch('/:tripId/reject', protect, authorize('manager', 'admin'), decideTrip('rejected'));

export default router;
