import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js"; // Import Job Routes
import applicationRoutes from "./routes/applications.js"; // Import Application Routes
import adminRoutes from "./routes/admin.js"; // Import Admin Routes
import resumesRoutes from "./routes/resumes.js";

// Load .env located next to this file (backend/.env), not depending on cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isDbConnected = false;

// ✅ MongoDB connection (guarded)
if (MONGO_URI) {
  // Use an async IIFE to catch connection errors and avoid unhandled rejections
  (async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("✅ MongoDB Connected");
      isDbConnected = true;
    } catch (error) {
      console.error("❌ MongoDB connection error:", error.message);
      isDbConnected = false;
    }
  })();
} else {
  console.warn('⚠️ MONGO_URI not set — running in dev fallback mode (no DB).');
  isDbConnected = false;
}

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
  isDbConnected = false;
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected");
  isDbConnected = true;
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes); // Use Job Routes
app.use("/api/applications", applicationRoutes); // Use Application Routes
app.use("/api/admin", adminRoutes); // Use Admin Routes
app.use('/api/resumes', resumesRoutes);

// Serve uploaded resumes statically
app.use('/public/resumes', express.static(path.join(__dirname, 'public', 'resumes')));

// ✅ Health check
app.get("/api/health", (req, res) => {
// ... (rest of the health check logic)
// ... (omitted for brevity)
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: isDbConnected ? "connected" : "disconnected",
  });
});

// ✅ 404 route
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Frontend URL: ${FRONTEND_URL}`);
});
