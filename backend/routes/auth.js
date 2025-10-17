import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// --- TEMPORARY FIX: HARDCODING SECRET TO BYPASS .env READ ERRORS ---
// This must match the FIXED_SECRET in the backend/middleware/auth.js file exactly.
const FIXED_SECRET = "DEV_BYPASS_SECRET_ATS"; 

const generateToken = (userId, role) => {
  // Sign the token using the hardcoded secret
  return jwt.sign({ userId, role }, FIXED_SECRET, { expiresIn: "7d" });
};

// 🧾 SIGNUP
router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("role").custom((value) => {
      if (value !== "student") throw new Error("Only students can sign up through this endpoint");
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

      const { name, email, password, phone } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already registered" });

      const user = new User({ name, email, password, phone, role: "student" });
      await user.save();

      const token = generateToken(user._id, user.role);
      res.status(201).json({
        message: "Student account created successfully",
        token,
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Server error during signup" });
    }
  }
);

// 🔑 LOGIN
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role").isIn(["student", "recruiter", "admin"]).withMessage("Valid role is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

      const { email, password, role } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid email or password" });
      if (user.role !== role) return res.status(401).json({ message: `This account is not a ${role}` });

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

      const token = generateToken(user._id, user.role);
      res.json({
        message: "Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

// 🙍 GET CURRENT USER
router.get("/me", async (req, res) => {
  try {
    // Note: This endpoint is often handled by middleware, but if called directly,
    // we need to use the fixed secret to verify the token sent by the client.
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authentication required" });

    // Verify token using the hardcoded secret
    const decoded = jwt.verify(token, FIXED_SECRET); 

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
