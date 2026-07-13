export interface KPIStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateArrivals: number;
  insideCampus: number;
  devicesOnline: number;
  totalDevices: number;
}

export interface LiveAttendanceEvent {
  id: string;
  employeeName: string;
  department: string;
  time: string;
  event: 'IN' | 'OUT';
}

export interface DepartmentSummary {
  id: string;
  name: string;
  presentPercentage: number;
  absentPercentage: number;
  trend: 'UP' | 'DOWN' | 'FLAT';
}

export interface AttendanceOverview {
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  totalPercentage: number;
}

export interface OnCampusEmployee {
  id: string;
  name: string;
  department: string;
  timeIn: string;
}
