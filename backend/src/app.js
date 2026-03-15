require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middlewares/errorHandler");
const recipeRoutes = require("./routes/recipe.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const authRoutes = require("./routes/auth.routes");
const { validateApiKey } = require("./middlewares/auth.middleware");
const userRecipeRoutes = require("./routes/userRecipe.routes");
const rateLimiter = require("./middlewares/rateLimiter.middleware");

const app = express();

// Middlewares
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN || "*",
    methods: "GET,POST,PUT,DELETE, PATCH",
    allowedHeaders: "Content-Type,x-api-key",
    credentials: true,
  }
));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RecipeAPI is running 🍽️",
    version: "1.0.0",
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recipes", validateApiKey, rateLimiter, recipeRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v2/user-recipe", userRecipeRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
