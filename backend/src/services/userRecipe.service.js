const UserRecipe = require("../models/userRecipe.model");
const User = require("../models/user.model");

// Submit a recipe
const submitRecipe = async (data, apiKeyUser) => {
  // check if submitter email matches a registered user
  const registeredUser = await User.findOne({ email: data.submitterEmail });

  const recipe = await UserRecipe.create({
    ...data,
    submittedBy: registeredUser ? registeredUser._id : null,
    submitterEmail: data.submitterEmail,
  });

  return { recipe, isRegistered: !!registeredUser };
};

// Get recipes by email (history)
const getMyRecipes = async (userId) => {
  return await UserRecipe.find({ submittedBy: userId })
    .sort({ createdAt: -1 })
    .lean();
};

// Get by email for non-registered users
const getRecipesByEmail = async (email) => {
  return await UserRecipe.find({ submitterEmail: email })
    .sort({ createdAt: -1 })
    .lean();
};

// Admin — get all pending
const getAllForAdmin = async ({ status, page = 1, limit = 20 }) => {
  const filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [recipes, total] = await Promise.all([
    UserRecipe.find(filter)
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    UserRecipe.countDocuments(filter),
  ]);

  return {
    recipes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Admin — approve
const approveRecipe = async (id, adminId) => {
  return await UserRecipe.findByIdAndUpdate(
    id,
    {
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy: adminId,
      adminNote: "",
    },
    { new: true },
  );
};

// Admin — reject
const rejectRecipe = async (id, adminId, note = "") => {
  return await UserRecipe.findByIdAndUpdate(
    id,
    {
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy: adminId,
      adminNote: note,
    },
    { new: true },
  );
};

// Public — get approved user recipes
const getApprovedRecipes = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const [recipes, total] = await Promise.all([
    UserRecipe.find({ status: "approved" })
      .select("-adminNote -reviewedBy")
      .sort({ reviewedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    UserRecipe.countDocuments({ status: "approved" }),
  ]);
  return {
    recipes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  submitRecipe,
  getMyRecipes,
  getRecipesByEmail,
  getAllForAdmin,
  approveRecipe,
  rejectRecipe,
  getApprovedRecipes,
};
