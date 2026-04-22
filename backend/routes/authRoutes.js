/**
 * Auth Routes
 * ------------
 * POST /api/auth/microsoft  → Microsoft login for users
 * POST /api/admin/login      → Admin login with env credentials
 * GET  /api/auth/me          → Get current authenticated user info
 */

const express = require('express');
const router = express.Router();

// Controllers
const { microsoftLogin, adminLogin, getMe } = require('../controllers/authController');

// Middleware
const auth = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const handleValidation = require('../middleware/handleValidation');

// Validators
const { microsoftLoginValidator, adminLoginValidator } = require('../validators/authValidator');

// Microsoft login (for regular users)
router.post(
  '/auth/microsoft',
  loginLimiter,
  microsoftLoginValidator,
  handleValidation,
  microsoftLogin
);

// Admin login (email + password from .env)
router.post(
  '/admin/login',
  loginLimiter,
  adminLoginValidator,
  handleValidation,
  adminLogin
);

// Get current user info (requires JWT)
router.get('/auth/me', auth, getMe);

module.exports = router;
