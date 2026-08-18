import { Router } from 'express';
import { getPolicies, savePolicies } from '../controllers/policyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.route('/').get(protect, getPolicies).put(protect, authorize('admin'), savePolicies);

export default router;
