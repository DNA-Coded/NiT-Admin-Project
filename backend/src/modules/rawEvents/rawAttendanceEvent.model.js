import mongoose from 'mongoose';
import crypto from 'crypto';
import { PROCESSING_STATUS, PROCESSING_STATUS_VALUES } from './rawAttendanceEvent.constants.js';

const { Schema } = mongoose;

/**
 * Raw Attendance Event Schema
 * 
 * Stores raw logs pulled from biometric devices (via the sync layer) before they
 * are validated, normalized, and converted into actual domain Attendance records.
 */
const rawAttendanceEventSchema = new Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
    },
    
    provider: {
      type: String,
      required: [true, 'Provider name is required.'],
      trim: true,
    },

    device: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      required: [true, 'Device reference is required.'],
    },

    // The untouched payload received from the integration layer/device SDK
    rawPayload: {
      type: Schema.Types.Mixed,
      required: true,
    },

    // The payload after being normalized by the event mapper
    normalizedPayload: {
      type: Schema.Types.Mixed,
      default: null,
    },

    processingStatus: {
      type: String,
      enum: {
        values: PROCESSING_STATUS_VALUES,
        message: 'Invalid processing status.',
      },
      default: PROCESSING_STATUS.PENDING,
      required: true,
    },

    processingAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    receivedAt: {
      type: Date,
      default: Date.now,
    },

    processedAt: {
      type: Date,
      default: null,
    },

    error: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
rawAttendanceEventSchema.index({ device: 1, processingStatus: 1 });
rawAttendanceEventSchema.index({ processingStatus: 1 });
rawAttendanceEventSchema.index({ receivedAt: -1 });

// ─── Instance Methods ─────────────────────────────────────────────────────────
rawAttendanceEventSchema.methods.toPublicJSON = function () {
  const deviceObj = this.device;
  const deviceField =
    deviceObj && typeof deviceObj === 'object' && deviceObj._id
      ? { id: deviceObj._id, deviceCode: deviceObj.deviceCode, deviceName: deviceObj.deviceName }
      : deviceObj ?? null;

  return {
    id: this._id,
    eventId: this.eventId,
    provider: this.provider,
    device: deviceField,
    rawPayload: this.rawPayload,
    normalizedPayload: this.normalizedPayload,
    processingStatus: this.processingStatus,
    processingAttempts: this.processingAttempts,
    receivedAt: this.receivedAt,
    processedAt: this.processedAt,
    error: this.error,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const RawAttendanceEvent = mongoose.model('RawAttendanceEvent', rawAttendanceEventSchema);

export default RawAttendanceEvent;
