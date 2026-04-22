/**
 * Validation Result Handler
 * --------------------------
 * Middleware that checks express-validator results.
 * If there are validation errors, returns a 400 response.
 * Use this AFTER validator arrays in route definitions.
 */

const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = handleValidation;
