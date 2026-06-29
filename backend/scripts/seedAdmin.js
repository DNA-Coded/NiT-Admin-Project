/**
 * Super Admin Seeder
 *
 * Creates the initial SUPER_ADMIN account for the NiT Admin system.
 * This script is idempotent — running it multiple times will never
 * produce duplicate accounts.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Required environment variables (set in .env):
 *   SUPER_ADMIN_NAME      — Full name of the super admin
 *   SUPER_ADMIN_EMAIL     — Email address (used to log in)
 *   SUPER_ADMIN_PASSWORD  — Plaintext password (hashed by model pre-save hook)
 *
 * The script will exit with code 0 on success or if a SUPER_ADMIN already
 * exists, and with code 1 on any unrecoverable error.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import logger from '../src/config/logger.config.js';
import Admin from '../src/modules/auth/auth.model.js';
import { ROLES } from '../src/constants/index.js';

// ─── Credential resolution ────────────────────────────────────────────────────

const SUPER_ADMIN_NAME     = process.env.SUPER_ADMIN_NAME;
const SUPER_ADMIN_EMAIL    = process.env.SUPER_ADMIN_EMAIL;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
const MONGODB_URI          = process.env.MONGODB_URI || 'mongodb://localhost:27017/nit-admin';

/**
 * Validate that all required environment variables are present.
 * Exits early with a clear message rather than crashing mid-execution.
 */
const validateEnv = () => {
  const missing = [];

  if (!SUPER_ADMIN_NAME)     missing.push('SUPER_ADMIN_NAME');
  if (!SUPER_ADMIN_EMAIL)    missing.push('SUPER_ADMIN_EMAIL');
  if (!SUPER_ADMIN_PASSWORD) missing.push('SUPER_ADMIN_PASSWORD');

  if (missing.length > 0) {
    logger.error(
      `Seeder aborted — missing required environment variable(s): ${missing.join(', ')}\n` +
      'Add them to your .env file and try again.'
    );
    process.exit(1);
  }
};

// ─── Database connection ──────────────────────────────────────────────────────

/**
 * Open a dedicated Mongoose connection for the seeder.
 * The seeder manages its own connection lifecycle independently
 * of the main server so it can close cleanly after seeding.
 */
const connectDB = async () => {
  logger.info(`Seeder connecting to MongoDB: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);
  logger.info('MongoDB connection established.');
};

/**
 * Close the Mongoose connection gracefully.
 */
const disconnectDB = async () => {
  await mongoose.disconnect();
  logger.info('MongoDB connection closed.');
};

// ─── Seeding logic ────────────────────────────────────────────────────────────

/**
 * Core seeding function.
 *
 * 1. Check for an existing SUPER_ADMIN — exit early if one is found.
 * 2. Create a new Admin document with role SUPER_ADMIN.
 * 3. Save it — the model's pre-save hook will hash the password automatically.
 */
const seedSuperAdmin = async () => {
  // 1. Idempotency check
  const existing = await Admin.findOne({ role: ROLES.SUPER_ADMIN });

  if (existing) {
    logger.info(
      `Seeder skipped — a SUPER_ADMIN account already exists: ${existing.email}`
    );
    return;
  }

  // 2. Build the document — password is intentionally left as plaintext here;
  //    the adminSchema pre-save hook hashes it before it reaches the database.
  const superAdmin = new Admin({
    fullName: SUPER_ADMIN_NAME,
    email:    SUPER_ADMIN_EMAIL,
    password: SUPER_ADMIN_PASSWORD,
    role:     ROLES.SUPER_ADMIN,
    isActive: true,
  });

  // 3. Persist — triggers pre-save hook → bcrypt hash
  await superAdmin.save();

  logger.info('─────────────────────────────────────────────');
  logger.info('✔  Super Admin account created successfully.');
  logger.info(`   Name  : ${superAdmin.fullName}`);
  logger.info(`   Email : ${superAdmin.email}`);
  logger.info(`   Role  : ${superAdmin.role}`);
  logger.info('─────────────────────────────────────────────');
  logger.info('Keep these credentials secure. Do not commit them to version control.');
};

// ─── Entry point ──────────────────────────────────────────────────────────────

const run = async () => {
  validateEnv();

  try {
    await connectDB();
    await seedSuperAdmin();
  } catch (error) {
    logger.error(`Seeder failed: ${error.message}`, { stack: error.stack });
    process.exitCode = 1;
  } finally {
    // Always close the connection, regardless of success or failure
    await disconnectDB();
  }
};

run();
