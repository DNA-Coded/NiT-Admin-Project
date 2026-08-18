export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Ad-hoc';
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'RETIRED' | 'SUSPENDED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE' | 'Present' | 'Late' | 'Absent';

export interface AssignedDevice {
  id: string;
  name: string;
  location: string;
}

export interface AttendanceSummary {
  presentToday: number;
  absentToday: number;
  lateArrivals: number;
  earlyDepartures: number;
  avgWorkingHours: string;
}

export interface AttendanceFilterState {
  startDate: string;
  endDate: string;
  department: string;
  employeeSearch: string;
  status: string;
  shift: string;
  device: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  salutation: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  isHOD: boolean;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  joiningDate: string;
  avatarUrl?: string;
  biometricDevice: AssignedDevice | null;
  attendanceIdentity: string;
  isActive: boolean;
  attendanceSummary: AttendanceSummary;
}

export interface FilterState {
  search: string;
  department: string;
  designation: string;
  employmentType: string;
  status: string;
  isActive: string;
  isHOD?: string;
}

export interface BreakSession {
  id: string;
  breakStart: string;
  breakEnd: string;
  durationMins: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  date: string;
  firstIn: string | null;
  lastOut: string | null;
  totalHours: string;
  lateArrival: boolean;
  earlyExit: boolean;
  status: AttendanceStatus;
  deviceUsed: string | null;
  shift: string;
  breakSessions: BreakSession[];
  notes?: string;
  attendanceType?: 'IN' | 'OUT' | 'CHECK_IN' | 'CHECK_OUT';
  remarks?: string | null;
  attendanceCode?: string;
  correctionHistory?: any[];
}