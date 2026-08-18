import mongoose from 'mongoose';

/**
 * Designation-based corporate travel policy. The policy engine on the
 * frontend reads these; the admin console edits them (PUT /api/policies).
 */
const travelPolicySchema = new mongoose.Schema(
  {
    designation: { type: String, required: [true, 'Designation is required'], unique: true, trim: true },
    grade: { type: String, trim: true, default: '' },
    salaryBand: { type: String, trim: true, default: '' },
    flightClass: { type: String, enum: ['Economy', 'Premium Economy', 'Business', 'First Class'], default: 'Economy' },
    premiumEconomy: { type: Boolean, default: false },
    business: { type: Boolean, default: false },
    hotelStars: { type: Number, default: 3, min: 1, max: 5 },
    hotelLimit: { type: Number, default: 5000, min: 0 },
    dailyAllowance: { type: Number, default: 1500, min: 0 },
    advanceDays: { type: Number, default: 7, min: 0 },
    international: { type: String, trim: true, default: 'Economy only' },
  },
  { timestamps: true }
);

const TravelPolicy = mongoose.model('TravelPolicy', travelPolicySchema);
export default TravelPolicy;
