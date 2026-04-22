/**
 * User Model
 * ----------
 * Stores users who are allowed to access the platform.
 * Admin adds users by name + email. Users login via Microsoft.
 * The microsoftId is populated after their first Microsoft login.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // User's display name (set by admin when adding)
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // User's email (must be unique, used to match Microsoft login)
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    // Microsoft Object ID — filled when user first logs in via Microsoft
    microsoftId: {
      type: String,
      default: null,
    },

    // Whether the user account is active
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('User', userSchema);
