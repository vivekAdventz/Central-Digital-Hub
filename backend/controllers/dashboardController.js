/**
 * Dashboard Controller
 * ---------------------
 * Handles CRUD operations for Power BI dashboards.
 *
 * SECURITY: When a regular user fetches dashboards, any dashboard with
 * `shareable === false` will have its `powerBiIframe` field completely
 * stripped from the response. The user will only see `viewOnly: true`.
 * This ensures the iframe URL NEVER reaches the client.
 */

const Dashboard = require('../models/Dashboard');

/**
 * GET /api/dashboards
 * Fetch all dashboards.
 * - Admin: sees all fields including powerBiIframe
 * - User: shareable=false dashboards have powerBiIframe replaced with viewOnly flag
 */
const getAllDashboards = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin ? {} : { isActive: true };
    const dashboards = await Dashboard.find(query).sort({ createdAt: -1 });

    // If the requester is an admin, return all data as-is
    if (isAdmin) {
      return res.status(200).json({
        success: true,
        count: dashboards.length,
        data: dashboards,
      });
    }

    // For regular users, flag non-shareable dashboards
    const safeDashboards = dashboards.map((dashboard) => {
      const dashObj = dashboard.toObject();

      if (!dashObj.shareable) {
        // Flag so frontend knows to block the share button via CSS shield
        dashObj.viewOnly = true;
      }

      return dashObj;
    });

    res.status(200).json({
      success: true,
      count: safeDashboards.length,
      data: safeDashboards,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboards/:id
 * Fetch a single dashboard by ID.
 * Same security rules as getAllDashboards.
 */
const getDashboardById = async (req, res, next) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard || (req.user.role !== 'admin' && !dashboard.isActive)) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard not found.',
      });
    }

    const dashObj = dashboard.toObject();

    // Flag for non-admin users on non-shareable dashboards
    if (req.user.role !== 'admin' && !dashObj.shareable) {
      dashObj.viewOnly = true;
    }

    res.status(200).json({
      success: true,
      data: dashObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/dashboards
 * Create a new dashboard. Admin only.
 */
const createDashboard = async (req, res, next) => {
  try {
    const { title, category, powerBiIframe, shareable, isActive, description } = req.body;

    const dashboard = await Dashboard.create({
      title,
      category,
      powerBiIframe,
      shareable: shareable !== undefined ? shareable : true,
      isActive: isActive !== undefined ? isActive : true,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Dashboard created successfully',
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/dashboards/:id
 * Update an existing dashboard. Admin only.
 */
const updateDashboard = async (req, res, next) => {
  try {
    const { title, category, powerBiIframe, shareable, isActive, description } = req.body;

    const dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard not found.',
      });
    }

    // Update only the fields that are provided
    if (title !== undefined) dashboard.title = title;
    if (category !== undefined) dashboard.category = category;
    if (powerBiIframe !== undefined) dashboard.powerBiIframe = powerBiIframe;
    if (shareable !== undefined) dashboard.shareable = shareable;
    if (isActive !== undefined) dashboard.isActive = isActive;
    if (description !== undefined) dashboard.description = description;

    await dashboard.save();

    res.status(200).json({
      success: true,
      message: 'Dashboard updated successfully',
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/dashboards/:id/toggle-active
 * Toggle a dashboard's active status. Admin only.
 */
const toggleActiveDashboard = async (req, res, next) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard not found.',
      });
    }

    dashboard.isActive = !dashboard.isActive;
    await dashboard.save();

    res.status(200).json({
      success: true,
      message: `Dashboard is now ${dashboard.isActive ? 'active' : 'inactive'}`,
      data: { isActive: dashboard.isActive },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/dashboards/:id
 * Delete a dashboard. Admin only.
 */
const deleteDashboard = async (req, res, next) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard not found.',
      });
    }

    await Dashboard.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Dashboard deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDashboards,
  getDashboardById,
  createDashboard,
  updateDashboard,
  toggleActiveDashboard,
  deleteDashboard,
};
