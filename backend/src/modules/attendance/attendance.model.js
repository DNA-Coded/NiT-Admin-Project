import mongoose from 'mongoose';
import {
  PERSON_TYPES_VALUES,
  VERIFICATION_METHODS_VALUES,
  ATTENDANCE_TYPES_VALUES,
  ATTENDANCE_RECORD_STATUS_VALUES,
} from '../../constants/index.js';

const { Schema } = mongoose;

/**
 * Attendance Schema
 *
 * Core engine for recording all attendance events.
 * Strictly separates the temporal exact timestamp from the optimized date/time
 * strings for reporting and queries.
 */
const attendanceSchema = new Schema(
  {
    attendanceCode: {
      type:      String,
      required:  [true, 'Attendance code is required.'],
      trim:      true,
      uppercase: true,
      unique:    true,
    },

    personType: {
      type: String,
      required: [true, 'Person type is required.'],
      enum: {
        values:  PERSON_TYPES_VALUES,
        message: 'Invalid person type.',
      },
    },

    personModelName: {
      type: String,
      required: true,
      enum: ['Faculty', 'Student'],
    },

    person: {
      type:     Schema.Types.ObjectId,
      required: [true, 'Person reference is required.'],
      refPath:  'personModelName',
    },

    device: {
      type:     Schema.Types.ObjectId,
      required: [true, 'Device reference is required.'],
      ref:      'Device',
    },

    attendanceIdentity: {
      type:     String,
      required: [true, 'Attendance identity is required.'],
      trim:     true,
    },

    verificationMethod: {
      type: String,
      required: [true, 'Verification method is required.'],
      enum: {
        values:  VERIFICATION_METHODS_VALUES,
        message: 'Invalid verification method.',
      },
    },

    attendanceType: {
      type: String,
      required: [true, 'Attendance type is required.'],
      enum: {
        values:  ATTENDANCE_TYPES_VALUES,
        message: 'Invalid attendance type.',
      },
    },

    timestamp: {
      type:     Date,
      required: [true, 'Exact timestamp is required.'],
    },

    attendanceDate: {
      type:     String, // YYYY-MM-DD
      required: [true, 'Attendance date string is required.'],
    },

    attendanceTime: {
      type:     String, // HH:MM:SS
      required: [true, 'Attendance time string is required.'],
    },

    status: {
      type: String,
      required: [true, 'Status is required.'],
      enum: {
        values:  ATTENDANCE_RECORD_STATUS_VALUES,
        message: 'Invalid attendance status.',
      },
    },

    remarks: {
      type:      String,
      trim:      true,
      default:   null,
      maxlength: [500, 'Remarks cannot exceed 500 characters.'],
    },

    correctionHistory: [
      {
        correctionReason: { type: String, required: true, trim: true },
        correctedAt: { type: Date, required: true },
        correctedBy: { type: String, required: true, trim: true },
        originalStatus: { type: String, required: true },
        originalAttendanceType: { type: String, required: true },
        originalRemarks: { type: String, default: null },
      }
    ],

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
  }
);

// ─── Pre-save Hook ─────────────────────────────────────────────────────────────
attendanceSchema.pre('validate', function (next) {
  if (this.personType === 'FACULTY') {
    this.personModelName = 'Faculty';
  } else if (this.personType === 'STUDENT') {
    this.personModelName = 'Student';
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
attendanceSchema.index({ attendanceDate: 1, person: 1, isActive: 1 });
attendanceSchema.index({ person: 1, attendanceDate: -1, isActive: 1 });
attendanceSchema.index({ device: 1, attendanceDate: -1, isActive: 1 });

// ─── Instance Methods ─────────────────────────────────────────────────────────
attendanceSchema.methods.toPublicJSON = function () {
  const p = this.person;
  let personField = p ?? null;
  
  if (p && typeof p === 'object' && p._id) {
    personField = {
      id:        p._id,
      firstName: p.firstName,
      lastName:  p.lastName,
      fullName:  p.fullName,
      department: p.department && p.department._id ? {
        id: p.department._id,
        name: p.department.name,
        code: p.department.code
      } : p.department ?? null,
    };
  }

  const d = this.device;
  const deviceField =
    d && typeof d === 'object' && d._id
      ? { id: d._id, deviceCode: d.deviceCode, deviceName: d.deviceName, deviceCategory: d.deviceCategory }
      : d ?? null;

  return {
    id:                 this._id,
    attendanceCode:     this.attendanceCode,
    personType:         this.personType,
    person:             personField,
    device:             deviceField,
    verificationMethod: this.verificationMethod,
    attendanceType:     this.attendanceType,
    timestamp:          this.timestamp,
    attendanceDate:     this.attendanceDate,
    attendanceTime:     this.attendanceTime,
    status:             this.status,
    remarks:            this.remarks,
    correctionHistory:  this.correctionHistory || [],
    isActive:           this.isActive,
    deletedAt:          this.deletedAt,
    deletedBy:          this.deletedBy,
    createdBy:          this.createdBy,
    updatedBy:          this.updatedBy,
    createdAt:          this.createdAt,
    updatedAt:          this.updatedAt,
  };
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
