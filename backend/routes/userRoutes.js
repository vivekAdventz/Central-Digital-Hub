/**
 * User Routes
 * ------------
 * All routes here are admin-only (require auth + adminAuth middleware).
 *
 * GET    /api/users                  → Get all users
 * POST   /api/users                  → Add a new user
 * DELETE /api/users/:id              → Delete a user
 * PATCH  /api/users/:id/toggle-active → Toggle user active status
 */

const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllUsers,
  createUser,
  deleteUser,
  toggleUserActive,
} = require('../controllers/userController');

// Middleware
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const handleValidation = require('../middleware/handleValidation');

// Validators
const { createUserValidator, userIdValidator } = require('../validators/userValidator');

// All routes below require admin authentication
router.use(auth);
router.use(adminAuth);

// Get all users
router.get('/', getAllUsers);

// Add a new user (admin enters name + email)
router.post('/', createUserValidator, handleValidation, createUser);

// Delete a user
router.delete('/:id', userIdValidator, handleValidation, deleteUser);

// Toggle user active/inactive status
router.patch('/:id/toggle-active', userIdValidator, handleValidation, toggleUserActive);

module.exports = router;
