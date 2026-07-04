import mongoose from 'mongoose';
import { DEVICE_TYPES_VALUES, DEVICE_STATUS_VALUES, DEVICE_STATUS, DEVICE_CONNECTION_MODES_VALUES } from '../../constants/device.constants.js';

const { Schema } = mongoose;

/**
 * Device Schema
 *
 * Represents an attendance capturing hardware endpoint (Biometric, Face, Hybrid).
 * Agnostic to specific manufacturer APIs. Used to manage deployment metadata
 * and network health.
 */
const deviceSchema = new Schema(
  {
    // ── Core Identity ────────────────────────────────────────────────────────
    deviceCode: {
      type:      String,
      required:  [true, 'Device code is required.'],
      trim:      true,
      uppercase: true,
      unique:    true,
    },

    deviceName: {
      type:      String,
      required:  [true, 'Device name is required.'],
      trim:      true,
      minlength: [2,  'Device name must be at least 2 characters.'],
      maxlength: [100, 'Device name cannot exceed 100 characters.'],
    },

    deviceType: {
      type: String,
      required: [true, 'Device type is required.'],
      enum: {
        values:  DEVICE_TYPES_VALUES,
        message: 'Invalid device type.',
      },
    },

    // ── Hardware Specs ───────────────────────────────────────────────────────
    manufacturer: {
      type:      String,
      required:  [true, 'Manufacturer is required.'],
      trim:      true,
      maxlength: [100, 'Manufacturer cannot exceed 100 characters.'],
    },

    model: {
      type:      String,
      required:  [true, 'Model is required.'],
      trim:      true,
      maxlength: [100, 'Model cannot exceed 100 characters.'],
    },

    serialNumber: {
      type:     String,
      required: [true, 'Serial number is required.'],
      trim:     true,
      unique:   true,
    },

    firmwareVersion: {
      type:    String,
      trim:    true,
      default: null,
    },

    // ── Network Config ───────────────────────────────────────────────────────
    ipAddress: {
      type:     String,
      required: [true, 'IP Address is required.'],
      trim:     true,
      match:    [/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Please provide a valid IPv4 address.'],
    },

    macAddress: {
      type:    String,
      trim:    true,
      default: null,
      match:   [/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Please provide a valid MAC address.'],
    },

    port: {
      type:     Number,
      required: [true, 'Port is required.'],
      min:      [1, 'Port must be between 1 and 65535.'],
      max:      [65535, 'Port must be between 1 and 65535.'],
    },

    // ── Physical Location ────────────────────────────────────────────────────
    campus: {
      type:    String,
      trim:    true,
      default: null,
    },

    building: {
      type:     String,
      required: [true, 'Building is required.'],
      trim:     true,
    },

    floor: {
      type:     String,
      required: [true, 'Floor is required.'],
      trim:     true,
    },

    room: {
      type:     String,
      required: [true, 'Room is required.'],
      trim:     true,
    },

    locationDescription: {
      type:      String,
      trim:      true,
      default:   null,
      maxlength: [500, 'Location description cannot exceed 500 characters.'],
    },

    // ── Operational & State ──────────────────────────────────────────────────
    assignedDepartment: {
      type:    Schema.Types.ObjectId,
      ref:     'Department',
      default: null,
    },

    connectionMode: {
      type: String,
      enum: {
        values:  DEVICE_CONNECTION_MODES_VALUES,
        message: 'Invalid connection mode.',
      },
      default: null,
    },

    heartbeatInterval: {
      type:    Number, // in minutes
      default: null,
      min:     [1, 'Heartbeat interval must be at least 1 minute.'],
      max:     [1440, 'Heartbeat interval cannot exceed 1440 minutes.'],
    },

    lastHeartbeat: {
      type:    Date,
      default: null,
    },

    lastError: {
      type:    String,
      trim:    true,
      default: null,
    },

    isAttendanceEnabled: {
      type:    Boolean,
      default: true,
    },

    isDefaultDevice: {
      type:    Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: {
        values:  DEVICE_STATUS_VALUES,
        message: 'Invalid device status.',
      },
      default: DEVICE_STATUS.OFFLINE,
    },

    lastSeen: {
      type:    Date,
      default: null, // Set during health checks/pings
    },

    lastSync: {
      type:    Date,
      default: null, // Set after successful attendance pull/push
    },

    // ── Audit & Soft Delete ──────────────────────────────────────────────────
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

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Unique indexes are already enforced on deviceCode and serialNumber.
deviceSchema.index({ deviceType: 1, isActive: 1 });
deviceSchema.index({ status: 1, isActive: 1 });
deviceSchema.index({ building: 1, floor: 1, isActive: 1 });
deviceSchema.index({ createdAt: -1 });

// ─── Instance Methods ─────────────────────────────────────────────────────────
deviceSchema.methods.toPublicJSON = function () {
  const dept = this.assignedDepartment;
  const assignedDepartmentField =
    dept && typeof dept === 'object' && dept._id
      ? { id: dept._id, name: dept.name, code: dept.code }
      : dept ?? null;

  return {
    id:                  this._id,
    deviceCode:          this.deviceCode,
    deviceName:          this.deviceName,
    deviceType:          this.deviceType,
    manufacturer:        this.manufacturer,
    model:               this.model,
    serialNumber:        this.serialNumber,
    firmwareVersion:     this.firmwareVersion,
    ipAddress:           this.ipAddress,
    macAddress:          this.macAddress,
    port:                this.port,
    campus:              this.campus,
    building:            this.building,
    floor:               this.floor,
    room:                this.room,
    locationDescription: this.locationDescription,
    assignedDepartment:  assignedDepartmentField,
    connectionMode:      this.connectionMode,
    heartbeatInterval:   this.heartbeatInterval,
    isAttendanceEnabled: this.isAttendanceEnabled,
    isDefaultDevice:     this.isDefaultDevice,
    status:              this.status,
    lastSeen:            this.lastSeen,
    lastSync:            this.lastSync,
    lastHeartbeat:       this.lastHeartbeat,
    lastError:           this.lastError,
    isActive:            this.isActive,
    deletedAt:           this.deletedAt,
    deletedBy:           this.deletedBy,
    createdBy:           this.createdBy,
    updatedBy:           this.updatedBy,
    createdAt:           this.createdAt,
    updatedAt:           this.updatedAt,
  };
};

const Device = mongoose.model('Device', deviceSchema);

export default Device;
