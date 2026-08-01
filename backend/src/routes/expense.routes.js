import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  updateExpenseStatus,
} from '../controllers/expenseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.route('/').get(protect, getExpenses).post(protect, createExpense);

router.route('/:id').get(protect, getExpense).put(protect, updateExpense).delete(protect, deleteExpense);

router.patch('/:id/status', protect, authorize('finance', 'admin'), updateExpenseStatus);

export default router;
