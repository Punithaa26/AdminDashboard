// routes/dashboard.js
const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all dashboard routes
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard overview stats
router.get('/stats/overview', DashboardController.getOverviewStats);

// Recent activities
router.get('/activities/recent', DashboardController.getRecentActivities);

// Login trends
router.get('/analytics/login-trends', DashboardController.getLoginTrends);

// User growth data
router.get('/analytics/user-growth', DashboardController.getUserGrowth);

// System health
router.get('/system/health', DashboardController.getSystemHealth);

// Real-time metrics
router.get('/realtime/metrics', DashboardController.getRealtimeMetrics);

module.exports = router;