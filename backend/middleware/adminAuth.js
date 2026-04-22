/**
 * Admin Authentication Middleware
 * --------------------------------
 * Must be used AFTER the auth middleware.
 * Checks that the authenticated user has role === 'admin'.
 * Blocks access if the user is not an admin.
 */

const adminAuth = (req, res, next) => {
  try {
    // req.user is set by the auth middleware
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during admin authorization.',
    });
  }
};

module.exports = adminAuth;
