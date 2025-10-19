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
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGO_URI) {
  console.error('MONGO_URI not set. Exiting.');
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Exiting.');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        existing.password = ADMIN_PASSWORD;
        await existing.save();
        console.log('Updated existing user to admin and reset password');
      } else {
        console.log('Admin user already exists');
      }
    } else {
      const admin = new User({ name: 'Administrator', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, phone: '000-000-0000', role: 'admin' });
      await admin.save();
      console.log('Admin user created');
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed admin error:', err.message);
    process.exit(1);
  }
})();
