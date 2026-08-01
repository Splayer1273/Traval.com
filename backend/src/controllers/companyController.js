import Company from '../models/Company.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

/**
 * POST /api/companies  (admin)
 */
export const createCompany = asyncHandler(async (req, res) => {
  const { name, industry, contactEmail, contactPhone, address } = req.body;
  if (!name) throw new AppError('Company name is required', 400);

  const company = await Company.create({ name, industry, contactEmail, contactPhone, address });
  res.status(201).json({ success: true, data: company });
});

/**
 * GET /api/companies
 */
export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort('name');
  res.json({ success: true, count: companies.length, data: companies });
});

/**
 * GET /api/companies/:id
 */
export const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new AppError('Company not found', 404);
  res.json({ success: true, data: company });
});

/**
 * PUT /api/companies/:id  (admin)
 */
export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!company) throw new AppError('Company not found', 404);
  res.json({ success: true, data: company });
});

/**
 * DELETE /api/companies/:id  (admin)
 */
export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new AppError('Company not found', 404);

  const members = await User.countDocuments({ company: company._id, isActive: true });
  if (members > 0) {
    throw new AppError(`Cannot delete — ${members} active member(s) belong to this company`, 400);
  }

  company.isActive = false;
  await company.save();
  res.json({ success: true, message: 'Company removed' });
});
