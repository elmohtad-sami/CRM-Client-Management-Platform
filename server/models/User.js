const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, default: '', trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Finance', 'Analyst', 'Viewer'],
      default: 'Finance'
    },
    profileImage: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);