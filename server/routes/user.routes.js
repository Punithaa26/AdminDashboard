// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Activity = require('../models/activity.model');
const { authenticateToken, requireAdmin, logActivity } = require('../middlewares/auth.middleware');

// Apply authentication to all routes
router.use(authenticateToken);

// Get all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const role = req.query.role || '';

    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) filter.status = status;
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    // Add activity counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [activityCount, lastActivity] = await Promise.all([
          Activity.countDocuments({ userId: user._id }),
          Activity.findOne({ userId: user._id }).sort({ createdAt: -1 }).select('createdAt type')
        ]);

        return {
          ...user,
          activityCount,
          lastActivityType: lastActivity?.type,
          lastActivityTime: lastActivity?.createdAt
        };
      })
    );

    res.json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Get user by ID (admin only)
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user activities
    const activities = await Activity.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('type description createdAt metadata')
      .lean();

    // Get user statistics
    const stats = await Activity.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const userDetails = {
      ...user,
      activities,
      statistics: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      totalActivities: activities.length
    };

    res.json({
      success: true,
      data: userDetails
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// Update user (admin only)
router.put('/:id', requireAdmin, logActivity('admin_action', 'Admin updated user'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const user = await User.findByIdAndUpdate(
      id,
      { ...updates, lastActivity: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: 'admin_action',
      description: `Admin ${req.user.username} updated user ${user.username}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: {
        targetUserId: id,
        updatedFields: Object.keys(updates)
      },
      severity: 'medium'
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// Delete user (admin only)
router.delete('/:id', requireAdmin, logActivity('admin_action', 'Admin deleted user'), async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete yourself'
      });
    }

    let user;
    if (permanent === 'true') {
      // Permanently delete user
      user = await User.findByIdAndDelete(id);
      // Also delete user activities
      await Activity.deleteMany({ userId: id });
    } else {
      // Soft delete (mark as deleted)
      user = await User.findByIdAndUpdate(
        id,
        { status: 'deleted', isOnline: false },
        { new: true }
      ).select('-password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: 'admin_action',
      description: `Admin ${req.user.username} ${permanent === 'true' ? 'permanently deleted' : 'deleted'} user ${user.username}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: {
        targetUserId: id,
        permanent: permanent === 'true'
      },
      severity: 'high'
    });

    res.json({
      success: true,
      message: `User ${permanent === 'true' ? 'permanently deleted' : 'deleted'} successfully`
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// Bulk user actions (admin only)
router.post('/bulk-action', requireAdmin, logActivity('admin_action', 'Admin performed bulk action'), async (req, res) => {
  try {
    const { userIds, action, data = {} } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    if (!action) {
      return res.status(400).json({
        success: false,
        message: 'Action is required'
      });
    }

    let updateData = {};
    let actionDescription = '';

    switch (action) {
      case 'activate':
        updateData = { status: 'active' };
        actionDescription = 'activated';
        break;
      case 'suspend':
        updateData = { status: 'suspended', isOnline: false };
        actionDescription = 'suspended';
        break;
      case 'delete':
        updateData = { status: 'deleted', isOnline: false };
        actionDescription = 'deleted';
        break;
      case 'update_role':
        if (!data.role || !['user', 'admin'].includes(data.role)) {
          return res.status(400).json({
            success: false,
            message: 'Valid role is required'
          });
        }
        updateData = { role: data.role };
        actionDescription = `role updated to ${data.role}`;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    // Prevent admin from affecting themselves
    const filteredUserIds = userIds.filter(id => id !== req.user._id.toString());

    const result = await User.updateMany(
      { _id: { $in: filteredUserIds } },
      updateData
    );

    // Log bulk action
    await Activity.create({
      userId: req.user._id,
      type: 'admin_action',
      description: `Admin ${req.user.username} ${actionDescription} ${result.modifiedCount} users`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: {
        action,
        targetUserIds: filteredUserIds,
        affectedCount: result.modifiedCount,
        updateData
      },
      severity: 'high'
    });

    res.json({
      success: true,
      message: `Bulk action completed: ${result.modifiedCount} users ${actionDescription}`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk action',
      error: error.message
    });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      adminUsers,
      todayRegistrations,
      onlineUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'suspended' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      User.countDocuments({ isOnline: true })
    ]);

    // Registration trends (last 7 days)
    const registrationTrends = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          suspendedUsers,
          adminUsers,
          todayRegistrations,
          onlineUsers
        },
        registrationTrends
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
});

module.exports = router;