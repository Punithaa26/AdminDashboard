// routes/settings.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const settingsController = require('../controllers/settings.controller');

// All routes require authentication
router.use(authenticateToken);

// Account info routes
router.get('/account', settingsController.getAccountInfo);
router.put('/account', settingsController.updateAccountInfo);

// Password routes
router.put('/password', settingsController.changePassword);

// Notification preferences routes
router.put('/notifications', settingsController.updateNotificationPreferences);

// Device management routes
router.get('/devices', settingsController.getDevices);
router.delete('/devices/:sessionId', settingsController.removeDevice);
router.post('/devices/logout-others', settingsController.logoutFromOtherDevices);

module.exports = router;