import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    organization: {
      organizationName: { type: String, required: true },
      organizationCode: { type: String, required: true },
      address: { type: String, required: true },
      contactEmail: { type: String, required: true },
      contactPhone: { type: String, required: true },
    },
    academic: {
      currentAcademicSession: { type: String, required: true },
      currentSemester: { type: Number, required: true },
      defaultDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
    },
    attendance: {
      workingHoursStart: { type: String, required: true }, // Format HH:mm
      workingHoursEnd: { type: String, required: true }, // Format HH:mm
      gracePeriodMinutes: { type: Number, required: true },
      allowManualCorrection: { type: Boolean, required: true, default: true },
      correctionApprovalRequired: { type: Boolean, required: true, default: false },
    },
    devices: {
      defaultVerificationMethod: { type: String, required: true },
      defaultDevice: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', default: null },
      heartbeatTimeout: { type: Number, required: true }, // in seconds
    },
    system: {
      timezone: { type: String, required: true },
      dateFormat: { type: String, required: true },
      language: { type: String, required: true },
    },
    security: {
      sessionTimeout: { type: Number, required: true }, // in minutes
      maxLoginAttempts: { type: Number, required: true },
      passwordExpiryDays: { type: Number, required: true },
    },
    notifications: {
      enableEmailNotifications: { type: Boolean, required: true, default: true },
      enableSystemNotifications: { type: Boolean, required: true, default: true },
    },
    backup: {
      autoBackupEnabled: { type: Boolean, required: true, default: true },
      backupFrequency: { type: String, required: true }, // DAILY, WEEKLY, MONTHLY
    },
    updatedBy: { type: String, default: 'system' }
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
