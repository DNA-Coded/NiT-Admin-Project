export interface SettingsOrganization {
  organizationName: string;
  organizationCode: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export interface SettingsAcademic {
  currentAcademicSession: string;
  currentSemester: number;
  defaultDepartment: string | null;
}

export interface SettingsAttendance {
  workingHoursStart: string;
  workingHoursEnd: string;
  gracePeriodMinutes: number;
  allowManualCorrection: boolean;
  correctionApprovalRequired: boolean;
}

export interface SettingsDevices {
  defaultVerificationMethod: string;
  defaultDevice: string | null;
  heartbeatTimeout: number;
}

export interface SettingsSystem {
  timezone: string;
  dateFormat: string;
  language: string;
}

export interface SettingsSecurity {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordExpiryDays: number;
}

export interface SettingsNotifications {
  enableEmailNotifications: boolean;
  enableSystemNotifications: boolean;
}

export interface SettingsBackup {
  autoBackupEnabled: boolean;
  backupFrequency: string;
}

export interface SettingsBackendModel {
  _id?: string;
  organization: SettingsOrganization;
  academic: SettingsAcademic;
  attendance: SettingsAttendance;
  devices: SettingsDevices;
  system: SettingsSystem;
  security: SettingsSecurity;
  notifications: SettingsNotifications;
  backup: SettingsBackup;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data: SettingsBackendModel;
}

export interface UpdateSettingsPayload {
  organization?: Partial<SettingsOrganization>;
  academic?: Partial<SettingsAcademic>;
  attendance?: Partial<SettingsAttendance>;
  devices?: Partial<SettingsDevices>;
  system?: Partial<SettingsSystem>;
  security?: Partial<SettingsSecurity>;
  notifications?: Partial<SettingsNotifications>;
  backup?: Partial<SettingsBackup>;
}

export interface SettingsUpdateResponse {
  success: boolean;
  message: string;
  data: SettingsBackendModel;
}
