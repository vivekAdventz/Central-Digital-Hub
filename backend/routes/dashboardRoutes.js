/**
 * Dashboard Routes
 * -----------------
 * GET    /api/dashboards      → Get all dashboards (user sees filtered data)
 * GET    /api/dashboards/:id  → Get single dashboard
 * POST   /api/dashboards      → Create dashboard (admin only)
 * PUT    /api/dashboards/:id  → Update dashboard (admin only)
 * DELETE /api/dashboards/:id  → Delete dashboard (admin only)
 */

const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllDashboards,
  getDashboardById,
  createDashboard,
  updateDashboard,
  deleteDashboard,
} = require('../controllers/dashboardController');

// Middleware
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const handleValidation = require('../middleware/handleValidation');

// Validators
const {
  createDashboardValidator,
  updateDashboardValidator,
  dashboardIdValidator,
} = require('../validators/dashboardValidator');

// All routes below require authentication
router.use(auth);

// Get all dashboards (both user and admin can access)
router.get('/', getAllDashboards);

// Get single dashboard by ID
router.get('/:id', dashboardIdValidator, handleValidation, getDashboardById);

// Create a new dashboard (admin only)
router.post(
  '/',
  adminAuth,
  createDashboardValidator,
  handleValidation,
  createDashboard
);

// Update a dashboard (admin only)
router.put(
  '/:id',
  adminAuth,
  updateDashboardValidator,
  handleValidation,
  updateDashboard
);

// Delete a dashboard (admin only)
router.delete(
  '/:id',
  adminAuth,
  dashboardIdValidator,
  handleValidation,
  deleteDashboard
);

module.exports = router;
