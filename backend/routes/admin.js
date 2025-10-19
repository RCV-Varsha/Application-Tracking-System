import express from "express";
import User from "../models/User.js";
import Job from "../models/job.js";
import Application from "../models/Application.js";
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

// GET admin overview / dashboard data
router.get('/overview', authenticate, authorize('admin'), async (req, res) => {
    try {
        // KPI counts
        const totalUsers = await User.countDocuments();
        const activeRecruiters = await User.countDocuments({ role: 'recruiter' });
        // pendingRecruiters is not tracked in schema; return 0 for now
        const pendingRecruiters = 0;
        const totalJobs = await Job.countDocuments();
        const activeApplications = await Application.countDocuments();
        const reportsToday = 0;

        // Users growth (last 7 days) - simple aggregation by day
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const usersByDayAgg = await User.aggregate([
            { $match: { createdAt: { $gte: new Date(sevenDaysAgo.toDateString()) } } },
            { $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);

        const applicationsByDayAgg = await Application.aggregate([
            { $match: { appliedDate: { $gte: new Date(sevenDaysAgo.toDateString()) } } },
            { $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$appliedDate' } },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);

        // Normalize into arrays of { day, count }
        const usersGrowth = [];
        const applicationsByDay = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(sevenDaysAgo.getDate() + i);
            const dayStr = d.toISOString().slice(0, 10);
            const userEntry = usersByDayAgg.find(u => u._id === dayStr);
            const appEntry = applicationsByDayAgg.find(a => a._id === dayStr);
            usersGrowth.push({ day: dayStr, count: userEntry ? userEntry.count : 0 });
            applicationsByDay.push({ day: dayStr, count: appEntry ? appEntry.count : 0 });
        }

        // Recent activity: recent users, jobs, and applications
        const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5).select('name createdAt');
        const recentJobs = await Job.find({}).sort({ createdAt: -1 }).limit(5).select('title createdAt');
        const recentApplications = await Application.find({}).sort({ appliedDate: -1 }).limit(5).select('job student appliedDate status');

        const recentActivity = [];
        recentUsers.forEach(u => recentActivity.push({ id: `u-${u._id}`, type: 'signup', text: `${u.name} signed up`, time: u.createdAt.toISOString() }));
        recentJobs.forEach(j => recentActivity.push({ id: `j-${j._id}`, type: 'job_post', text: `${j.title} posted`, time: j.createdAt.toISOString() }));
        recentApplications.forEach(a => recentActivity.push({ id: `a-${a._id}`, type: 'application', text: `Application submitted`, time: a.appliedDate ? a.appliedDate.toISOString() : new Date().toISOString() }));

        res.json({
            kpis: { totalUsers, activeRecruiters, pendingRecruiters, totalJobs, activeApplications, reportsToday },
            usersGrowth,
            applicationsByDay,
            recentActivity
        });
    } catch (error) {
        console.error('Admin overview error:', error && error.message ? error.message : error);
        res.status(500).json({ message: 'Server error fetching admin overview' });
    }
});

export default router;