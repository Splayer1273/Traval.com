import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { publicUser } from './authController.js';

/**
 * GET /api/users?role=&company=&search=&isActive=  (admin)
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { role, company, search, isActive } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (company) filter.company = company;
  if (isActive) filter.isActive = isActive === 'true';
  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

  const users = await User.find(filter).populate('company', 'name').sort('name');
  res.json({ success: true, count: users.length, data: users });
});

/**
 * GET /api/users/:id
 */
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('company', 'name');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
});

/**
 * PUT /api/users/:id  (self or admin)
 */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  const isSelf = String(req.user._id) === String(user._id);
  if (!isSelf && req.user.role !== 'admin') {
    throw new AppError('You can only update your own profile', 403);
  }

  const allowed = ['name', 'email', 'phone', 'title'];
  if (req.user.role === 'admin') allowed.push('company');
  if (req.body.password) user.password = req.body.password;

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  await user.save();
  res.json({ success: true, data: user });
});

/**
 * DELETE /api/users/:id  (admin) — soft-deactivate
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (String(req.user._id) === String(user._id)) {
    throw new AppError('You cannot deactivate your own account', 400);
  }

  user.isActive = false;
  await user.save();
  res.json({ success: true, message: 'User deactivated', data: publicUser(user) });
});

/**
 * PATCH /api/users/:id/role  (admin)
 */
export const changeRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'manager', 'finance', 'employee'].includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (String(req.user._id) === String(user._id)) {
    throw new AppError('You cannot change your own role', 400);
  }

  user.role = role;
  await user.save();
  res.json({ success: true, data: publicUser(user) });
});
