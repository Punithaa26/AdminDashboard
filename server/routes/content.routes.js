// routes/content.routes.js
const express = require("express");
const { body, query, param } = require("express-validator");
const ContentController = require("../controllers/content.controller");
const {
  authenticateToken,
  requireAdmin,
  logActivity,
  createRateLimit,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Rate limiting for content endpoints
const contentRateLimit = createRateLimit(
  1 * 60 * 1000, // 1 minute
  1000, // 50 requests per minute
  "Too many content requests"
);

// Validation middlewares
const validateContentCreation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters")
    .trim(),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters")
    .trim(),
  body("type")
    .isIn(["Article", "Video", "Document", "Image"])
    .withMessage("Invalid content type"),
  body("status")
    .optional()
    .isIn(["Published", "Pending", "Rejected", "Draft"])
    .withMessage("Invalid status"),
  body("category")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters")
    .trim(),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters")
    .trim(),
  body("content")
    .optional()
    .isLength({ max: 50000 })
    .withMessage("Content cannot exceed 50,000 characters"),
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),
  body("visibility")
    .optional()
    .isIn(["public", "private", "restricted"])
    .withMessage("Invalid visibility option"),
];

const validateContentUpdate = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters")
    .trim(),
  body("description")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters")
    .trim(),
  body("type")
    .optional()
    .isIn(["Article", "Video", "Document", "Image"])
    .withMessage("Invalid content type"),
  body("status")
    .optional()
    .isIn(["Published", "Pending", "Rejected", "Draft"])
    .withMessage("Invalid status"),
  body("category")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters")
    .trim(),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters")
    .trim(),
  body("content")
    .optional()
    .isLength({ max: 50000 })
    .withMessage("Content cannot exceed 50,000 characters"),
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),
  body("visibility")
    .optional()
    .isIn(["public", "private", "restricted"])
    .withMessage("Invalid visibility option"),
];

const validateBulkAction = [
  body("contentIds")
    .isArray({ min: 1 })
    .withMessage("Content IDs array is required and must not be empty"),
  body("contentIds.*")
    .isMongoId()
    .withMessage("Invalid content ID format"),
  body("action")
    .isIn([
      "publish",
      "unpublish",
      "approve",
      "reject",
      "feature",
      "unfeature",
      "delete",
      "update_category",
    ])
    .withMessage("Invalid bulk action"),
  body("data")
    .optional()
    .isObject()
    .withMessage("Data must be an object"),
  body("data.category")
    .if(body("action").equals("update_category"))
    .notEmpty()
    .withMessage("Category is required for update_category action"),
];

const validateQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sortBy")
    .optional()
    .isIn([
      "createdAt",
      "updatedAt",
      "title",
      "views",
      "likes",
      "shares",
      "comments",
    ])
    .withMessage("Invalid sort field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
  query("status")
    .optional()
    .isIn(["Published", "Pending", "Rejected", "Draft"])
    .withMessage("Invalid status filter"),
  query("type")
    .optional()
    .isIn(["Article", "Video", "Document", "Image"])
    .withMessage("Invalid type filter"),
  query("featured")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Featured must be true or false"),
];

const validateSearchQuery = [
  query("q")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters")
    .trim(),
  query("minViews")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum views must be a non-negative integer"),
  query("maxViews")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Maximum views must be a non-negative integer"),
  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for dateFrom"),
  query("dateTo")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for dateTo"),
  query("sortBy")
    .optional()
    .isIn([
      "relevance",
      "newest",
      "oldest",
      "mostViewed",
      "mostLiked",
      "alphabetical",
    ])
    .withMessage("Invalid sort option"),
];

const validateEngagement = [
  body("action")
    .isIn(["like", "share", "comment"])
    .withMessage("Invalid engagement action"),
];

const validateId = [
  param("id").isMongoId().withMessage("Invalid content ID format"),
];

// Apply middleware to all routes
router.use(authenticateToken);
router.use(contentRateLimit);

// Public content routes (authenticated users)
router.get(
  "/",
  validateQuery,
  ContentController.getAllContent
);

router.get(
  "/search",
  validateSearchQuery,
  ContentController.searchContent
);

router.get(
  "/categories",
  ContentController.getCategories
);

router.get(
  "/tags",
  ContentController.getTags
);

router.get(
  "/stats",
  requireAdmin,
  ContentController.getContentStats
);

router.get(
  "/analytics",
  requireAdmin,
  query("timeRange")
    .optional()
    .isIn(["24h", "7d", "30d", "90d"])
    .withMessage("Invalid time range"),
  ContentController.getContentAnalytics
);

router.get(
  "/deleted",
  requireAdmin,
  validateQuery,
  ContentController.getDeletedContent
);

router.get(
  "/:id",
  validateId,
  ContentController.getContentById
);

// Content creation and modification
router.post(
  "/",
  validateContentCreation,
  logActivity("post_create", "User created new content"),
  ContentController.createContent
);

router.put(
  "/:id",
  validateId,
  validateContentUpdate,
  logActivity("post_update", "User updated content"),
  ContentController.updateContent
);

router.delete(
  "/:id",
  validateId,
  query("permanent")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Permanent must be true or false"),
  logActivity("post_delete", "User deleted content"),
  ContentController.deleteContent
);

router.patch(
  "/:id/restore",
  validateId,
  logActivity("post_update", "User restored content"),
  ContentController.restoreContent
);

// Engagement endpoints
router.patch(
  "/:id/engagement",
  validateId,
  validateEngagement,
  ContentController.updateEngagement
);

// Bulk operations (admin or content owner only)
router.post(
  "/bulk-action",
  validateBulkAction,
  logActivity("admin_action", "User performed bulk content action"),
  ContentController.bulkContentAction
);

// Content management specific routes for admin dashboard
router.get(
  "/dashboard/overview",
  requireAdmin,
  async (req, res) => {
    try {
      const stats = await ContentController.getContentStats(req, res);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard overview",
        error: error.message,
      });
    }
  }
);

// Health check for content service
router.get("/health/check", (req, res) => {
  res.json({
    success: true,
    message: "Content service is healthy",
    timestamp: new Date(),
    endpoints: {
      getAll: "GET /api/content",
      getById: "GET /api/content/:id",
      create: "POST /api/content",
      update: "PUT /api/content/:id",
      delete: "DELETE /api/content/:id",
      search: "GET /api/content/search",
      stats: "GET /api/content/stats",
      bulkAction: "POST /api/content/bulk-action",
      categories: "GET /api/content/categories",
      tags: "GET /api/content/tags",
    },
  });
});

// Error handling middleware for content routes
router.use((error, req, res, next) => {
  console.error("Content route error:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate content error",
      field: Object.keys(error.keyPattern)[0],
    });
  }

  res.status(500).json({
    success: false,
    message: "Content service error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

module.exports = router;