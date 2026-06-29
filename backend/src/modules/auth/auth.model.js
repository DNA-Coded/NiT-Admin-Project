import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../../constants/index.js';

const { Schema } = mongoose;

/**
 * Admin Schema
 *
 * Represents an administrative user who can log into the NiT Admin system.
 * Regular faculty/students are NOT users — they only interact via biometric devices.
 */
const adminSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters.'],
      maxlength: [100, 'Full name cannot exceed 100 characters.'],
    },

    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    },

    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
      select: false, // Never returned in queries unless explicitly selected
    },

    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: `Role must be one of: ${Object.values(ROLES).join(', ')}.`,
      },
      default: ROLES.FACULTY,
    },

    department: {
      type: String,
      trim: true,
      default: null, // Optional — required only for HOD and FACULTY roles
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });

// ─── Pre-save Hook — Password Hashing ─────────────────────────────────────────
/**
 * Hash the password before saving if it has been modified.
 * This ensures plaintext passwords are NEVER stored in the database.
 */
adminSchema.pre('save', async function (next) {
  // Only hash if the password field was modified (or on new document creation)
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// ─── Instance Methods ─────────────────────────────────────────────────────────
/**
 * Compare a plaintext candidate password against the stored hashed password.
 *
 * @param {string} candidatePassword - Plaintext password from the login request
 * @returns {Promise<boolean>} True if the passwords match
 */
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Return a safe public representation of the admin (excludes password).
 * Use this before sending admin data in API responses.
 */
adminSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    department: this.department,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
