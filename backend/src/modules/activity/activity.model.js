import mongoose from 'mongoose';
import {
  ACTIVITY_MODULES_VALUES,
  ACTIVITY_ACTIONS_VALUES,
  ACTIVITY_STATUS_VALUES,
  ACTIVITY_SEVERITY_VALUES,
  ACTIVITY_SEVERITY
} from './activity.constants.js';

const activitySchema = new mongoose.Schema(
  {
    activityId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      enum: ACTIVITY_MODULES_VALUES,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ACTIVITY_ACTIONS_VALUES,
      index: true,
    },
    entityType: {
      type: String,
      required: false,
    },
    entityId: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming there's a User model. Replace with correct reference if needed.
      required: false,
      index: true,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: {},
    },
    status: {
      type: String,
      required: true,
      enum: ACTIVITY_STATUS_VALUES,
      index: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ACTIVITY_SEVERITY_VALUES,
      default: ACTIVITY_SEVERITY.LOW,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal filtering and searching
activitySchema.index({ createdAt: -1 });
activitySchema.index({ module: 1, action: 1, status: 1 });
activitySchema.index({ severity: 1, createdAt: -1 });
// Text index for keyword search
activitySchema.index({ description: 'text', entityType: 'text' });

export const Activity = mongoose.model('Activity', activitySchema);
