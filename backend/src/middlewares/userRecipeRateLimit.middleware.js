// 2 submissions per 60 seconds per API key
const submissionStore = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_SUBMISSIONS = 2;

const userRecipeRateLimit = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ success: false, error: "API key required" });
  }

  const now = Date.now();
  let record = submissionStore.get(apiKey);

  if (!record || now - record.windowStart >= WINDOW_MS) {
    record = { count: 1, windowStart: now };
  } else {
    record.count += 1;
  }

  submissionStore.set(apiKey, record);

  const resetIn = Math.ceil((WINDOW_MS - (now - record.windowStart)) / 1000);

  if (record.count > MAX_SUBMISSIONS) {
    return res.status(429).json({
      success: false,
      error: `You can submit max 2 recipes per minute. Try again in ${resetIn} seconds.`,
      retryAfter: resetIn,
    });
  }

  next();
};

module.exports = userRecipeRateLimit;
