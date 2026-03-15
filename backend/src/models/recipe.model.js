const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    instruction: { type: String, required: true },
  },
  { _id: false },
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    baseDish: { type: String, required: true, lowercase: true, trim: true },

    category: {
      type: String,
      enum: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snack",
        "Lunch/Dinner",
        "Street Food",
        "Dessert",
        "Festival",
        "Healthy",
      ],
      default: null,
    },
    festival: {
      type: String,
      enum: [
        "Diwali",
        "Holi",
        "Eid",
        "Navratri",
        "Christmas",
        "Ramadan",
        "Pongal",
        "Baisakhi",
        "None",
      ],
      default: "None",
    },

    country: { type: String, trim: true, default: "India" },
    city: { type: String, trim: true, default: "" },
    cuisine: { type: String, trim: true, default: "Indian" },

    ingredients: [{ type: String, trim: true }],
    steps: [stepSchema],

    image: { type: String, default: "" },
    imageSource: {
      type: String,
      enum: ["freepik", "unsplash", "pexels", "none"],
      default: "none",
    },

    tags: [{ type: String, lowercase: true, trim: true }],
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    cookingTime: { type: Number, default: 30 }, // stored as number (minutes)
    servings: { type: Number, default: 4 },
    source: { type: String, default: "ai-generated" },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

recipeSchema.index({ baseDish: 1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ festival: 1 });
recipeSchema.index({ country: 1 });
recipeSchema.index({ city: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ title: "text", baseDish: "text", tags: "text" });

module.exports = mongoose.model("Recipe", recipeSchema);
