import { Router } from 'express';
import {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router
  .route('/')
  .get(protect, getCompanies)
  .post(protect, authorize('admin'), createCompany);

router
  .route('/:id')
  .get(protect, getCompany)
  .put(protect, authorize('admin'), updateCompany)
  .delete(protect, authorize('admin'), deleteCompany);

export default router;
