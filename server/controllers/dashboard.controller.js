// controllers/dashboardController.js
const User = require("../models/user.model");
const Activity = require("../models/activity.model");
const { DailyAnalytics, SystemHealth, RealtimeStats } = require("../models/analytics.model");
const os = require('os');

class DashboardController {
  // Get overview stats
  static async getOverviewStats(req, res) {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      // Current stats
      const [
        totalUsers,
        activeUsers,
        todayUsers,
        yesterdayUsers,
        weeklyUsers,
        onlineUsers,
        totalActivities,
        todayActivities,
      ] = await Promise.all([
        User.countDocuments({ status: 'active' }),
        User.countDocuments({ 
          status: 'active',
          lastActivity: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }),
        User.countDocuments({ 
          createdAt: { 
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) 
          }
        }),
        User.countDocuments({ 
          createdAt: { 
            $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate())
          }
        }),
        User.countDocuments({ createdAt: { $gte: lastWeek } }),
        User.countDocuments({ isOnline: true }),
        Activity.countDocuments(),
        Activity.countDocuments({ 
          createdAt: { 
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) 
          }
        }),
      ]);

      // Calculate growth percentages
      const userGrowth = yesterdayUsers > 0 
        ? ((todayUsers - yesterdayUsers) / yesterdayUsers * 100).toFixed(1)
        : todayUsers > 0 ? 100 : 0;

      // Engagement rate (active users / total users * 100)
      const engagementRate = totalUsers > 0 
        ? (activeUsers / totalUsers * 100).toFixed(1)
        : 0;

      // Mock conversion rate and bounce rate (you can implement based on your business logic)
      const conversionRate = 1247; // Replace with actual conversion tracking
      const bounceRate = 23.7; // Replace with actual bounce rate calculation

      const stats = {
        engagement: {
          title: 'Engagement Rate',
          value: `${engagementRate}%`,
          change: '+12.5%', // Calculate actual change based on historical data
          changeText: 'from last week',
          trend: 'up',
        },
        bounce: {
          title: 'Bounce Rate',
          value: `${bounceRate}%`,
          change: '+5.2%',
          changeText: 'from last week',
          trend: 'up',
        },
        conversions: {
          title: 'Conversions',
          value: conversionRate.toLocaleString(),
          change: '-15.3%',
          changeText: 'from last week',
          trend: 'down',
        },
        activeUsers: {
          title: 'Active Users',
          value: totalUsers.toLocaleString(),
          change: `+${userGrowth}%`,
          changeText: 'from yesterday',
          trend: userGrowth >= 0 ? 'up' : 'down',
        },
        additional: {
          totalUsers,
          activeUsers,
          onlineUsers,
          todayUsers,
          weeklyUsers,
          totalActivities,
          todayActivities,
        }
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch overview stats',
        error: error.message,
      });
    }
  }

  // Get recent activities
  static async getRecentActivities(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const activities = await Activity.find()
        .populate('userId', 'username email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      const formattedActivities = activities.map(activity => ({
        id: activity._id,
        emoji: DashboardController.getActivityEmoji(activity.type),
        text: activity.description,
        time: activity.timeAgo || DashboardController.formatTimeAgo(activity.createdAt),
        color: DashboardController.getActivityColor(activity.type),
        user: activity.userId?.username || 'Unknown User',
        severity: activity.severity,
      }));

      res.json({
        success: true,
        data: formattedActivities,
      });
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recent activities',
        error: error.message,
      });
    }
  }

  // Get login trends
  static async getLoginTrends(req, res) {
    try {
      const timeRange = req.query.timeRange || '24h'; // 24h, 7d, 30d
      let startDate;
      
      switch (timeRange) {
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }

      let groupBy, dateFormat;
      if (timeRange === '24h') {
        groupBy = { $hour: '$createdAt' };
        dateFormat = 'hour';
      } else if (timeRange === '7d') {
        groupBy = { $dayOfWeek: '$createdAt' };
        dateFormat = 'day';
      } else {
        groupBy = { $dayOfMonth: '$createdAt' };
        dateFormat = 'date';
      }

      const loginTrends = await Activity.aggregate([
        {
          $match: {
            type: 'login',
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: groupBy,
            logins: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Format data based on time range
      let formattedData = [];
      if (timeRange === '24h') {
        // 24-hour format
        for (let hour = 0; hour < 24; hour++) {
          const hourData = loginTrends.find(item => item._id === hour);
          formattedData.push({
            time: `${hour}:00`,
            logins: hourData ? hourData.logins : 0
          });
        }
      } else if (timeRange === '7d') {
        // Weekly format
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let day = 1; day <= 7; day++) {
          const dayData = loginTrends.find(item => item._id === day);
          formattedData.push({
            time: days[day - 1],
            logins: dayData ? dayData.logins : 0
          });
        }
      } else {
        // Monthly format
        formattedData = loginTrends.map(item => ({
          time: `Day ${item._id}`,
          logins: item.logins
        }));
      }

      res.json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      console.error('Error fetching login trends:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch login trends',
        error: error.message,
      });
    }
  }

  // Get user growth data
  static async getUserGrowth(req, res) {
    try {
      const days = parseInt(req.query.days) || 7;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const userGrowth = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            users: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      // Format data for the last 7 days
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const formattedData = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const dayData = userGrowth.find(item => 
          item._id.year === date.getFullYear() &&
          item._id.month === date.getMonth() + 1 &&
          item._id.day === date.getDate()
        );

        formattedData.push({
          day: daysOfWeek[date.getDay()],
          users: dayData ? dayData.users : 0,
          date: date.toISOString().split('T')[0]
        });
      }

      res.json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      console.error('Error fetching user growth:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user growth',
        error: error.message,
      });
    }
  }

  // Get system health
  static async getSystemHealth(req, res) {
    try {
      // Get latest system health data
      let systemHealth = await SystemHealth.findOne().sort({ timestamp: -1 });
      
      if (!systemHealth) {
        // Create initial system health data
        systemHealth = await SystemHealth.create({
          services: {
            database: { status: 'healthy', responseTime: Math.random() * 50, connections: 25 },
            api: { status: 'healthy', responseTime: Math.random() * 100, requestsPerMinute: 150 },
            storage: { status: 'healthy', usedSpace: 45, totalSpace: 100 },
            cache: { status: 'healthy', hitRate: 95, memoryUsage: 60 },
          },
          serverMetrics: {
            cpuUsage: Math.random() * 30 + 20,
            memoryUsage: Math.random() * 40 + 30,
            diskUsage: Math.random() * 50 + 25,
            loadAverage: [0.5, 0.7, 0.9],
            uptime: process.uptime(),
          }
        });
      }

      // Calculate overall health percentages
      const services = systemHealth.services;
      const healthyCount = Object.values(services).filter(service => service.status === 'healthy').length;
      const warningCount = Object.values(services).filter(service => service.status === 'warning').length;
      const errorCount = Object.values(services).filter(service => service.status === 'error').length;
      
      const totalServices = healthyCount + warningCount + errorCount;
      
      const healthData = [
        { 
          name: 'Healthy', 
          value: Math.round((healthyCount / totalServices) * 100),
          count: healthyCount 
        },
        { 
          name: 'Warnings', 
          value: Math.round((warningCount / totalServices) * 100),
          count: warningCount 
        },
        { 
          name: 'Errors', 
          value: Math.round((errorCount / totalServices) * 100),
          count: errorCount 
        },
      ];

      res.json({
        success: true,
        data: {
          health: healthData,
          services: systemHealth.services,
          serverMetrics: systemHealth.serverMetrics,
          timestamp: systemHealth.timestamp,
        },
      });
    } catch (error) {
      console.error('Error fetching system health:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch system health',
        error: error.message,
      });
    }
  }

  // Get real-time metrics
  static async getRealtimeMetrics(req, res) {
    try {
      const [
        onlineUsers,
        activeUsers,
        recentActivities,
        currentLoad
      ] = await Promise.all([
        User.countDocuments({ isOnline: true }),
        User.countDocuments({ 
          lastActivity: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
        }),
        Activity.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 60 * 1000) }
        }),
        Promise.resolve(os.loadavg()[0]) // Current system load
      ]);

      const metrics = {
        onlineUsers,
        activeUsers,
        recentActivitiesPerMinute: recentActivities,
        systemLoad: currentLoad.toFixed(2),
        timestamp: new Date(),
        serverUptime: Math.floor(process.uptime()),
        memoryUsage: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100, // MB
      };

      // Store in real-time stats for tracking
      await RealtimeStats.create({
        activeUsers: onlineUsers,
        onlineUsers: activeUsers,
        currentPageViews: recentActivities,
        apiResponseTime: Math.random() * 100,
        errorRate: Math.random() * 5,
        throughput: Math.random() * 1000,
      });

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch real-time metrics',
        error: error.message,
      });
    }
  }

  // Helper methods
  static getActivityEmoji(type) {
    const emojiMap = {
      login: '🟢',
      logout: '🔴',
      register: '✨',
      profile_update: '👤',
      password_change: '🔐',
      post_create: '📝',
      post_update: '✏️',
      post_delete: '🗑️',
      comment_create: '💬',
      like: '❤️',
      share: '📤',
      settings_change: '⚙️',
      file_upload: '📁',
      file_download: '📥',
      admin_action: '🛡️',
      system_alert: '🚨',
      error: '❌',
    };
    return emojiMap[type] || '📋';
  }

  static getActivityColor(type) {
    const colorMap = {
      login: 'text-[#39FF14]',
      logout: 'text-red-400',
      register: 'text-cyan-400',
      profile_update: 'text-blue-400',
      password_change: 'text-yellow-300',
      post_create: 'text-green-400',
      post_update: 'text-orange-400',
      post_delete: 'text-red-400',
      comment_create: 'text-purple-400',
      like: 'text-pink-400',
      share: 'text-cyan-400',
      settings_change: 'text-gray-400',
      file_upload: 'text-blue-400',
      file_download: 'text-indigo-400',
      admin_action: 'text-yellow-400',
      system_alert: 'text-red-500',
      error: 'text-red-600',
    };
    return colorMap[type] || 'text-white';
  }

  static formatTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

module.exports = DashboardController;