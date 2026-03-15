const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");

// ── Static routes first (must come before /:id) ──────────────────────────────
router.get("/search", recipeController.searchRecipes);
router.get("/random", recipeController.getRandomRecipes);
router.get("/base/:dish", recipeController.getByBaseDish);
router.get("/category/:category", recipeController.getByCategory);
router.get("/festival/:festival", recipeController.getByFestival);
router.get("/country/:country/cities", recipeController.getCitiesByCountry);
router.get("/country/:country/city", recipeController.getByCityInCountry);
router.get("/country/:country", recipeController.getByCountry);
router.get("/slug/:slug", recipeController.getBySlug);

// ── Root + dynamic ────────────────────────────────────────────────────────────
router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getById);

module.exports = router;
