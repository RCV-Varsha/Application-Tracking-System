import express from "express";
import User from "../models/User.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// POST a new user (Recruiter/Admin only)
router.post("/users", authenticate, authorize("admin"), async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        if (role === "student") {
            return res.status(400).json({ message: "Cannot create student users via this endpoint" });
        }

        const newUser = new User({ name, email, password, phone, role });
        await newUser.save();

        res.status(201).json({
            message: `${role} account created successfully`,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        });
    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ message: "Server error creating user" });
    }
});

export default router;