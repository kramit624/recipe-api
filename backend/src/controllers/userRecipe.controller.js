const userRecipeService = require("../services/userRecipe.service");
const User = require("../models/user.model");

// POST /api/v2/user-recipe — submit a recipe
const submitRecipe = async (req, res) => {
  try {
    const {
      submitterEmail,
      submitterName,
      title,
      baseDish,
      description,
      category,
      festival,
      country,
      city,
      cuisine,
      ingredients,
      steps,
      cookingTime,
      servings,
      difficulty,
      tags,
      image,
    } = req.body;

    // validate required fields
    if (
      !submitterEmail ||
      !submitterName ||
      !title ||
      !baseDish ||
      !category ||
      !cookingTime ||
      !servings
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    if (!ingredients?.length || !steps?.length) {
      return res
        .status(400)
        .json({ success: false, error: "Ingredients and steps are required" });
    }

    // check if email is registered
    const isRegistered = await User.findOne({ email: submitterEmail });
    if (!isRegistered) {
      return res.status(403).json({
        success: false,
        error: "NOT_REGISTERED",
        message:
          "This email is not registered on RecipeAPI. Please create an account first.",
      });
    }

    const { recipe } = await userRecipeService.submitRecipe(req.body, req.user);
    res.status(201).json({ success: true, recipe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v2/user-recipe/my — logged in user's recipes
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await userRecipeService.getMyRecipes(req.user._id);
    res.json({ success: true, count: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v2/user-recipe — all approved recipes (public)
const getApprovedRecipes = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const data = await userRecipeService.getApprovedRecipes({ page, limit });
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v2/user-recipe/admin — admin: all recipes
const adminGetAll = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const data = await userRecipeService.getAllForAdmin({
      status,
      page,
      limit,
    });
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PATCH /api/v2/user-recipe/admin/:id/approve
const adminApprove = async (req, res) => {
  try {
    const recipe = await userRecipeService.approveRecipe(
      req.params.id,
      req.user._id,
    );
    if (!recipe)
      return res
        .status(404)
        .json({ success: false, error: "Recipe not found" });
    res.json({ success: true, recipe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PATCH /api/v2/user-recipe/admin/:id/reject
const adminReject = async (req, res) => {
  try {
    const { note } = req.body;
    const recipe = await userRecipeService.rejectRecipe(
      req.params.id,
      req.user._id,
      note,
    );
    if (!recipe)
      return res
        .status(404)
        .json({ success: false, error: "Recipe not found" });
    res.json({ success: true, recipe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  submitRecipe,
  getMyRecipes,
  getApprovedRecipes,
  adminGetAll,
  adminApprove,
  adminReject,
};
