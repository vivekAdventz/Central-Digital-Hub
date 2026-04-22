/**
 * User Controller
 * ----------------
 * Handles user management operations (admin-only).
 * Admin can:
 *  - View all users
 *  - Add a new user (by name + email)
 *  - Delete a user
 *  - Toggle user active status
 */

const User = require('../models/User');

/**
 * GET /api/users
 * Fetch all registered users. Admin only.
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-microsoftId') // Don't expose Microsoft ID
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 * Add a new user by name and email. Admin only.
 * The user can then login via Microsoft using this email.
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Remove a user from the system. Admin only.
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/toggle-active
 * Toggle a user's active status. Admin only.
 */
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, createUser, deleteUser, toggleUserActive };
