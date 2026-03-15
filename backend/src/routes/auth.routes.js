const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  getMe,
  createApiKey,
  regenerateApiKey,
  deleteAccount,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/create-api-key", protect, createApiKey);
router.post("/regenerate-key", protect, regenerateApiKey);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
