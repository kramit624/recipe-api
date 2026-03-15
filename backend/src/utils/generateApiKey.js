const crypto = require("crypto");

const generateApiKey = () => {
  const raw = "ra_" + crypto.randomBytes(24).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hashed };
};

module.exports = generateApiKey;
