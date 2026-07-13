export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Ad-hoc';
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';

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
  id: string; // e.g. NIT-EMP-1042
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  joiningDate: string;
  avatarUrl?: string;
  biometricDevice: AssignedDevice | null;
  attendanceSummary: AttendanceSummary;
}

export interface FilterState {
  search: string;
  department: string;
  designation: string;
  employmentType: string;
  status: string;
}
