export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Ad-hoc';
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'RETIRED' | 'SUSPENDED';

export interface AssignedDevice {
  id: string;
  name: string;
  location: string;
}

export interface AttendanceSummary {
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
}

export interface Employee {
  id: string; // Internal database _id
  employeeId: string; // Institution-assigned staff number (unique)
  name: string; // Full name
  email: string;
  phone: string;
  department: string;
  designation: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  joiningDate: string;
  avatarUrl?: string;
  biometricDevice: AssignedDevice | null;
  attendanceIdentity: string; // Backend biometric identifier
  isActive: boolean; // Active or soft-deleted
  attendanceSummary: AttendanceSummary;
}

export interface FilterState {
  search: string;
  department: string;
  designation: string;
  employmentType: string;
  status: string;
  isActive?: string;
}
