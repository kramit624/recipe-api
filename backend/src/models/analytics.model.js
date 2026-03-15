const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  endpoint: { type: String, required: true },
  method: { type: String, default: "GET" },
  statusCode: { type: Number, default: 200 },
  rateLimited: { type: Boolean, default: false },
  date: { type: Date, default: Date.now, index: true },
});

// compound index for fast user+date queries
analyticsSchema.index({ userId: 1, date: -1 });
analyticsSchema.index({ userId: 1, endpoint: 1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
