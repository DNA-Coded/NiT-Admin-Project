import Joi from 'joi';
import { SETTINGS_VALIDATION } from './settings.constants.js';

export const updateSettingsSchema = Joi.object({
  organization: Joi.object({
    organizationName: Joi.string().trim().max(150),
    organizationCode: Joi.string().trim().max(50),
    address: Joi.string().trim().max(300),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string().trim().max(20),
  }),
  academic: Joi.object({
    currentAcademicSession: Joi.string().trim().max(50),
    currentSemester: Joi.number().integer().min(1).max(10),
    defaultDepartment: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null),
  }),
  attendance: Joi.object({
    workingHoursStart: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).message('Invalid time format. Use HH:mm'),
    workingHoursEnd: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).message('Invalid time format. Use HH:mm'),
    gracePeriodMinutes: Joi.number().integer().min(0).max(120),
    allowManualCorrection: Joi.boolean(),
    correctionApprovalRequired: Joi.boolean(),
  }),
  devices: Joi.object({
    defaultVerificationMethod: Joi.string().trim().max(50),
    defaultDevice: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null),
    heartbeatTimeout: Joi.number().integer().min(30).max(3600), // 30s to 1h
  }),
  system: Joi.object({
    timezone: Joi.string().trim().max(100),
    dateFormat: Joi.string().trim().max(50),
    language: Joi.string().valid(...SETTINGS_VALIDATION.LANGUAGES),
  }),
  security: Joi.object({
    sessionTimeout: Joi.number().integer().min(5).max(1440), // 5m to 24h
    maxLoginAttempts: Joi.number().integer().min(1).max(20),
    passwordExpiryDays: Joi.number().integer().min(0).max(365), // 0 means no expiry
  }),
  notifications: Joi.object({
    enableEmailNotifications: Joi.boolean(),
    enableSystemNotifications: Joi.boolean(),
  }),
  backup: Joi.object({
    autoBackupEnabled: Joi.boolean(),
    backupFrequency: Joi.string().valid(...SETTINGS_VALIDATION.BACKUP_FREQUENCIES),
  })
}).min(1); // Ensure at least one group is being updated
