/**
 * Auth Validators
 * ----------------
 * Validation rules for authentication routes.
 * Uses express-validator for input sanitization and validation.
 */

const { body } = require('express-validator');

// Validation for admin login: POST /api/admin/login
const adminLoginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Validation for Microsoft login: POST /api/auth/microsoft
const microsoftLoginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('microsoftId')
    .trim()
    .notEmpty()
    .withMessage('Microsoft ID is required'),
];

module.exports = { adminLoginValidator, microsoftLoginValidator };
