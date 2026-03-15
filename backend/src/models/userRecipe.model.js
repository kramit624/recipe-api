const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    instruction: { type: String, required: true },
  },
  { _id: false },
);

const userRecipeSchema = new mongoose.Schema(
  {
    // submitter info
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null if not a registered user
    },
    submitterEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    submitterName: { type: String, required: true, trim: true },

    // recipe data
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    baseDish: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
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
      required: true,
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
    cookingTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    image: { type: String, default: "" },
    imageSource: { type: String, default: "user-submitted" },

    // admin review
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    adminNote: { type: String, default: "" }, // reason for rejection
    reviewedAt: { type: Date, default: null },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// auto generate slug
userRecipeSchema.pre("save", async function () {
  if (!this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() +
      "-" +
      Date.now();
  }
  ;
});

userRecipeSchema.index({ submittedBy: 1, status: 1 });
userRecipeSchema.index({ submitterEmail: 1 });

module.exports = mongoose.model("UserRecipe", userRecipeSchema);
