const analyticsService = require("../services/analytics.service");

const getAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getUserAnalytics(req.user._id);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAnalytics };
