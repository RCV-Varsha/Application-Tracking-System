import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'public', 'resumes');

// ensure directory exists at runtime (server should create if missing)
import fs from 'fs';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error('Only PDF/DOC/DOCX allowed'));
    cb(null, true);
  }
});

// Simple analysis stub
const analyzeResume = async (filePath) => {
  // lightweight stub: read file size and generate pseudo score
  const stats = fs.statSync(filePath);
  const sizeKB = Math.max(1, Math.round(stats.size / 1024));
  const score = Math.max(40, Math.min(95, 100 - Math.floor(sizeKB / 50)));
  return {
    score,
    suggestions: [
      'Add more quantifiable achievements',
      'Include a clear summary at the top',
    ],
    keywords: []
  };
};

// POST /api/resumes/upload
router.post('/upload', authenticate, authorize('student'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const resumeUrl = `/public/resumes/${req.file.filename}`; // served statically
    const fullPath = path.join(uploadDir, req.file.filename);
    const analysis = await analyzeResume(fullPath);
    res.json({ resumeUrl, analysis });
  } catch (err) {
    console.error('Resume upload error:', err.message || err);
    res.status(500).json({ message: 'Server error uploading resume' });
  }
});

export default router;
