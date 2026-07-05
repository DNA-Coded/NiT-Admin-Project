import mongoose from 'mongoose';
import crypto from 'crypto';
import { SYNC_STATUS_VALUES, SYNC_SOURCE_VALUES, SYNC_STATUS, SYNC_SOURCE } from './sync.constants.js';

const { Schema } = mongoose;

/**
 * SyncJob Schema
 * 
 * Tracks the lifecycle and history of synchronization jobs with devices.
 * Contains no business logic or attendance data, only orchestration metadata.
 */
const syncJobSchema = new Schema(
  {
    syncId: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
    },
    
    device: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      required: [true, 'Device reference is required.'],
    },

    provider: {
      type: String,
      required: [true, 'Provider name is required.'],
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: SYNC_STATUS_VALUES,
        message: 'Invalid sync status.',
      },
      default: SYNC_STATUS.PENDING,
      required: true,
    },

    source: {
      type: String,
      enum: {
        values: SYNC_SOURCE_VALUES,
        message: 'Invalid sync source.',
      },
      default: SYNC_SOURCE.MANUAL,
      required: true,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // The boundary up to which records were successfully synced
    lastSyncedTimestamp: {
      type: Date,
      default: null,
    },

    // Statistics
    recordsFetched: {
      type: Number,
      default: 0,
      min: 0,
    },

    recordsProcessed: {
      type: Number,
      default: 0,
      min: 0,
    },

    recordsFailed: {
      type: Number,
      default: 0,
      min: 0,
    },

    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    duration: {
      type: Number, // in milliseconds
      default: null,
    },

    error: {
      type: Schema.Types.Mixed, // flexible error struct { code, message, stack }
      default: null,
    },

    metadata: {
      type: Schema.Types.Mixed, // additional context specific to a run
      default: null,
    },

    // ── Audit & Soft Delete ──────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: String,
      trim: true,
      default: null,
    },
    createdBy: {
      type: String,
      trim: true,
      default: 'system',
    },
    updatedBy: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
syncJobSchema.index({ device: 1, isActive: 1 });
syncJobSchema.index({ status: 1, isActive: 1 });
syncJobSchema.index({ startedAt: -1 });
syncJobSchema.index({ completedAt: -1 });
syncJobSchema.index({ provider: 1 });

// ─── Instance Methods ─────────────────────────────────────────────────────────
syncJobSchema.methods.toPublicJSON = function () {
  const deviceObj = this.device;
  const deviceField =
    deviceObj && typeof deviceObj === 'object' && deviceObj._id
      ? { id: deviceObj._id, deviceCode: deviceObj.deviceCode, deviceName: deviceObj.deviceName }
      : deviceObj ?? null;

  return {
    id: this._id,
    syncId: this.syncId,
    device: deviceField,
    provider: this.provider,
    status: this.status,
    source: this.source,
    startedAt: this.startedAt,
    completedAt: this.completedAt,
    lastSyncedTimestamp: this.lastSyncedTimestamp,
    recordsFetched: this.recordsFetched,
    recordsProcessed: this.recordsProcessed,
    recordsFailed: this.recordsFailed,
    retryCount: this.retryCount,
    duration: this.duration,
    error: this.error,
    metadata: this.metadata,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    createdBy: this.createdBy,
    updatedBy: this.updatedBy,
  };
};

const SyncJob = mongoose.model('SyncJob', syncJobSchema);

export default SyncJob;
