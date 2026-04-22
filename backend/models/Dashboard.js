/**
 * Dashboard Model
 * ---------------
 * Stores Power BI dashboard configurations.
 * Key field: `shareable` — if false, the iframe URL is NEVER sent to regular users.
 */

const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema(
  {
    // Dashboard display title
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    // Category/department grouping (e.g., "Sales & Distribution", "Operations")
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },

    // Power BI iframe embed code or URL
    // SECURITY: This field is stripped from the response for non-admin users
    //           when shareable is false
    powerBiIframe: {
      type: String,
      required: [true, 'Power BI iframe is required'],
    },

    // Controls whether the iframe URL is visible to regular users
    shareable: {
      type: Boolean,
      default: true,
    },

    // Controls whether the report is visible to users at all
    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional description shown below the dashboard title
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Dashboard', dashboardSchema);
