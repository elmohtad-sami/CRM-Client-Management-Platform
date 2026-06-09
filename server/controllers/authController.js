const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendVerificationEmail, sendPasswordResetEmail, generateVerificationCode } = require('../utils/emailService');

const buildUserResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  companyName: user.companyName,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage || ''
});

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env');
  }

  return jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      companyName: user.companyName
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = asyncHandler(async (req, res, next) => {
  const { fullName, companyName = '', email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Full name, email, and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  
  // Generate verification token and 6-digit code
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationCode = generateVerificationCode();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await User.create({
    fullName: String(fullName).trim(),
    companyName: String(companyName).trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'Finance',
    isVerified: false,
    verificationToken,
    verificationCode,
    verificationExpires
  });

  try {
    await sendVerificationEmail(normalizedEmail, user.fullName, verificationToken, verificationCode);
  } catch (emailError) {
    console.error('Registration: Email send failed:', emailError.message);
  }

  const token = signToken(user);
  return res.status(201).json({ 
    message: 'Registration successful.',
    token,
    user: buildUserResponse(user) 
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user);
  return res.json({ token, user: buildUserResponse(user) });
});

exports.me = asyncHandler(async (req, res, next) => {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user: buildUserResponse(user) });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user?.sub;
  const { fullName, companyName, email, profileImage } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (email) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
    if (existingUser) {
      return res.status(409).json({ message: 'Another account already uses this email' });
    }
    user.email = normalizedEmail;
  }

  if (typeof fullName === 'string') user.fullName = fullName.trim();
  if (typeof companyName === 'string') user.companyName = companyName.trim();
  if (typeof profileImage === 'string') user.profileImage = profileImage;

  await user.save();

  const token = signToken(user);
  return res.json({ token, user: buildUserResponse(user) });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user?.sub;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  return res.json({ message: 'Password updated successfully' });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Verification token or code is required' });
  }

  const user = await User.findOne({
    $or: [
      { verificationToken: token },
      { verificationCode: token }
    ],
    verificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired verification token or code' });
  }

  user.isVerified = true;
  user.verificationToken = null;
  user.verificationCode = null;
  user.verificationExpires = null;
  await user.save();

  const signedToken = signToken(user);
  return res.json({ 
    message: 'Email verified successfully!',
    token: signedToken,
    user: buildUserResponse(user) 
  });
});

exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'Email is already verified' });
  }

  // Generate new verification token and code
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationCode = generateVerificationCode();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.verificationToken = verificationToken;
  user.verificationCode = verificationCode;
  user.verificationExpires = verificationExpires;
  await user.save();

  try {
    await sendVerificationEmail(normalizedEmail, user.fullName, verificationToken, verificationCode);
    return res.json({ message: 'Verification email sent successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send verification email' });
  }
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Always return success to prevent email enumeration
  if (!user) {
    return res.json({ message: 'If that email is registered, a reset code has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetCode = generateVerificationCode();
  const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordCode = resetCode;
  user.resetPasswordExpires = resetPasswordExpires;
  await user.save();

  try {
    await sendPasswordResetEmail(normalizedEmail, user.fullName, resetToken, resetCode);
    return res.json({ message: 'If that email is registered, a reset code has been sent.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { code, newPassword } = req.body;

  if (!code || !newPassword) {
    return res.status(400).json({ message: 'Reset code and new password are required' });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  const user = await User.findOne({
    $or: [
      { resetPasswordToken: code },
      { resetPasswordCode: code }
    ],
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset code' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.resetPasswordToken = null;
  user.resetPasswordCode = null;
  user.resetPasswordExpires = null;
  await user.save();

  return res.json({ message: 'Password has been reset successfully. You can now login.' });
});