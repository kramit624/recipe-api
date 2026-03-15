const crypto = require("crypto");
const User = require("../models/user.model");
const { logRequest } = require("../services/analytics.service");

const requestStore = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

const rateLimiter = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      return res
        .status(401)
        .json({ success: false, error: "API key required" });
    }

    const hashed = crypto.createHash("sha256").update(apiKey).digest("hex");
    const now = Date.now();

    let record = requestStore.get(hashed);
    if (!record || now - record.windowStart >= WINDOW_MS) {
      record = { count: 1, windowStart: now };
    } else {
      record.count += 1;
    }
    requestStore.set(hashed, record);

    const remaining = MAX_REQUESTS - record.count;
    const resetIn = Math.ceil((WINDOW_MS - (now - record.windowStart)) / 1000);

    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, remaining));
    res.setHeader("X-RateLimit-Reset", resetIn);

    // Normalize endpoint — strip query params and IDs
    const rawPath = req.path;
    const endpoint = rawPath
      .replace(/\/[a-f0-9]{24}/gi, "/:id") // mongo ids
      .replace(/\?.*$/, ""); // query strings

    if (record.count > MAX_REQUESTS) {
      // log rate limit hit
      if (req.user) {
        await logRequest({
          userId: req.user._id,
          endpoint,
          method: req.method,
          statusCode: 429,
          rateLimited: true,
        });
      }
      return res.status(429).json({
        success: false,
        error: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
        retryAfter: resetIn,
      });
    }

    // attach log call to res.on("finish") so we capture real status code
    res.on("finish", () => {
      if (req.user) {
        logRequest({
          userId: req.user._id,
          endpoint,
          method: req.method,
          statusCode: res.statusCode,
          rateLimited: false,
        });
      }
    });

    next();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = rateLimiter;
