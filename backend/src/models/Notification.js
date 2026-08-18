import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['approval', 'pending', 'rejected', 'ticket', 'policy', 'cancelled', 'report', 'claim'],
      default: 'pending',
    },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    text: { type: String, trim: true, default: '' },
    link: { type: String, trim: true, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
