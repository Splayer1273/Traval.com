import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    category: {
      type: String,
      enum: ['transport', 'lodging', 'meals', 'other'],
      default: 'other',
      required: [true, 'Category is required'],
    },
    amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
    currency: { type: String, default: 'USD', trim: true },
    description: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    reviewNote: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
