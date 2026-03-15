const recipeService = require("../services/recipe.service");

// GET /api/recipes
const getAllRecipes = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await recipeService.getAllRecipes({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/search?q=pasta
const searchRecipes = async (req, res) => {
  try {
    const { q, page, limit } = req.query;
    if (!q?.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Query param 'q' is required" });
    }
    const result = await recipeService.searchRecipes({
      q: q.trim(),
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json({ success: true, query: q.trim(), ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/base/:dish
const getByBaseDish = async (req, res) => {
  try {
    const result = await recipeService.getByBaseDish(req.params.dish);
    res.json({ success: true, count: result.recipes.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/category/:category
const getByCategory = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await recipeService.getByField(
      "category",
      req.params.category,
      {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      },
    );
    res.json({ success: true, category: req.params.category, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/festival/:festival
const getByFestival = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await recipeService.getByField(
      "festival",
      req.params.festival,
      {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      },
    );
    res.json({ success: true, festival: req.params.festival, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/country/:country
const getByCountry = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await recipeService.getByField(
      "country",
      req.params.country,
      {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      },
    );
    res.json({ success: true, country: req.params.country, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/country/:country/cities
const getCitiesByCountry = async (req, res) => {
  try {
    const cities = await recipeService.getCitiesByCountry(req.params.country);
    res.json({ success: true, country: req.params.country, cities });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/country/:country/city?q=delhi
const getByCityInCountry = async (req, res) => {
  try {
    const { q, page, limit } = req.query;
    if (!q?.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Query param 'q' is required" });
    }
    const result = await recipeService.getByCityInCountry(
      req.params.country,
      q.trim(),
      {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      },
    );
    res.json({
      success: true,
      country: req.params.country,
      city: q.trim(),
      ...result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/random
const getRandomRecipes = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const data = await recipeService.getRandomRecipes(count);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/slug/:slug
const getBySlug = async (req, res) => {
  try {
    const recipe = await recipeService.getBySlug(req.params.slug);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, error: "Recipe not found" });
    }
    res.json({ success: true, data: recipe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/recipes/:id
const getById = async (req, res) => {
  try {
    const recipe = await recipeService.getById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, error: "Recipe not found" });
    }
    res.json({ success: true, data: recipe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllRecipes,
  searchRecipes,
  getByBaseDish,
  getByCategory,
  getByFestival,
  getByCountry,
  getCitiesByCountry,
  getByCityInCountry,
  getRandomRecipes,
  getBySlug,
  getById,
};
