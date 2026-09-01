import type { KPIStats, LiveAttendanceEvent, DepartmentSummary, AttendanceOverview, OnCampusEmployee } from '@/types/dashboard';

export const mockKPIStats: KPIStats = {
  totalEmployees: 1240,
  presentToday: 1102,
  absentToday: 84,
  lateArrivals: 54,
  insideCampus: 1098,
  devicesOnline: 12,
  totalDevices: 12,
};

export const mockLiveAttendanceEvents: LiveAttendanceEvent[] = [
  { id: '1', employeeName: 'Arindam Das', department: 'Science Dept', time: '08:42:15 AM', event: 'IN' },
  { id: '2', employeeName: 'Mousomi Mitra', department: 'Computer Science', time: '08:40:02 AM', event: 'IN' },
  { id: '3', employeeName: 'Chandrima Chakrabarty', department: 'Administration', time: '08:35:44 AM', event: 'OUT' },
  { id: '4', employeeName: 'Nivriti Pandey', department: 'Arts Dept', time: '08:30:11 AM', event: 'IN' },
  { id: '5', employeeName: 'Pranjal Gupta', department: 'Literature', time: '08:15:00 AM', event: 'IN' },
];

export const mockDepartmentSummaries: DepartmentSummary[] = [
  { id: '1', name: 'Computer Science', presentPercentage: 96.5, absentPercentage: 3.5, trend: 'UP' },
  { id: '2', name: 'Administration', presentPercentage: 98.2, absentPercentage: 1.8, trend: 'FLAT' },
  { id: '3', name: 'Science Dept', presentPercentage: 85.0, absentPercentage: 15.0, trend: 'DOWN' },
];

export const mockAttendanceOverview: AttendanceOverview = {
  present: 1102,
  absent: 84,
  late: 54,
  onLeave: 20,
  totalPercentage: 80,
};

export const mockOnCampusEmployees: OnCampusEmployee[] = [
  { id: '1', name: 'David Miller', department: 'Computer Science', timeIn: '07:55 AM' },
  { id: '2', name: 'Jessica Lee', department: 'Administration', timeIn: '08:02 AM' },
  { id: '3', name: 'Robert Taylor', department: 'Maintenance', timeIn: '06:30 AM' },
  { id: '4', name: 'Prof. John Smith', department: 'Physics', timeIn: '08:10 AM' },
];
