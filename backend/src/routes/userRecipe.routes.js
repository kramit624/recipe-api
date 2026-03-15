const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userRecipe.controller");
const { validateApiKey, protect } = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");
const userRecipeRateLimit = require("../middlewares/userRecipeRateLimit.middleware");

// Public — approved recipes (needs API key)
router.get("/", validateApiKey, ctrl.getApprovedRecipes);

// Submit recipe (needs API key + rate limit)
router.post("/", validateApiKey, userRecipeRateLimit, ctrl.submitRecipe);

// Logged in user — their own recipes
router.get("/my", protect, ctrl.getMyRecipes);

// Admin routes
router.get("/admin", protect, isAdmin, ctrl.adminGetAll);
router.patch("/admin/:id/approve", protect, isAdmin, ctrl.adminApprove);
router.patch("/admin/:id/reject", protect, isAdmin, ctrl.adminReject);

module.exports = router;
