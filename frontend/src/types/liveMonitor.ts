import type { AttendanceStatus } from './attendance';

export interface LiveEvent {
  id: string;
  timestamp: string; // e.g. 12:02:40 PM
  employeeName: string;
  employeeId: string;
  department: string;
  deviceName: string;
  deviceLocation: string;
  eventType: 'Check In' | 'Check Out';
  status: AttendanceStatus;
  avatarUrl?: string;
  isNew?: boolean; // For visual flash effects on entry
}

export interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
}

export interface CampusPresence {
  employeeId: string;
  name: string;
  department: string;
  checkInTime: string;
  durationOnCampus: string;
  status: AttendanceStatus;
}
