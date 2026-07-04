import mongoose from 'mongoose';
import { FACULTY_DESIGNATIONS, FACULTY_STATUS, FACULTY_STATUS_VALUES } from '../../constants/faculty.constants.js';

const { Schema } = mongoose;

/**
 * Faculty Schema
 *
 * Represents a faculty member at Narula Institute of Technology.
 * Faculty are not system users — they interact exclusively via attendance devices.
 * The Admin manages all faculty records through this module.
 *
 * Design decisions:
 *   - `employeeId`         — Institution-assigned staff number; required, unique.
 *   - `designation`        — Validated against the FACULTY_DESIGNATIONS enum defined in
 *                            faculty.constants.js. Add new designations there — they
 *                            propagate to the model and validator automatically.
 *   - `status`             — Operational state (ACTIVE, ON_LEAVE, RETIRED, SUSPENDED).
 *                            Independent of `isActive` (soft-delete). A faculty member
 *                            can be ON_LEAVE yet still have isActive: true (visible).
 *   - `attendanceIdentity` — Single device-agnostic identifier: fingerprint template ID,
 *                            face recognition UUID, RFID card number, etc. One field
 *                            covers all device types — never store device-specific fields.
 *   - `email`              — Optional. Sparse unique index allows multiple null values.
 *   - `joiningDate`        — Optional. ISO date the faculty member joined the institution.
 *   - `profileImage`       — Optional URL to the faculty member's photo.
 *   - `fullName`           — Virtual: firstName + lastName; not persisted.
 *   - `department`         — ObjectId ref to Department; existence validated in service.
 *   - Soft-delete audit    — `isActive` + `deletedAt` + `deletedBy`.
 *   - Mutation audit       — `createdBy` + `updatedBy` (admin email).
 *   - HOD linking          — Intentionally absent; added after faculty records are stable.
 */
const facultySchema = new Schema(
  {
    // ── Core identity ────────────────────────────────────────────────────────
    employeeId: {
      type:     String,
      required: [true, 'Employee ID is required.'],
      trim:     true,
      unique:   true,
    },

    firstName: {
      type:      String,
      required:  [true, 'First name is required.'],
      trim:      true,
      minlength: [2,  'First name must be at least 2 characters.'],
      maxlength: [50, 'First name cannot exceed 50 characters.'],
    },

    lastName: {
      type:      String,
      required:  [true, 'Last name is required.'],
      trim:      true,
      minlength: [2,  'Last name must be at least 2 characters.'],
      maxlength: [50, 'Last name cannot exceed 50 characters.'],
    },

    email: {
      type:      String,
      trim:      true,
      lowercase: true,
      default:   null,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
      // Sparse unique index defined below — allows multiple null values.
    },

    phone: {
      type:    String,
      trim:    true,
      default: null,
      match:   [/^\+?[0-9\s\-().]{7,20}$/, 'Please provide a valid phone number.'],
    },

    /**
     * Validated against FACULTY_DESIGNATIONS enum in faculty.constants.js.
     * To add a new designation, update the constants file — no code changes needed here.
     */
    designation: {
      type:     String,
      required: [true, 'Designation is required.'],
      enum: {
        values:  FACULTY_DESIGNATIONS,
        message: 'Invalid designation.',
      },
      trim: true,
    },

    department: {
      type:     Schema.Types.ObjectId,
      ref:      'Department',
      required: [true, 'Department is required.'],
    },

    /**
     * Operational status — independent of soft-delete (isActive).
     * Defaults to ACTIVE on creation.
     */
    status: {
      type:    String,
      enum: {
        values:  FACULTY_STATUS_VALUES,
        message: 'Invalid faculty status.',
      },
      default: FACULTY_STATUS.ACTIVE,
    },

    /**
     * Date the faculty member joined the institution.
     * Optional; stored as a Date for accurate sorting and filtering.
     */
    joiningDate: {
      type:    Date,
      default: null,
    },

    /**
     * URL of the faculty member's profile image (CDN / S3 link, etc.).
     * Optional; the application layer is responsible for upload handling.
     */
    profileImage: {
      type:    String,
      trim:    true,
      default: null,
    },

    /**
     * Device-agnostic biometric identifier.
     * Stores whatever the attendance device uses as its primary key for this faculty
     * member — fingerprint template ID, face recognition UUID, RFID card number, etc.
     * Only one field is needed regardless of device type.
     */
    attendanceIdentity: {
      type:     String,
      required: [true, 'Attendance identity is required.'],
      trim:     true,
      unique:   true,
    },

    // ── Soft-delete audit ────────────────────────────────────────────────────
    isActive: {
      type:    Boolean,
      default: true, // false = soft-deleted (hidden from default listings)
    },

    deletedAt: {
      type:    Date,
      default: null,
    },

    deletedBy: {
      type:    String,
      trim:    true,
      default: null,
    },

    // ── Mutation audit ───────────────────────────────────────────────────────
    createdBy: {
      type:     String,
      trim:     true,
      required: [true, 'createdBy is required.'],
    },

    updatedBy: {
      type:    String,
      trim:    true,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────

/**
 * fullName — computed from firstName and lastName. Not persisted.
 */
facultySchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Unique indexes on: employeeId (field level), attendanceIdentity (field level).
// email uses a sparse unique index so null values don't conflict.
facultySchema.index({ email: 1 }, { unique: true, sparse: true });

// Compound indexes for common query patterns
facultySchema.index({ department: 1, isActive: 1 });   // filter by dept + active
facultySchema.index({ status: 1, isActive: 1 });        // filter by status
facultySchema.index({ isActive: 1, lastName: 1 });      // name-sorted list
facultySchema.index({ designation: 1, isActive: 1 });   // filter by designation
facultySchema.index({ createdAt: -1 });                  // default sort

// ─── Instance Methods ─────────────────────────────────────────────────────────

/**
 * Return a clean, API-safe representation of a faculty record.
 * Handles both populated and un-populated `department` references.
 *
 * @returns {object}
 */
facultySchema.methods.toPublicJSON = function () {
  const dept = this.department;
  const departmentField =
    dept && typeof dept === 'object' && dept._id
      ? { id: dept._id, name: dept.name, code: dept.code }
      : dept ?? null;

  return {
    id:                 this._id,
    employeeId:         this.employeeId,
    firstName:          this.firstName,
    lastName:           this.lastName,
    fullName:           this.fullName,
    email:              this.email,
    phone:              this.phone,
    designation:        this.designation,
    department:         departmentField,
    status:             this.status,
    joiningDate:        this.joiningDate,
    profileImage:       this.profileImage,
    attendanceIdentity: this.attendanceIdentity,
    isActive:           this.isActive,
    deletedAt:          this.deletedAt,
    deletedBy:          this.deletedBy,
    createdBy:          this.createdBy,
    updatedBy:          this.updatedBy,
    createdAt:          this.createdAt,
    updatedAt:          this.updatedAt,
  };
};

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
