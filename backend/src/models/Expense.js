import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    // Denormalized trip context so claims lists never need a trip lookup
    tripRef: { type: String, trim: true, default: '' },
    tripTitle: { type: String, trim: true, default: '' },
    tripDestination: { type: String, trim: true, default: '' },
    category: {
      type: String,
      enum: ['flight', 'lodging', 'meals', 'transport', 'misc', 'other'],
      default: 'misc',
      required: [true, 'Category is required'],
    },
    amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
    currency: { type: String, default: 'INR', trim: true },
    spentOn: { type: Date, default: null },
    merchant: { type: String, trim: true, default: '' },
    receipts: { type: Number, default: 0, min: 0 },
    description: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'reimbursed'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    reviewNote: { type: String, trim: true, default: '' },
    reimbursedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

expenseSchema.index({ company: 1, status: 1 });
expenseSchema.index({ employee: 1, createdAt: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
