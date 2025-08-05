// controllers/content.controller.js
const Content = require("../models/content.model");
const User = require("../models/user.model");
const Activity = require("../models/activity.model");
const { validationResult } = require("express-validator");

// Get all content with filtering, searching, and pagination
const getAllContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const type = req.query.type || "";
    const category = req.query.category || "";
    const createdBy = req.query.createdBy || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const featured = req.query.featured;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (createdBy) filter.createdBy = createdBy;
    if (featured !== undefined) filter.featured = featured === "true";

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const [content, total] = await Promise.all([
      Content.find(filter)
        .populate("createdBy", "username email profilePicture")
        .populate("lastModifiedBy", "username email")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(filter),
    ]);

    // Add additional computed fields
    const enrichedContent = content.map((item) => ({
      ...item,
      id: `#${item._id.toString().slice(-3).toUpperCase()}`,
      createdOn: new Date(item.createdAt).toISOString().split("T")[0],
      lastModified: item.timeAgo,
      createdBy: {
        name: item.createdBy?.username || "Unknown User",
        avatar:
          item.createdBy?.profilePicture ||
          `https://images.unsplash.com/photo-1494790108755-2616b332c2cd?w=40&h=40&fit=crop&crop=face`,
      },
    }));

    res.json({
      success: true,
      data: {
        content: enrichedContent,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Get all content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get content by ID
const getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id)
      .populate("createdBy", "username email profilePicture")
      .populate("lastModifiedBy", "username email profilePicture")
      .lean();

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Increment view count
    await Content.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get content by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Create new content
const createContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const contentData = {
      ...req.body,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id,
    };

    const content = new Content(contentData);
    await content.save();

    await content.populate("createdBy", "username email profilePicture");

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: "post_create",
      description: `Created new ${content.type.toLowerCase()}: ${
        content.title
      }`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
      metadata: {
        contentId: content._id,
        contentType: content.type,
        contentTitle: content.title,
      },
      severity: "low",
    });

    res.status(201).json({
      success: true,
      message: "Content created successfully",
      data: content,
    });
  } catch (error) {
    console.error("Create content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update content
const updateContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updates = {
      ...req.body,
      lastModifiedBy: req.user._id,
    };

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;
    delete updates.createdBy;

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Check permissions (only creator or admin can update)
    if (
      content.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own content",
      });
    }

    // Increment version number
    updates.version = content.version + 1;

    const updatedContent = await Content.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy lastModifiedBy", "username email profilePicture");

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: "post_update",
      description: `Updated ${content.type.toLowerCase()}: ${content.title}`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
      metadata: {
        contentId: content._id,
        contentType: content.type,
        contentTitle: content.title,
        updatedFields: Object.keys(req.body),
      },
      severity: "low",
    });

    res.json({
      success: true,
      message: "Content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete content (soft delete)
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Check permissions
    if (
      content.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own content",
      });
    }

    let result;
    if (permanent === "true" && req.user.role === "admin") {
      // Permanent delete (admin only)
      result = await Content.findByIdAndDelete(id);
    } else {
      // Soft delete
      result = await content.softDelete(req.user._id);
    }

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: "post_delete",
      description: `${
        permanent === "true" ? "Permanently deleted" : "Deleted"
      } ${content.type.toLowerCase()}: ${content.title}`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
      metadata: {
        contentId: content._id,
        contentType: content.type,
        contentTitle: content.title,
        permanent: permanent === "true",
      },
      severity: permanent === "true" ? "high" : "medium",
    });

    res.json({
      success: true,
      message: `Content ${
        permanent === "true" ? "permanently deleted" : "deleted"
      } successfully`,
    });
  } catch (error) {
    console.error("Delete content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Restore deleted content
const restoreContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id);

    if (!content || !content.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Deleted content not found",
      });
    }

    // Check permissions
    if (
      content.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only restore your own content",
      });
    }

    await content.restore();

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: "post_update",
      description: `Restored ${content.type.toLowerCase()}: ${content.title}`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
      metadata: {
        contentId: content._id,
        contentType: content.type,
        contentTitle: content.title,
      },
      severity: "medium",
    });

    res.json({
      success: true,
      message: "Content restored successfully",
      data: content,
    });
  } catch (error) {
    console.error("Restore content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to restore content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get deleted content (admin only)
const getDeletedContent = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [deletedContent, total] = await Promise.all([
      Content.find({ isDeleted: true })
        .populate("createdBy deletedBy", "username email")
        .sort({ deletedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments({ isDeleted: true }),
    ]);

    res.json({
      success: true,
      data: {
        content: deletedContent,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Get deleted content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch deleted content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Bulk operations
const bulkContentAction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { contentIds, action, data = {} } = req.body;

    if (!contentIds || !Array.isArray(contentIds) || contentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content IDs array is required",
      });
    }

    // Get content to check permissions
    const contents = await Content.find({ _id: { $in: contentIds } });
    const allowedIds = contents
      .filter(
        (content) =>
          content.createdBy.toString() === req.user._id.toString() ||
          req.user.role === "admin"
      )
      .map((content) => content._id);

    if (allowedIds.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No content found that you have permission to modify",
      });
    }

    let updateData = {};
    let actionDescription = "";

    switch (action) {
      case "publish":
        updateData = { status: "Published", publishedAt: new Date() };
        actionDescription = "published";
        break;
      case "unpublish":
        updateData = { status: "Draft" };
        actionDescription = "unpublished";
        break;
      case "approve":
        updateData = { status: "Published", publishedAt: new Date() };
        actionDescription = "approved";
        break;
      case "reject":
        updateData = { status: "Rejected" };
        actionDescription = "rejected";
        break;
      case "feature":
        updateData = { featured: true };
        actionDescription = "featured";
        break;
      case "unfeature":
        updateData = { featured: false };
        actionDescription = "unfeatured";
        break;
      case "delete":
        updateData = {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: req.user._id,
        };
        actionDescription = "deleted";
        break;
      case "update_category":
        if (!data.category) {
          return res.status(400).json({
            success: false,
            message: "Category is required for update_category action",
          });
        }
        updateData = { category: data.category };
        actionDescription = `category updated to ${data.category}`;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid action",
        });
    }

    const result = await Content.updateMany(
      { _id: { $in: allowedIds } },
      { ...updateData, lastModifiedBy: req.user._id }
    );

    // Log bulk action
    await Activity.create({
      userId: req.user._id,
      type: "admin_action",
      description: `Bulk action: ${actionDescription} ${result.modifiedCount} content items`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
      metadata: {
        action,
        contentIds: allowedIds,
        affectedCount: result.modifiedCount,
        updateData,
      },
      severity: "medium",
    });

    res.json({
      success: true,
      message: `Bulk action completed: ${result.modifiedCount} content items ${actionDescription}`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
        requestedCount: contentIds.length,
        allowedCount: allowedIds.length,
      },
    });
  } catch (error) {
    console.error("Bulk content action error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to perform bulk action",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update content engagement
const updateEngagement = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!["like", "share", "comment"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid engagement action",
      });
    }

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    await content.updateEngagement(action);

    res.json({
      success: true,
      message: `${action} updated successfully`,
      data: {
        views: content.views,
        likes: content.likes,
        shares: content.shares,
        comments: content.comments,
        engagementScore: content.engagementScore,
      },
    });
  } catch (error) {
    console.error("Update engagement error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update engagement",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Search content with advanced filters
const searchContent = async (req, res) => {
  try {
    const {
      q = "",
      type,
      status,
      category,
      tags,
      dateFrom,
      dateTo,
      minViews,
      maxViews,
      featured,
      sortBy = "relevance",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};
    const sort = {};

    // Text search
    if (q) {
      filter.$text = { $search: q };
      if (sortBy === "relevance") {
        sort.score = { $meta: "textScore" };
      }
    }

    // Filters
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === "true";

    // Tags filter
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Views range filter
    if (minViews || maxViews) {
      filter.views = {};
      if (minViews) filter.views.$gte = parseInt(minViews);
      if (maxViews) filter.views.$lte = parseInt(maxViews);
    }

    // Sorting
    if (sortBy !== "relevance") {
      switch (sortBy) {
        case "newest":
          sort.createdAt = -1;
          break;
        case "oldest":
          sort.createdAt = 1;
          break;
        case "mostViewed":
          sort.views = -1;
          break;
        case "mostLiked":
          sort.likes = -1;
          break;
        case "alphabetical":
          sort.title = 1;
          break;
        default:
          sort.createdAt = -1;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [results, total] = await Promise.all([
      Content.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "username email profilePicture")
        .lean(),
      Content.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        results,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
        searchQuery: q,
        filtersApplied: { type, status, category, tags, dateFrom, dateTo },
      },
    });
  } catch (error) {
    console.error("Search content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get content categories
const getCategories = async (req, res) => {
  try {
    const categories = await Content.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ["$status", "Published"] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get content tags
const getTags = async (req, res) => {
  try {
    const tags = await Content.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tags",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get content statistics
const getContentStats = async (req, res) => {
  try {
    const [
      generalStats,
      typeStats,
      recentContent,
      topPerforming,
      statusDistribution,
      categoryStats,
    ] = await Promise.all([
      Content.getContentStats(),
      Content.getContentByType(),
      Content.find({ status: "Published" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("createdBy", "username")
        .lean(),
      Content.getTrendingContent(5),
      Content.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Content.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            published: {
              $sum: { $cond: [{ $eq: ["$status", "Published"] }, 1, 0] },
            },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        overview: generalStats,
        byType: typeStats,
        byStatus: statusDistribution,
        byCategory: categoryStats,
        recent: recentContent,
        trending: topPerforming,
      },
    });
  } catch (error) {
    console.error("Get content stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get content analytics
const getContentAnalytics = async (req, res) => {
  try {
    const { timeRange = "7d", contentId } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (timeRange) {
      case "24h":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        };
        break;
      case "7d":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      case "30d":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
        break;
      case "90d":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        };
        break;
    }

    if (contentId) {
      dateFilter._id = contentId;
    }

    const analytics = await Content.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalContent: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
          totalShares: { $sum: "$shares" },
          totalComments: { $sum: "$comments" },
          avgEngagement: { $avg: "$analytics.engagementRate" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get content analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content analytics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  restoreContent,
  getDeletedContent,
  bulkContentAction,
  updateEngagement,
  searchContent,
  getCategories,
  getTags,
  getContentStats,
  getContentAnalytics,
};
