/**
 * Dashboard Validators
 * ---------------------
 * Validation rules for dashboard CRUD operations.
 */

const { body, param } = require('express-validator');

// Validation for creating a dashboard: POST /api/dashboards
const createDashboardValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters'),

  body('powerBiIframe')
    .trim()
    .notEmpty()
    .withMessage('Power BI iframe is required'),

  body('shareable')
    .optional()
    .isBoolean()
    .withMessage('Shareable must be a boolean (true or false)'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

// Validation for updating a dashboard: PUT /api/dashboards/:id
const updateDashboardValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid dashboard ID format'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters'),

  body('powerBiIframe')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Power BI iframe cannot be empty'),

  body('shareable')
    .optional()
    .isBoolean()
    .withMessage('Shareable must be a boolean (true or false)'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

// Validation for dashboard ID param
const dashboardIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid dashboard ID format'),
];

module.exports = {
  createDashboardValidator,
  updateDashboardValidator,
  dashboardIdValidator,
};
