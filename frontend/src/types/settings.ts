export interface OrgSettings {
  name: string;
  logoUrl: string;
  address: string;
  contactNumber: string;
  email: string;
  timeZone: string;
  academicYear: string;
}

export interface AttendanceRules {
  officeStartTime: string;
  officeEndTime: string;
  gracePeriodMins: number;
  minWorkingHours: number;
  halfDayThresholdHours: number;
  overtimeThresholdHours: number;
  weekendPolicy: string;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDurationMins: number;
  assignedDepartments: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'NATIONAL' | 'INSTITUTIONAL' | 'FESTIVAL';
  description: string;
}

export interface UserRole {
  roleName: string;
  description: string;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ipAddress: string;
  device: string;
}
