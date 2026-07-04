import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Department Schema
 *
 * Represents an academic/administrative department at Narula Institute of Technology.
 * Referenced across the Employee, Attendance, and Device modules for grouping and filtering.
 *
 * Design decisions:
 *   - `code` is stored in UPPERCASE (Mongoose setter) — used as a human-readable short
 *     identifier (e.g. "CSE", "ECE"). Uniqueness is enforced at both schema and DB level.
 *   - Soft-delete is implemented via `isActive` + `deletedAt` + `deletedBy` for full
 *     auditability. Hard deletes are never performed so historical attendance and payroll
 *     records remain consistent.
 *   - `createdBy` / `updatedBy` store the acting admin's email for audit trail purposes.
 *     These will be updated to ObjectId references once the Admin profile endpoints mature.
 *   - HOD linking is intentionally absent. It will be introduced after the Faculty module
 *     is implemented, at which point a proper ObjectId reference can be established.
 *   - Employee headcount is not stored — it will be computed via aggregation once the
 *     Employee collection exists.
 */
const departmentSchema = new Schema(
  {
    // ── Core identity ────────────────────────────────────────────────────────
    name: {
      type:      String,
      required:  [true, 'Department name is required.'],
      trim:      true,
      minlength: [2,   'Department name must be at least 2 characters.'],
      maxlength: [100, 'Department name cannot exceed 100 characters.'],
      unique:    true,
    },

    code: {
      type:      String,
      required:  [true, 'Department code is required.'],
      trim:      true,
      uppercase: true, // Mongoose setter — always stored and queried in UPPERCASE
      minlength: [2,  'Department code must be at least 2 characters.'],
      maxlength: [10, 'Department code cannot exceed 10 characters.'],
      unique:    true,
      match:     [
        /^[A-Z0-9]+$/,
        'Department code may only contain letters and numbers.',
      ],
    },

    description: {
      type:      String,
      trim:      true,
      default:   null,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
    },

    // ── Soft-delete audit ────────────────────────────────────────────────────
    isActive: {
      type:    Boolean,
      default: true, // false = soft-deleted
    },

    deletedAt: {
      type:    Date,
      default: null, // Populated on soft-delete; cleared on restore
    },

    deletedBy: {
      type:    String,  // Admin email — future: ObjectId ref to Admin
      trim:    true,
      default: null,    // Populated on soft-delete; cleared on restore
    },

    // ── Mutation audit ───────────────────────────────────────────────────────
    createdBy: {
      type:     String, // Admin email — future: ObjectId ref to Admin
      trim:     true,
      required: [true, 'createdBy is required.'],
    },

    updatedBy: {
      type:    String,  // Admin email — future: ObjectId ref to Admin
      trim:    true,
      default: null,    // Set on every update operation
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Unique indexes are defined on the field level above.
// Compound indexes below support the most common query patterns.
departmentSchema.index({ isActive: 1, name: 1 });  // default list query
departmentSchema.index({ isActive: 1, code: 1 });  // lookup by code
departmentSchema.index({ createdAt: -1 });          // default sort

// ─── Instance Methods ─────────────────────────────────────────────────────────

/**
 * Return a clean, API-safe representation of the department.
 *
 * Omissions by design:
 *   - No `employeeCount` — computed via aggregation after Employee module exists.
 *   - No `hod` — will be added after Faculty module is implemented.
 *
 * @returns {object}
 */
departmentSchema.methods.toPublicJSON = function () {
  return {
    id:          this._id,
    name:        this.name,
    code:        this.code,
    description: this.description,
    isActive:    this.isActive,
    deletedAt:   this.deletedAt,
    deletedBy:   this.deletedBy,
    createdBy:   this.createdBy,
    updatedBy:   this.updatedBy,
    createdAt:   this.createdAt,
    updatedAt:   this.updatedAt,
  };
};

const Department = mongoose.model('Department', departmentSchema);

export default Department;
