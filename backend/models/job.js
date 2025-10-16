import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  salary: {
    type: String,
  },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
    required: [true, 'Job type is required'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requiredSkills: {
    type: [String],
  },
  // CRITICAL: Reference to the Recruiter (User) who posted the job
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicationsCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

export default Job;
