// controllers/settings.controller.js
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');

// Get account information
const getAccountInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        preferences: user.preferences || {
          notifications: {
            appNotifications: true,
            emailAlerts: false,
            systemWarnings: true,
            weeklySummary: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Get account info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch account information'
    });
  }
};

// Update account information
const updateAccountInfo = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username and email are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if username/email already exists (excluding current user)
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username ? 'Username already exists' : 'Email already exists'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    // Log the activity
    await Activity.create({
      userId: req.user._id,
      type: 'profile_update',
      description: `Updated account information`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Account information updated successfully',
      data: {
        username: updatedUser.username,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Update account info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update account information'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(req.user._id, {
      password: hashedNewPassword
    });

    // Log the activity
    await Activity.create({
      userId: req.user._id,
      type: 'password_change',
      description: `Changed password`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// Update notification preferences
const updateNotificationPreferences = async (req, res) => {
  try {
    const { appNotifications, emailAlerts, systemWarnings, weeklySummary } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Preserve existing preferences and update notifications
    const updatedPreferences = {
      ...user.preferences,
      notifications: {
        appNotifications: Boolean(appNotifications),
        emailAlerts: Boolean(emailAlerts),
        systemWarnings: Boolean(systemWarnings),
        weeklySummary: Boolean(weeklySummary)
      }
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: updatedPreferences },
      { new: true, runValidators: true }
    ).select('preferences');

    // Log the activity
    await Activity.create({
      userId: req.user._id,
      type: 'preferences_update',
      description: `Updated notification preferences`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: updatedUser.preferences.notifications
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences'
    });
  }
};

// Get user devices (mock data since we don't track sessions in DB)
const getDevices = async (req, res) => {
  try {
    // In a real application, you would track sessions in the database
    // For now, we'll return mock data with the current session
    const devices = [
      {
        id: 'current-session',
        name: getDeviceName(req.get('User-Agent')),
        type: getDeviceType(req.get('User-Agent')),
        lastActive: 'Just now',
        current: true,
        ip: req.ip || req.connection.remoteAddress
      }
    ];

    res.json({
      success: true,
      data: devices
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch devices'
    });
  }
};

// Remove a device (mock implementation)
const removeDevice = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (sessionId === 'current-session') {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove current session'
      });
    }

    // Log the activity
    await Activity.create({
      userId: req.user._id,
      type: 'device_removed',
      description: `Removed device session`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      metadata: { sessionId }
    });

    res.json({
      success: true,
      message: 'Device removed successfully'
    });
  } catch (error) {
    console.error('Remove device error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove device'
    });
  }
};

// Logout from other devices
const logoutFromOtherDevices = async (req, res) => {
  try {
    // In a real implementation, you would:
    // 1. Invalidate all sessions except current one
    // 2. Update session tokens in database
    // 3. Force logout on other devices via WebSocket
    
    // Log the activity
    await Activity.create({
      userId: req.user._id,
      type: 'logout_other_devices',
      description: `Logged out from other devices`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Successfully logged out from other devices'
    });
  } catch (error) {
    console.error('Logout other devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout from other devices'
    });
  }
};

// Helper functions
const getDeviceName = (userAgent) => {
  if (!userAgent) return 'Unknown Device';
  
  if (userAgent.includes('Windows')) return 'Windows Desktop';
  if (userAgent.includes('Macintosh')) return 'MacBook';
  if (userAgent.includes('iPhone')) return 'iPhone';
  if (userAgent.includes('iPad')) return 'iPad';
  if (userAgent.includes('Android')) return 'Android Device';
  if (userAgent.includes('Linux')) return 'Linux Desktop';
  
  return 'Unknown Device';
};

const getDeviceType = (userAgent) => {
  if (!userAgent) return 'desktop';
  
  if (userAgent.includes('iPhone') || userAgent.includes('Android')) return 'mobile';
  if (userAgent.includes('iPad')) return 'tablet';
  
  return 'desktop';
};

module.exports = {
  getAccountInfo,
  updateAccountInfo,
  changePassword,
  updateNotificationPreferences,
  getDevices,
  removeDevice,
  logoutFromOtherDevices
};