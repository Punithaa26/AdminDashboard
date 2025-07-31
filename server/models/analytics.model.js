// models/Analytics.js
const mongoose = require("mongoose");

// Daily Analytics Schema
const dailyAnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  metrics: {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    totalLogins: { type: Number, default: 0 },
    uniqueLogins: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    uniquePageViews: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    errors: { type: Number, default: 0 },
    apiCalls: { type: Number, default: 0 },
  },
  hourlyBreakdown: [{
    hour: { type: Number, min: 0, max: 23 },
    logins: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
  }],
}, {
  timestamps: true,
});

// System Health Schema
const systemHealthSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  services: {
    database: {
      status: { type: String, enum: ['healthy', 'warning', 'error'], default: 'healthy' },
      responseTime: { type: Number, default: 0 },
      connections: { type: Number, default: 0 },
    },
    api: {
      status: { type: String, enum: ['healthy', 'warning', 'error'], default: 'healthy' },
      responseTime: { type: Number, default: 0 },
      requestsPerMinute: { type: Number, default: 0 },
    },
    storage: {
      status: { type: String, enum: ['healthy', 'warning', 'error'], default: 'healthy' },
      usedSpace: { type: Number, default: 0 },
      totalSpace: { type: Number, default: 0 },
    },
    cache: {
      status: { type: String, enum: ['healthy', 'warning', 'error'], default: 'healthy' },
      hitRate: { type: Number, default: 0 },
      memoryUsage: { type: Number, default: 0 },
    },
  },
  serverMetrics: {
    cpuUsage: { type: Number, default: 0 },
    memoryUsage: { type: Number, default: 0 },
    diskUsage: { type: Number, default: 0 },
    loadAverage: [Number],
    uptime: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

// Real-time Stats Schema (for current session data)
const realtimeStatsSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 3600, // Auto-delete after 1 hour
  },
  activeUsers: { type: Number, default: 0 },
  onlineUsers: { type: Number, default: 0 },
  currentPageViews: { type: Number, default: 0 },
  apiResponseTime: { type: Number, default: 0 },
  errorRate: { type: Number, default: 0 },
  throughput: { type: Number, default: 0 },
});

// Indexes
dailyAnalyticsSchema.index({ date: -1 });
systemHealthSchema.index({ timestamp: -1 });
realtimeStatsSchema.index({ timestamp: -1 });

const DailyAnalytics = mongoose.model("DailyAnalytics", dailyAnalyticsSchema);
const SystemHealth = mongoose.model("SystemHealth", systemHealthSchema);
const RealtimeStats = mongoose.model("RealtimeStats", realtimeStatsSchema);

module.exports = {
  DailyAnalytics,
  SystemHealth,
  RealtimeStats,
};