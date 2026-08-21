import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: { type: String, default: null },
    role: {
      type: String,
      enum: ['admin', 'manager', 'finance', 'employee'],
      default: 'employee',
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
    title: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    // Corporate profile fields used by the travel portal
    employeeId: { type: String, trim: true, default: '' },
    designation: { type: String, trim: true, default: '' },
    grade: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: '' },
    manager: { type: String, trim: true, default: '' },
    managerEmail: { type: String, trim: true, default: '' },
    costCenter: { type: String, trim: true, default: '' },
    projectCode: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
