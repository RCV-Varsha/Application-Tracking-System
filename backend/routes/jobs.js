import express from "express";
import Job from "../models/job.js"; // Corrected import to match filename casing
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// GET all jobs (for students and recruiters)
router.get("/", authenticate, async (req, res) => {
	try {
		const jobs = await Job.find({}).sort({ createdAt: -1 });
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

		// Normalize job type to match enum in Job model
		const typeMap = {
			'full-time': 'Full-Time',
			'part-time': 'Part-Time',
			'internship': 'Internship',
			'contract': 'Contract',
			'fulltime': 'Full-Time',
			'parttime': 'Part-Time'
		};

		const normalizedType = (type && type.toString().toLowerCase && typeMap[type.toString().toLowerCase()]) || type;

		const newJob = new Job({
			title,
			company,
			location,
			jobType: normalizedType,
			description,
			requiredSkills: requirements,
			salary: salary_min ? `${salary_min}-${salary_max || ''}` : undefined,
			postedBy: req.user._id || req.user.id,
		});
		await newJob.save();
		res.status(201).json(newJob);
	} catch (error) {
		console.error('Post job error:', error && error.message ? error.message : error);
		res.status(500).json({ message: "Server error posting job" });
	}
});

export default router;