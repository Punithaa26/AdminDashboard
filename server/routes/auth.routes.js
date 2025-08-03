// routes/auth.js
const express = require('express');
const router = express.Router();
const { AuthController, loginRateLimit, registerRateLimit } = require('../controllers/auth.controller');
const { authenticateToken, logActivity } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', registerRateLimit, AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

// Protected routes
router.use(authenticateToken); // Apply authentication to all routes below

router.post('/logout', logActivity('logout', 'User logged out'), AuthController.logout);
router.get('/profile', AuthController.getProfile);
router.put('/profile', logActivity('profile_update', 'User updated profile'), AuthController.updateProfile);
router.put('/change-password', logActivity('password_change', 'User changed password'), AuthController.changePassword);

module.exports = router;