import TravelPolicy from '../models/TravelPolicy.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

/**
 * GET /api/policies — designation-based travel policies (read by the
 * policy engine on every flight/hotel check).
 */
export const getPolicies = asyncHandler(async (req, res) => {
  const policies = await TravelPolicy.find().sort({ grade: 1 });
  res.json({ success: true, count: policies.length, data: policies });
});

/**
 * PUT /api/policies — admin replaces the full policy table (upsert by designation).
 */
export const savePolicies = asyncHandler(async (req, res) => {
  const { policies } = req.body;
  if (!Array.isArray(policies) || policies.length === 0) {
    throw new AppError('Please provide a non-empty policies array', 400);
  }

  for (const p of policies) {
    if (!p.designation) continue;
    const { designation, ...rest } = p;
    await TravelPolicy.findOneAndUpdate(
      { designation },
      { ...rest, designation },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const updated = await TravelPolicy.find().sort({ grade: 1 });
  res.json({ success: true, count: updated.length, data: updated });
});
