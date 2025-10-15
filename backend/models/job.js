import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['full-time', 'part-time', 'internship', 'contract'], required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  salary_min: { type: Number },
  salary_max: { type: Number },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;