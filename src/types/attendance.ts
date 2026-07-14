export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';

export interface BreakSession {
  id: string;
  breakStart: string;
  breakEnd: string;
  durationMins: number;
}

export interface AttendanceRecord {
  id: string; // Record ID (e.g. ATT001)
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  date: string; // e.g. 2026-06-28
  firstIn: string | null; // e.g. 08:45 AM
  lastOut: string | null; // e.g. 05:15 PM
  totalHours: string; // e.g. 8h 30m
  lateArrival: boolean;
  earlyExit: boolean;
  status: AttendanceStatus;
  deviceUsed: string | null;
  shift: string; // e.g. Regular (09:00 AM - 05:00 PM)
  breakSessions: BreakSession[];
  notes?: string;
  attendanceType?: 'IN' | 'OUT';
  remarks?: string | null;
  attendanceCode?: string;
  correctionHistory?: {
    correctionReason: string;
    correctedAt: string;
    correctedBy: string;
    originalStatus: string;
    originalAttendanceType: string;
    originalRemarks: string | null;
  }[];
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
