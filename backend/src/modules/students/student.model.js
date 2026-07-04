import mongoose from 'mongoose';
import { STUDENT_STATUS, STUDENT_STATUS_VALUES, SEMESTERS } from '../../constants/student.constants.js';

const { Schema } = mongoose;

/**
 * Student Schema
 *
 * Represents a student at Narula Institute of Technology.
 * Students are not system users — they interact exclusively via attendance devices.
 * The Admin manages all student records through this module.
 */
const studentSchema = new Schema(
  {
    // ── Core identity ────────────────────────────────────────────────────────
    rollNumber: {
      type:     String,
      required: [true, 'Roll number is required.'],
      trim:     true,
      unique:   true,
    },

    registrationNumber: {
      type:     String,
      required: [true, 'Registration number is required.'],
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
      // Sparse unique index defined below.
    },

    phone: {
      type:    String,
      trim:    true,
      default: null,
      match:   [/^\+?[0-9\s\-().]{7,20}$/, 'Please provide a valid phone number.'],
    },

    profileImage: {
      type:    String,
      trim:    true,
      default: null,
    },

    // ── Academic Placement ───────────────────────────────────────────────────
    department: {
      type:     Schema.Types.ObjectId,
      ref:      'Department',
      required: [true, 'Department is required.'],
    },

    semester: {
      type:     Number,
      required: [true, 'Semester is required.'],
      enum: {
        values:  SEMESTERS,
        message: 'Invalid semester. Must be between 1 and 8.',
      },
    },

    section: {
      type:    String,
      trim:    true,
      default: null, // Free-text (A, B, C, etc.)
    },

    batch: {
      type:     String,
      required: [true, 'Batch is required.'],
      trim:     true, // E.g., '2021-2025'
    },

    academicSession: {
      type:     String,
      required: [true, 'Academic session is required.'],
      trim:     true, // E.g., '2024-2025'
    },

    /**
     * Device-agnostic biometric identifier.
     */
    attendanceIdentity: {
      type:     String,
      required: [true, 'Attendance identity is required.'],
      trim:     true,
      unique:   true,
    },

    // ── Operational & Audit ──────────────────────────────────────────────────
    status: {
      type:    String,
      enum: {
        values:  STUDENT_STATUS_VALUES,
        message: 'Invalid student status.',
      },
      default: STUDENT_STATUS.ACTIVE,
    },

    isActive: {
      type:    Boolean,
      default: true,
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
studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Sparse email index
studentSchema.index({ email: 1 }, { unique: true, sparse: true });

// Compound indexes
studentSchema.index({ department: 1, isActive: 1 });
studentSchema.index({ semester: 1, isActive: 1 });
studentSchema.index({ batch: 1, isActive: 1 });
studentSchema.index({ status: 1, isActive: 1 });
studentSchema.index({ isActive: 1, lastName: 1 });
studentSchema.index({ createdAt: -1 });

// ─── Instance Methods ─────────────────────────────────────────────────────────

studentSchema.methods.toPublicJSON = function () {
  const dept = this.department;
  const departmentField =
    dept && typeof dept === 'object' && dept._id
      ? { id: dept._id, name: dept.name, code: dept.code }
      : dept ?? null;

  return {
    id:                 this._id,
    rollNumber:         this.rollNumber,
    registrationNumber: this.registrationNumber,
    firstName:          this.firstName,
    lastName:           this.lastName,
    fullName:           this.fullName,
    email:              this.email,
    phone:              this.phone,
    profileImage:       this.profileImage,
    department:         departmentField,
    semester:           this.semester,
    section:            this.section,
    batch:              this.batch,
    academicSession:    this.academicSession,
    status:             this.status,
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

const Student = mongoose.model('Student', studentSchema);

export default Student;
