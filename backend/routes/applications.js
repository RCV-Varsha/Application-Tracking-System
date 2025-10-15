import express from "express";
import Application from "../models/Application.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// POST a new application (Student only)
router.post("/", authenticate, authorize("student"), async (req, res) => {
  try {
    const { job_id, resume_url, cover_letter } = req.body;
    const newApplication = new Application({
      job_id,
      student_id: req.user.id,
      resume_url,
      cover_letter,
    });
    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ message: "Server error submitting application" });
  }
});

// GET all applications for a specific job (Recruiter/Admin only)
router.get("/job/:jobId", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const applications = await Application.find({ job_id: req.params.jobId }).populate('student_id');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching applications" });
  }
});

export default router;