import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Company name is required'], unique: true, trim: true },
    industry: { type: String, trim: true, default: '' },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Company = mongoose.model('Company', companySchema);
export default Company;
