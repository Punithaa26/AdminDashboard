// models/content.model.js
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["Article", "Video", "Document", "Image"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Published", "Pending", "Rejected", "Draft"],
      default: "Draft",
    },
    content: {
      type: String, // Main content body
      default: "",
    },
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    publishedAt: {
      type: Date,
    },
    scheduledAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    metadata: {
      fileSize: Number,
      fileName: String,
      fileUrl: String,
      thumbnailUrl: String,
      duration: Number, // for videos in seconds
      wordCount: Number, // for articles
      readTime: Number, // estimated read time in minutes
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      slug: {
        type: String,
        unique: true,
        sparse: true,
      },
    },
    visibility: {
      type: String,
      enum: ["public", "private", "restricted"],
      default: "public",
    },
    version: {
      type: Number,
      default: 1,
    },
    analytics: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      engagementRate: { type: Number, default: 0 },
      bounceRate: { type: Number, default: 0 },
      avgTimeSpent: { type: Number, default: 0 },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
contentSchema.index({ status: 1, createdAt: -1 });
contentSchema.index({ type: 1, createdAt: -1 });
contentSchema.index({ createdBy: 1, createdAt: -1 });
contentSchema.index({ title: "text", description: "text" });
contentSchema.index({ category: 1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ featured: 1 });
contentSchema.index({ publishedAt: -1 });
contentSchema.index({ "seo.slug": 1 });
contentSchema.index({ isDeleted: 1 });

// Virtual for time ago
contentSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diffInMs = now - this.updatedAt;
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  return `${months} month${months > 1 ? "s" : ""} ago`;
});

// Virtual for engagement score
contentSchema.virtual("engagementScore").get(function () {
  if (this.views === 0) return 0;
  const engagement = (this.likes + this.shares + this.comments) / this.views;
  return Math.round(engagement * 100 * 100) / 100; // Round to 2 decimal places
});

// Pre-save middleware
contentSchema.pre("save", function (next) {
  // Auto-generate slug if not provided
  if (!this.seo.slug && this.title) {
    this.seo.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Set published date when status changes to Published
  if (this.status === "Published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Calculate word count and read time for articles
  if (this.type === "Article" && this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.metadata.wordCount = wordCount;
    this.metadata.readTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
  }

  next();
});

// Pre-find middleware to exclude deleted content by default
contentSchema.pre(/^find/, function (next) {
  // Only exclude deleted content if not explicitly querying for deleted items
  if (!this.getQuery().isDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Static methods
contentSchema.statics.getContentStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalContent: { $sum: 1 },
        published: {
          $sum: { $cond: [{ $eq: ["$status", "Published"] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
        },
        rejected: {
          $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
        },
        draft: {
          $sum: { $cond: [{ $eq: ["$status", "Draft"] }, 1, 0] },
        },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: "$likes" },
        totalShares: { $sum: "$shares" },
        totalComments: { $sum: "$comments" },
      },
    },
  ]);

  return stats[0] || {
    totalContent: 0,
    published: 0,
    pending: 0,
    rejected: 0,
    draft: 0,
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0,
  };
};

contentSchema.statics.getContentByType = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        published: {
          $sum: { $cond: [{ $eq: ["$status", "Published"] }, 1, 0] },
        },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

contentSchema.statics.getTrendingContent = async function (limit = 10) {
  return await this.find({ status: "Published" })
    .sort({ views: -1, likes: -1, createdAt: -1 })
    .limit(limit)
    .populate("createdBy", "username email profilePicture")
    .lean();
};

// Instance methods
contentSchema.methods.incrementViews = function () {
  this.views += 1;
  this.analytics.impressions += 1;
  return this.save();
};

contentSchema.methods.updateEngagement = function (action, count = 1) {
  switch (action) {
    case "like":
      this.likes += count;
      break;
    case "share":
      this.shares += count;
      break;
    case "comment":
      this.comments += count;
      break;
  }

  // Update engagement rate
  if (this.views > 0) {
    this.analytics.engagementRate =
      ((this.likes + this.shares + this.comments) / this.views) * 100;
  }

  return this.save();
};

contentSchema.methods.softDelete = function (deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

contentSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

module.exports = mongoose.model("Content", contentSchema);