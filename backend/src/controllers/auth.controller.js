const authService = require("../services/auth.service");
const { setTokenCookies, clearTokenCookies } = require("../utils/setCookies");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          error: "name, email and password are required",
        });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Password must be at least 6 characters",
        });
    }

    const { tokens, user } = await authService.register({
      name,
      email,
      password,
    });
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "email and password are required" });
    }

    const { tokens, user } = await authService.login({ email, password });
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "No refresh token in cookie" });
    }

    const { accessToken, refreshToken } = await authService.refresh(token);
    setTokenCookies(res, accessToken, refreshToken);

    res.json({ success: true, message: "Tokens refreshed" });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.user._id);
    clearTokenCookies(res);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

const createApiKey = async (req, res) => {
  try {
    const result = await authService.createApiKey(req.user._id);
    res.json({
      success: true,
      message: "Store this key safely. You will not be able to see it again.",
      ...result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const regenerateApiKey = async (req, res) => {
  try {
    const result = await authService.regenerateApiKey(req.user._id);
    res.json({
      success: true,
      message: "Store this key safely. You will not be able to see it again.",
      ...result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// This will delete the user account and all associated data. Use with caution.
const deleteAccount = async (req, res) => {
  try {
    await authService.deleteAccount(req.user._id);
    clearTokenCookies(res);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
