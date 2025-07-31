// services/websocketService.js
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');
const { RealtimeStats } = require('../models/analytics.model');

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws',
      verifyClient: this.verifyClient.bind(this)
    });
    
    this.clients = new Map(); // userId -> Set of WebSocket connections
    this.adminClients = new Set(); // Admin WebSocket connections
    
    this.init();
  }

  async verifyClient(info) {
    try {
      const url = new URL(info.req.url, 'http://localhost');
      const token = url.searchParams.get('token');
      
      if (!token) {
        return false;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user || user.status !== 'active') {
        return false;
      }

      info.req.user = user;
      return true;
    } catch (error) {
      console.error('WebSocket verification error:', error);
      return false;
    }
  }

  init() {
    this.wss.on('connection', (ws, req) => {
      const user = req.user;
      console.log(`WebSocket connected: ${user.username} (${user._id})`);

      // Store connection
      if (!this.clients.has(user._id.toString())) {
        this.clients.set(user._id.toString(), new Set());
      }
      this.clients.get(user._id.toString()).add(ws);

      // Store admin connections separately
      if (user.role === 'admin') {
        this.adminClients.add(ws);
      }

      // Update user online status
      this.updateUserOnlineStatus(user._id, true);

      // Send initial data
      this.sendToClient(ws, 'connected', {
        message: 'Connected to real-time updates',
        userId: user._id,
        timestamp: new Date()
      });

      // Handle incoming messages
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data);
          await this.handleMessage(ws, user, message);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        console.log(`WebSocket disconnected: ${user.username}`);
        
        // Remove from clients
        const userConnections = this.clients.get(user._id.toString());
        if (userConnections) {
          userConnections.delete(ws);
          if (userConnections.size === 0) {
            this.clients.delete(user._id.toString());
            this.updateUserOnlineStatus(user._id, false);
          }
        }

        // Remove from admin clients
        this.adminClients.delete(ws);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // Start real-time data broadcasting
    this.startRealtimeBroadcast();
  }

  async handleMessage(ws, user, message) {
    const { type, data } = message;

    switch (type) {
      case 'ping':
        this.sendToClient(ws, 'pong', { timestamp: new Date() });
        break;

      case 'subscribe':
        // Subscribe to specific events
        ws.subscriptions = ws.subscriptions || new Set();
        if (data.events) {
          data.events.forEach(event => ws.subscriptions.add(event));
        }
        break;

      case 'unsubscribe':
        // Unsubscribe from events
        if (ws.subscriptions && data.events) {
          data.events.forEach(event => ws.subscriptions.delete(event));
        }
        break;

      case 'request_data':
        // Send specific data on request
        await this.handleDataRequest(ws, user, data);
        break;

      default:
        console.log(`Unknown message type: ${type}`);
    }
  }

  async handleDataRequest(ws, user, data) {
    const { dataType } = data;

    try {
      switch (dataType) {
        case 'dashboard_stats':
          if (user.role === 'admin') {
            const stats = await this.getDashboardStats();
            this.sendToClient(ws, 'dashboard_stats', stats);
          }
          break;

        case 'user_activities':
          const activities = await Activity.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
          this.sendToClient(ws, 'user_activities', activities);
          break;
      }
    } catch (error) {
      console.error('Data request error:', error);
      this.sendToClient(ws, 'error', { message: 'Failed to fetch data' });
    }
  }

  async updateUserOnlineStatus(userId, isOnline) {
    try {
      await User.findByIdAndUpdate(userId, {
        isOnline,
        lastActivity: new Date()
      });

      // Broadcast user status change to admins
      this.broadcastToAdmins('user_status_change', {
        userId,
        isOnline,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error updating user online status:', error);
    }
  }

  startRealtimeBroadcast() {
    // Broadcast dashboard updates every 30 seconds
    setInterval(async () => {
      try {
        const dashboardData = await this.getDashboardStats();
        this.broadcastToAdmins('dashboard_update', dashboardData);
      } catch (error) {
        console.error('Broadcast error:', error);
      }
    }, 30000);

    // Broadcast system metrics every 10 seconds
    setInterval(async () => {
      try {
        const metrics = await this.getSystemMetrics();
        this.broadcastToAdmins('system_metrics', metrics);
      } catch (error) {
        console.error('System metrics broadcast error:', error);
      }
    }, 10000);

    // Broadcast online users count every 5 seconds
    setInterval(async () => {
      try {
        const onlineCount = await User.countDocuments({ isOnline: true });
        const activeCount = await User.countDocuments({
          lastActivity: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
        });

        this.broadcastToAdmins('user_counts', {
          online: onlineCount,
          active: activeCount,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('User counts broadcast error:', error);
      }
    }, 5000);
  }

  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      onlineUsers,
      todayActivities,
      recentActivities
    ] = await Promise.all([
      User.countDocuments({ status: 'active' }),
      User.countDocuments({
        lastActivity: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      User.countDocuments({ isOnline: true }),
      Activity.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
      }),
      Activity.find()
        .populate('userId', 'username')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    return {
      totalUsers,
      activeUsers,
      onlineUsers,
      todayActivities,
      recentActivities: recentActivities.map(activity => ({
        id: activity._id,
        description: activity.description,
        user: activity.userId?.username || 'Unknown',
        time: this.formatTimeAgo(activity.createdAt),
        type: activity.type
      }))
    };
  }

  async getSystemMetrics() {
    const process = require('process');
    const os = require('os');

    return {
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(os.totalmem() / 1024 / 1024),
        percentage: Math.round((process.memoryUsage().heapUsed / os.totalmem()) * 100)
      },
      cpu: {
        loadAverage: os.loadavg(),
        usage: Math.round(Math.random() * 50 + 20) // Mock CPU usage
      },
      uptime: Math.floor(process.uptime()),
      timestamp: new Date()
    };
  }

  // Broadcasting methods
  sendToClient(ws, type, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, data, timestamp: new Date() }));
    }
  }

  broadcastToAdmins(type, data) {
    this.adminClients.forEach(ws => {
      this.sendToClient(ws, type, data);
    });
  }

  broadcastToUser(userId, type, data) {
    const userConnections = this.clients.get(userId.toString());
    if (userConnections) {
      userConnections.forEach(ws => {
        this.sendToClient(ws, type, data);
      });
    }
  }

  broadcastToAll(type, data) {
    this.wss.clients.forEach(ws => {
      this.sendToClient(ws, type, data);
    });
  }

  // Activity broadcasting
  async broadcastActivity(activity) {
    const populatedActivity = await Activity.findById(activity._id)
      .populate('userId', 'username')
      .lean();

    const formattedActivity = {
      id: populatedActivity._id,
      emoji: this.getActivityEmoji(populatedActivity.type),
      text: populatedActivity.description,
      time: this.formatTimeAgo(populatedActivity.createdAt),
      user: populatedActivity.userId?.username || 'Unknown User',
      type: populatedActivity.type
    };

    this.broadcastToAdmins('new_activity', formattedActivity);
  }

  // Helper methods
  getActivityEmoji(type) {
    const emojiMap = {
      login: '🟢',
      logout: '🔴',
      register: '✨',
      profile_update: '👤',
      password_change: '🔐',
      post_create: '📝',
      admin_action: '🛡️',
      system_alert: '🚨',
      error: '❌',
    };
    return emojiMap[type] || '📋';
  }

  formatTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  }

  // Get connection stats
  getConnectionStats() {
    return {
      totalConnections: this.wss.clients.size,
      adminConnections: this.adminClients.size,
      userConnections: this.clients.size,
      uniqueUsers: Array.from(this.clients.keys()).length
    };
  }
}

module.exports = WebSocketService;