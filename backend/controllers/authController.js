/**
 * Auth Controller
 * ----------------
 * Handles authentication for both regular users (Microsoft login)
 * and admin (email + password from .env).
 *
 * Flow:
 *  - Users: Frontend sends Microsoft account info → backend checks if email
 *    exists in User collection → returns JWT with role='user'
 *  - Admin: Frontend sends email + password → backend matches against .env → returns JWT with role='admin'
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate a JWT token
 * @param {Object} payload - Data to encode in the token
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * POST /api/auth/microsoft
 * Handles Microsoft login for regular users.
 * Expects: { email, name, microsoftId } from the frontend after MSAL authentication.
 */
const microsoftLogin = async (req, res, next) => {
  try {
    const { email, name, microsoftId } = req.body;

    // Check if this user's email exists in the database (admin must add them first)
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Your email is not registered. Contact your administrator.',
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact your administrator.',
      });
    }

    // Update Microsoft ID if not set yet (first login)
    if (!user.microsoftId) {
      user.microsoftId = microsoftId;
      user.name = name; // Update name from Microsoft account
      await user.save();
    }

    // Generate JWT token with user role
    const token = generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      role: 'user',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'user',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/login
 * Handles admin login using email + password from environment variables.
 */
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Compare against environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
    }

    // Generate JWT token with admin role
    const token = generateToken({
      id: 'admin',
      email: adminEmail,
      name: 'System Administrator',
      role: 'admin',
    });

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        user: {
          id: 'admin',
          name: 'System Administrator',
          email: adminEmail,
          role: 'admin',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Returns the current authenticated user's info from the JWT token.
 * Requires auth middleware to be applied first.
 */
const getMe = async (req, res, next) => {
  try {
    // If admin, return admin info from token
    if (req.user.role === 'admin') {
      return res.status(200).json({
        success: true,
        data: {
          id: 'admin',
          name: req.user.name,
          email: req.user.email,
          role: 'admin',
        },
      });
    }

    // If regular user, fetch fresh data from DB
    const user = await User.findById(req.user.id).select('-microsoftId');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'user',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { microsoftLogin, adminLogin, getMe };
