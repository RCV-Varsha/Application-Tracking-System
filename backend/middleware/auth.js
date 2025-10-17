import jwt from "jsonwebtoken";
import User from "../models/User.js";

// --- TEMPORARY FIX: HARDCODING SECRET TO BYPASS .env READ ERRORS ---
const FIXED_SECRET = "DEV_BYPASS_SECRET_ATS"; 

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Authentication required" });

        // Use the hardcoded secret for verification
        const decoded = jwt.verify(token, FIXED_SECRET); 
        
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        req.user._id = decoded.userId; // Ensure _id is correctly set (needed for application logic)
        req.user.name = user.name; // Ensure name is available for logging
        next();
    } catch (error) {
        // Log the failure to see if it's still JWT related
        console.error("JWT Authentication failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        // If the user object is missing due to auth failure, prevent crash
        if (!req.user) {
             return res.status(401).json({ message: "Authentication required" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Permission denied" });
        }
        next();
    };
};
