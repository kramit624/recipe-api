const Analytics = require("../models/analytics.model");

// Log a request — called from middleware
const logRequest = async ({
  userId,
  endpoint,
  method,
  statusCode,
  rateLimited,
}) => {
  try {
    await Analytics.create({
      userId,
      endpoint,
      method,
      statusCode,
      rateLimited,
    });
  } catch (err) {
    // never crash the request if logging fails
    console.error("Analytics log error:", err.message);
  }
};

// Get full analytics for a user
const getUserAnalytics = async (userId) => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalToday,
    totalMonth,
    totalAll,
    rateLimitHits,
    topEndpoints,
    dailyTrend,
  ] = await Promise.all([
    // requests today
    Analytics.countDocuments({
      userId,
      date: { $gte: startOfToday },
    }),

    // requests this month
    Analytics.countDocuments({
      userId,
      date: { $gte: startOfMonth },
    }),

    // all time
    Analytics.countDocuments({ userId }),

    // rate limit hits this month
    Analytics.countDocuments({
      userId,
      rateLimited: true,
      date: { $gte: startOfMonth },
    }),

    // top endpoints
    Analytics.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$endpoint", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),

    // last 7 days trend
    Analytics.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    totalToday,
    totalMonth,
    totalAll,
    rateLimitHits,
    topEndpoints: topEndpoints.map((e) => ({
      endpoint: e._id,
      count: e.count,
    })),
    dailyTrend: dailyTrend.map((d) => ({ date: d._id, count: d.count })),
  };
};

module.exports = { logRequest, getUserAnalytics };
