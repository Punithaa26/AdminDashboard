// controllers/auth.controller.js

const { validationResult } = require("express-validator");
const users = require("../data/users");

const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({ success, message, data });
};

// POST /signup
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, "Validation failed", errors.array());
  }

  const { username, email, password, role } = req.body;

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return sendResponse(res, 409, false, "User already exists with this email");
  }

  const newUser = { username, email, password, role };
  users.push(newUser);

  return sendResponse(res, 201, true, "Signup successful", { username, role });
};

// POST /login
exports.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, "Validation failed", errors.array());
  }

  const { email, password } = req.body;

  const user = users.find((user) => user.email === email && user.password === password);
  if (!user) {
    return sendResponse(res, 401, false, "Email or password is incorrect");
  }

  return sendResponse(res, 200, true, "Login successful", { email: user.email, role: user.role });
};
