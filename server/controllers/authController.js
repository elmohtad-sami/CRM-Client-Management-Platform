const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

exports.register = async (req, res, next) => {
  try {
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
    const user = await User.create({
      fullName: String(fullName).trim(),
      companyName: String(companyName).trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'Finance'
    });

    const token = signToken(user);
    return res.status(201).json({ token, user: buildUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: buildUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};