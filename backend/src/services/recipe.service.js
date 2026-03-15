const Recipe = require("../models/recipe.model");
const NodeCache = require("node-cache");

// TTL = 5 minutes, check expired every 2 minutes
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

// Helper to build cache key
const key = (...args) => args.join(":");

// Get all recipes with pagination
const getAllRecipes = async ({ page = 1, limit = 20 }) => {
  const cacheKey = key("all", page, limit);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const skip = (page - 1) * limit;
  const [recipes, total] = await Promise.all([
    Recipe.find().skip(skip).limit(limit).lean(),
    Recipe.countDocuments(),
  ]);

  const result = {
    recipes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  cache.set(cacheKey, result);
  return result;
};

// Full text search
const searchRecipes = async ({ q, page = 1, limit = 20 }) => {
  const cacheKey = key("search", q, page, limit);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const skip = (page - 1) * limit;
  const filter = { $text: { $search: q } };
  const [recipes, total] = await Promise.all([
    Recipe.find(filter).skip(skip).limit(limit).lean(),
    Recipe.countDocuments(filter),
  ]);

  const result = {
    recipes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  cache.set(cacheKey, result);
  return result;
};

// Get by baseDish
const getByBaseDish = async (dish) => {
  const cacheKey = key("base", dish.toLowerCase());
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const recipes = await Recipe.find({
    baseDish: { $regex: dish, $options: "i" },
  }).lean();

  const result = { recipes };
  cache.set(cacheKey, result);
  return result;
};

// Generic field filter (category, festival, country)
const getByField = async (field, value, { page = 1, limit = 20 }) => {
  const cacheKey = key("field", field, value.toLowerCase(), page, limit);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const skip = (page - 1) * limit;
  const filter = { [field]: { $regex: value, $options: "i" } };
  const [recipes, total] = await Promise.all([
    Recipe.find(filter).skip(skip).limit(limit).lean(),
    Recipe.countDocuments(filter),
  ]);

  const result = {
    recipes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  cache.set(cacheKey, result);
  return result;
};

// Get distinct cities by country
const getCitiesByCountry = async (country) => {
  const cacheKey = key("cities", country.toLowerCase());
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const cities = await Recipe.distinct("city", {
    country: { $regex: country, $options: "i" },
  });

  const result = cities.filter(Boolean);
  cache.set(cacheKey, result);
  return result;
};

// Get recipes by city within a country
const getByCityInCountry = async (country, city, { page = 1, limit = 20 }) => {
  const cacheKey = key(
    "city",
    country.toLowerCase(),
    city.toLowerCase(),
    page,
    limit,
  );
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const skip = (page - 1) * limit;
  const filter = {
    country: { $regex: country, $options: "i" },
    city: { $regex: city, $options: "i" },
  };

  const [recipes, total] = await Promise.all([
    Recipe.find(filter).skip(skip).limit(limit).lean(),
    Recipe.countDocuments(filter),
  ]);

  const result = {
    recipes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  cache.set(cacheKey, result);
  return result;
};

// Get random recipes — intentionally NOT cached (random should always be fresh)
const getRandomRecipes = async (count = 5) => {
  return await Recipe.aggregate([{ $sample: { size: count } }]);
};

// Get by slug
const getBySlug = async (slug) => {
  const cacheKey = key("slug", slug);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const recipe = await Recipe.findOne({ slug }).lean();
  if (recipe) cache.set(cacheKey, recipe);
  return recipe;
};

// Get by ID
const getById = async (id) => {
  const cacheKey = key("id", id);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const recipe = await Recipe.findById(id).lean();
  if (recipe) cache.set(cacheKey, recipe);
  return recipe;
};

module.exports = {
  getAllRecipes,
  searchRecipes,
  getByBaseDish,
  getByField,
  getCitiesByCountry,
  getByCityInCountry,
  getRandomRecipes,
  getBySlug,
  getById,
};
