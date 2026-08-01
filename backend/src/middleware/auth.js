import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Protect: require a valid Bearer token and an active user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) throw new AppError('Not authorized — please log in', 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired token — please log in again', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('User for this token no longer exists', 401);
  if (!user.isActive) throw new AppError('This account has been deactivated', 401);

  req.user = user;
  next();
});

/**
 * Authorize: restrict a route to specific roles.
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError(`Role "${req.user.role}" is not authorized to access this route`, 403));
  }
  next();
};
