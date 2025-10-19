#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

// load backend .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;
const RESET_EMAIL = process.env.RESET_EMAIL || 'recruiter@example.com';
const RESET_PASSWORD = process.env.RESET_PASSWORD || 'recruiterPass123';

if (!MONGO_URI) {
  console.error('MONGO_URI not set. Exiting.');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: RESET_EMAIL });
    if (!user) {
      console.error('User not found:', RESET_EMAIL);
      process.exit(1);
    }

    user.password = RESET_PASSWORD;
    await user.save();
    console.log(`Password reset for ${RESET_EMAIL}`);
    process.exit(0);
  } catch (err) {
    console.error('Reset password error:', err.message);
    process.exit(1);
  }
})();
