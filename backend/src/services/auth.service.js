const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model");
const generateApiKey = require("../utils/generateApiKey");
const generateTokens = require("../utils/generateTokens");

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const { accessToken, refreshToken } = generateTokens(user._id);

  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefresh;
  await user.save();

  return {
    tokens: { accessToken, refreshToken },
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      apiKey: null,
      tier: user.tier,
    },
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const { accessToken, refreshToken } = generateTokens(user._id);

  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefresh;
  await user.save();

  return {
    tokens: { accessToken, refreshToken },
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      tier: user.tier,
    },
  };
};

const refresh = async (token) => {
  if (!token) throw new Error("Refresh token required");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshToken) throw new Error("Refresh token not found");

  const isMatch = await bcrypt.compare(token, user.refreshToken);
  if (!isMatch) throw new Error("Refresh token mismatch");

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    user._id,
  );

  const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);
  user.refreshToken = hashedRefresh;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const getMe = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -refreshToken")
    .lean();
  if (!user) throw new Error("User not found");
  return user;
};

const createApiKey = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const { raw, hashed } = generateApiKey();
  user.apiKey = hashed;
  await user.save();

  return { apiKey: raw };
};

const regenerateApiKey = async (userId) => {
  return await createApiKey(userId);
};

const deleteAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  await User.findByIdAndDelete(userId);
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  createApiKey,
  regenerateApiKey,
  deleteAccount,
};
