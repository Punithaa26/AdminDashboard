// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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

    role: {
      type: String,
      enum: ["admin","user"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    lastLogin: {
      type: Date,
    },

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
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
