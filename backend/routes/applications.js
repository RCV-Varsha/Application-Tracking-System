import express from 'express';
import { check, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js'; // ✅ updated

import Application from '../models/Application.js';
import Job from '../models/job.js';

const router = express.Router();

// Student applies for a job
router.post('/apply/:jobId', authenticate, authorize('student'), async (req, res) => {
  const { resumeUrl, coverLetter, aiScore, analysis } = req.body;
  const jobId = req.params.jobId;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existingApplication = await Application.findOne({
      student: req.user._id,
      job: jobId
    });
    if (existingApplication)
      return res.status(400).json({ message: 'You have already applied for this job' });

    const application = new Application({
      student: req.user._id,
      job: jobId,
      recruiter: job.postedBy,
      resumeUrl,
      coverLetter,
      aiScore,
      analysis,
      status: 'Pending',
    });

    await application.save();

    job.applicationsCount += 1;
    await job.save();

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Recruiter/Admin gets all applicants for a job
router.get('/job/:jobId', authenticate, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Recruiter check: ensure they posted the job
    if (req.user.role === 'recruiter' && job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You did not post this job.' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('student', 'name email phone role')
      // include resumeUrl and analysis for recruiter view
      .select('-coverLetter')
      .sort({ appliedDate: 1 });

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update application status (Recruiter/Admin)
router.put('/:appId/status',
  authenticate,
  authorize('recruiter', 'admin'),
  [
    check('status', 'Status is required').not().isEmpty(),
    check('status').isIn(['Reviewed', 'Interviewing', 'Rejected', 'Accepted'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { status } = req.body;
    const { appId } = req.params;

    try {
      const application = await Application.findById(appId)
        .populate('job', 'title')
        .populate('student', 'email');
      if (!application) return res.status(404).json({ message: 'Application not found' });

      if (req.user.role === 'recruiter' && application.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied. You do not manage this application.' });
      }

      application.status = status;
      await application.save();

      console.log(`Application ${appId} status updated to ${status} by ${req.user.name} (${req.user.role})`);

      res.json({ message: `Status updated to ${status}`, application });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// GET current student's applications (for student dashboard)
router.get('/me', authenticate, authorize('student'), async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job', 'title company')
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Get my applications error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
