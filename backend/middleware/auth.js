import jwt from "jsonwebtoken";
import User from "../models/User.js";

// --- TEMPORARY FIX: HARDCODING SECRET TO BYPASS .env READ ERRORS ---
// This secret MUST match the one used in backend/routes/auth.js
export const FIXED_SECRET = "DEV_BYPASS_SECRET_ATS";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authentication required" });

    // Verify token using the hardcoded secret
    const decoded = jwt.verify(token, FIXED_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (...roles) => {
  // Normalize allowed roles to lowercase for safe comparisons
  const allowed = roles.map(r => r.toString().toLowerCase());
  return (req, res, next) => {
    const userRole = (req.user?.role || '').toString().toLowerCase();
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: "Permission denied" });
    }
    next();
  };
};
