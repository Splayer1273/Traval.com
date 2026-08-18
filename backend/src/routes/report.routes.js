import { Router } from 'express';
import { getSpendReport, exportCsv } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/spend', protect, authorize('admin'), getSpendReport);
router.get('/export', protect, authorize('admin'), exportCsv);

export default router;
