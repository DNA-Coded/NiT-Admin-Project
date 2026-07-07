export const DEFAULT_SETTINGS = {
  organization: {
    organizationName: 'Narula Institute of Technology',
    organizationCode: 'NIT',
    address: '81, Nilgunj Rd, Agarpara, Kolkata, West Bengal 700109',
    contactEmail: 'info@nit.ac.in',
    contactPhone: '+91-33-2563-8888'
  },
  academic: {
    currentAcademicSession: '2025-2026',
    currentSemester: 1,
    defaultDepartment: null
  },
  attendance: {
    workingHoursStart: '09:00',
    workingHoursEnd: '17:30',
    gracePeriodMinutes: 15,
    allowManualCorrection: true,
    correctionApprovalRequired: false
  },
  devices: {
    defaultVerificationMethod: 'BIOMETRIC',
    defaultDevice: null,
    heartbeatTimeout: 300
  },
  system: {
    timezone: 'Asia/Kolkata',
    dateFormat: 'YYYY-MM-DD',
    language: 'en'
  },
  security: {
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90
  },
  notifications: {
    enableEmailNotifications: true,
    enableSystemNotifications: true
  },
  backup: {
    autoBackupEnabled: true,
    backupFrequency: 'DAILY'
  }
};

export const SETTINGS_VALIDATION = {
  BACKUP_FREQUENCIES: ['DAILY', 'WEEKLY', 'MONTHLY'],
  LANGUAGES: ['en', 'hi', 'bn']
};
