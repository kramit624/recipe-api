const isAdmin = (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim());
  if (!adminEmails.includes(req.user?.email)) {
    return res.status(403).json({ success: false, error: "Admin access only" });
  }
  next();
};

module.exports = isAdmin;
