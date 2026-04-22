/**
 * User Validators
 * ----------------
 * Validation rules for user management (admin-only operations).
 */

const { body, param } = require('express-validator');

// Validation for creating a user: POST /api/users
const createUserValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

// Validation for user ID param
const userIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),
];

module.exports = { createUserValidator, userIdValidator };
