const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getTokenFromHeader = (headerValue = "") => {
  if (!headerValue.startsWith("Bearer ")) return null;
  return headerValue.split(" ")[1];
};

const protect = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization || "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "stayprox-dev-secret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  }
  next();
};

module.exports = {
  protect,
  requireRole,
};
