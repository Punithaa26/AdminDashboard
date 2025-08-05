// models/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: function() {
        // Generate random avatar from unsplash
        const photos = [
          "https://images.unsplash.com/photo-1494790108755-2616b332c2cd?w=40&h=40&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face"
        ];
        return photos[Math.floor(Math.random() * photos.length)];
      }
    },

    // Role and Status
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    // Activity Tracking
    lastActive: {
      type: String,
      default: function() {
        return this.formatLastActive(new Date());
      }
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },

    // Device and Location Info
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
      ip: String,
    },
    location: {
      country: String,
      city: String,
      timezone: String,
    },

    // User Preferences
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      language: {
        type: String,
        default: "en",
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },

    // Additional Metadata
    metadata: {
      registrationSource: {
        type: String,
        enum: ["web", "mobile", "api"],
        default: "web",
      },
      referralCode: String,
      totalSessions: { type: Number, default: 0 },
      totalTimeSpent: { type: Number, default: 0 }, // in minutes
    },

    // Security
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Generate unique ID before saving
userSchema.pre('save', function(next) {
  if (!this.id) {
    // Generate ID like #001, #002, etc.
    User.countDocuments({})
      .then(count => {
        this.id = `#${String(count + 1).padStart(3, '0')}`;
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

// Method to format last active time
userSchema.methods.formatLastActive = function(date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInMinutes < 5) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

// Update last active when user activity is tracked
userSchema.methods.updateLastActive = function() {
  this.lastActivity = new Date();
  this.lastActive = this.formatLastActive(new Date());
  return this.save();
};

// Virtual for user activity status
userSchema.virtual('activityStatus').get(function() {
  if (!this.lastActivity) return 'inactive';
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.lastActivity > fiveMinutesAgo ? 'active' : 'inactive';
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ isOnline: 1 });
userSchema.index({ id: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;