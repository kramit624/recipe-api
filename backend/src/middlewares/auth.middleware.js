const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user.model");

// Protect routes — reads accessToken from cookie
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken",
    );
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired access token" });
  }
};

// Validate API key — reads x-api-key from header
const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res
        .status(401)
        .json({
          success: false,
          error: "API key required. Pass it as x-api-key header",
        });
    }

    const hashed = crypto.createHash("sha256").update(apiKey).digest("hex");
    const user = await User.findOne({ apiKey: hashed }).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid API key" });
    }
    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, error: "Your account is disabled" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { protect, validateApiKey };
