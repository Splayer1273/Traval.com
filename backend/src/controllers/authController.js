import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  company: u.company?.name || (typeof u.company === 'string' ? u.company : null),
  title: u.title,
  phone: u.phone,
  employeeId: u.employeeId,
  designation: u.designation,
  grade: u.grade,
  department: u.department,
  manager: u.manager,
  managerEmail: u.managerEmail,
  costCenter: u.costCenter,
  projectCode: u.projectCode,
  location: u.location,
  createdAt: u.createdAt,
});

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, company } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Please provide name, email and password', 400);
  }

  const exists = await User.findOne({ email });
  if (exists) throw new AppError('An account with this email already exists', 400);

  const user = await User.create({
    name,
    email,
    password,
    role: ['admin', 'manager', 'finance', 'employee'].includes(role) ? role : 'employee',
    company: company || null,
  });

  if (user.company) await user.populate('company', 'name');
  res.status(201).json({ success: true, user: publicUser(user), token: signToken(user._id) });
});

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Please provide email and password', 400);

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('This account has been deactivated', 401);

  if (user.company) await user.populate('company', 'name');
  res.json({ success: true, token: signToken(user._id), user: publicUser(user) });
});

/**
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  if (req.user.company) await req.user.populate('company', 'name');
  res.json({ success: true, user: publicUser(req.user) });
});

/**
 * POST /api/auth/logout  (stateless JWT — client discards the token)
 */
export const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});
