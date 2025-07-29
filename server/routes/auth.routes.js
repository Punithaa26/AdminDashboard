// routes/auth.routes.js

const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// SIGNUP VALIDATION
const signupValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .matches(/^[a-zA-Z0-9.%+-]+@gmail\.com$/)
    .withMessage("Only valid Gmail addresses are allowed")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage("Password must include both letters and numbers"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "user"])
    .withMessage("Role must be admin or user")
];

// LOGIN VALIDATION
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .matches(/^[a-zA-Z0-9.%+-]+@gmail\.com$/)
    .withMessage("Only valid Gmail addresses are allowed")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage("Password must include both letters and numbers")
];

// Routes
router.post("/signup", signupValidation, authController.signup);
router.post("/login", loginValidation, authController.login);

module.exports = router;
