import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
    destination: { type: String, required: [true, 'Destination is required'], trim: true },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    purpose: { type: String, required: [true, 'Purpose is required'], trim: true },
    estimatedBudget: { type: Number, required: [true, 'Estimated budget is required'], min: 0 },
    actualCost: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, trim: true, default: '' },
    approvals: [
      {
        manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        decision: { type: String, enum: ['approved', 'rejected'] },
        comment: { type: String, default: '' },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

tripSchema.index({ status: 1, company: 1 });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
