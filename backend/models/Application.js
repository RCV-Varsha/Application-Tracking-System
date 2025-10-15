import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'], default: 'pending' },
  resume_url: { type: String },
  cover_letter: { type: String },
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;