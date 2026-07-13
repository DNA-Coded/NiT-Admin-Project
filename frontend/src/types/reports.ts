export interface ReportItem {
  id: string;
  name: string;
  type: string; // e.g. Daily Attendance, Department Summary
  dateRange: string; // e.g. Jun 1 - Jun 28, 2026
  generatedBy: string; // e.g. Dr. Sarah Chen
  lastGenerated: string; // e.g. June 28, 2026 10:15 AM
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  sizeBytes?: string;
  recordsCount?: number;
  description?: string;
}

export interface ReportFilterState {
  dateRange: string;
  department: string;
  employeeType: string;
  status: string;
  shift: string;
  device: string;
  reportType: string;
  search: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface KPIMetrics {
  avgAttendance: string;
  attendanceGrowth: string;
  lateArrivals: number;
  lateArrivalsGrowth: string;
  overtimeHours: string;
  overtimeHoursGrowth: string;
  unplannedLeaveRate: string;
  unplannedLeaveGrowth: string;
}
