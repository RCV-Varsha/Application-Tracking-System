import express from "express";
import Job from "../models/job.js"; // Corrected import to match filename casing
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// GET all active jobs (for students and recruiters)
router.get("/", authenticate, async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching jobs" });
  }
});

// GET a single job by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching job" });
  }
});

// POST a new job (Recruiter/Admin only)
router.post("/", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const { title, company, location, type, description, requirements, salary_min, salary_max } = req.body;
    const newJob = new Job({
      title,
      company,
      location,
      type,
      description,
      requirements,
      salary_min,
      salary_max,
      posted_by: req.user.id,
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: "Server error posting job" });
  }
});

export default router;