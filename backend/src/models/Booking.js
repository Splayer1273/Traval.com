import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['flight', 'hotel', 'cab', 'train', 'other'],
      required: [true, 'Booking type is required'],
    },
    provider: { type: String, required: [true, 'Provider is required'], trim: true },
    reference: { type: String, trim: true, default: '' },
    cost: { type: Number, required: [true, 'Cost is required'], min: 0 },
    currency: { type: String, default: 'USD', trim: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'confirmed' },
  },
  { timestamps: true }
);

bookingSchema.index({ trip: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
