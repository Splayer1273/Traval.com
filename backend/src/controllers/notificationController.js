import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

const serialize = (n) => ({
  id: n._id,
  type: n.type,
  title: n.title,
  text: n.text,
  link: n.link,
  read: n.read,
  createdAt: n.createdAt,
});

/**
 * GET /api/notifications — the signed-in user's notifications (unread first).
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifs = await Notification.find({ userId: req.user._id }).sort({ read: 1, createdAt: -1 }).limit(60);
  res.json({ success: true, count: notifs.length, data: notifs.map(serialize) });
});

/**
 * GET /api/notifications/unread-count
 */
export const unreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ userId: req.user._id, read: false });
  res.json({ success: true, count });
});

/**
 * PATCH /api/notifications/:id/read
 */
export const markRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notif) throw new AppError('Notification not found', 404);
  res.json({ success: true, data: serialize(notif) });
});

/**
 * PATCH /api/notifications/read-all
 */
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});
