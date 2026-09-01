import type { SettingsBackendModel } from '../types/settings.api.types';

export const mapSettingsResponse = (backendData: SettingsBackendModel): SettingsBackendModel => {
  return {
    ...backendData,
    organization: {
      organizationName: backendData.organization?.organizationName || '',
      organizationCode: backendData.organization?.organizationCode || '',
      address: backendData.organization?.address || '',
      contactEmail: backendData.organization?.contactEmail || '',
      contactPhone: backendData.organization?.contactPhone || '',
    },
    academic: {
      currentAcademicSession: backendData.academic?.currentAcademicSession || '',
      currentSemester: backendData.academic?.currentSemester || 1,
      defaultDepartment: backendData.academic?.defaultDepartment || null,
    },
    attendance: {
      workingHoursStart: backendData.attendance?.workingHoursStart || '09:00',
      workingHoursEnd: backendData.attendance?.workingHoursEnd || '17:00',
      gracePeriodMinutes: backendData.attendance?.gracePeriodMinutes || 15,
      allowManualCorrection: backendData.attendance?.allowManualCorrection ?? true,
      correctionApprovalRequired: backendData.attendance?.correctionApprovalRequired ?? false,
    },
    devices: {
      defaultVerificationMethod: backendData.devices?.defaultVerificationMethod || 'FINGERPRINT',
      defaultDevice: backendData.devices?.defaultDevice || null,
      heartbeatTimeout: backendData.devices?.heartbeatTimeout || 60,
    },
    system: {
      timezone: backendData.system?.timezone || 'UTC',
      dateFormat: backendData.system?.dateFormat || 'YYYY-MM-DD',
      language: backendData.system?.language || 'en',
    },
    security: {
      sessionTimeout: backendData.security?.sessionTimeout || 15,
      maxLoginAttempts: backendData.security?.maxLoginAttempts || 5,
      passwordExpiryDays: backendData.security?.passwordExpiryDays || 90,
    },
    notifications: {
      enableEmailNotifications: backendData.notifications?.enableEmailNotifications ?? true,
      enableSystemNotifications: backendData.notifications?.enableSystemNotifications ?? true,
    },
    backup: {
      autoBackupEnabled: backendData.backup?.autoBackupEnabled ?? true,
      backupFrequency: backendData.backup?.backupFrequency || 'DAILY',
    },
  };
};
