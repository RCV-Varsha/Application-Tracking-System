import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  // Reference to the User (Student) who applied
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Reference to the Job the student applied for
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  // Reference to the Recruiter who posted the job (for easy filtering)
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Current status of the application
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Interviewing', 'Rejected', 'Accepted'],
    default: 'Pending',
  },
  // Data submitted with the application
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  resumeUrl: {
    type: String, // Placeholder for actual file storage path
  },
  coverLetter: {
    type: String,
  },
  // Optional AI analysis/score produced for the resume
  aiScore: {
    type: Number,
  },
  analysis: {
    type: Object,
  },
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);

export default Application;
