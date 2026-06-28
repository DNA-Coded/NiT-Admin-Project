import type { ReportItem, KPIMetrics, ChartDataPoint } from '@/types/reports';

export const mockKPIMetrics: KPIMetrics = {
  avgAttendance: '94.8%',
  attendanceGrowth: '+2.4%',
  lateArrivals: 114,
  lateArrivalsGrowth: '+12%',
  overtimeHours: '842h',
  overtimeHoursGrowth: '-5h',
  unplannedLeaveRate: '3.1%',
  unplannedLeaveGrowth: 'Stable',
};

export const mockMonthlyAttendanceTrend: ChartDataPoint[] = [
  { label: 'JAN', value: 85, secondaryValue: 90 },
  { label: 'FEB', value: 92, secondaryValue: 90 },
  { label: 'MAR', value: 88, secondaryValue: 90 },
  { label: 'APR', value: 95, secondaryValue: 90 },
  { label: 'MAY', value: 82, secondaryValue: 90 },
  { label: 'JUN', value: 89, secondaryValue: 90 },
];

export const mockLateArrivalsByDept: ChartDataPoint[] = [
  { label: 'Computer Science', value: 45 },
  { label: 'Life Sciences', value: 30 },
  { label: 'Administrative', value: 65 },
  { label: 'Library Services', value: 15 },
];

export const mockReportItems: ReportItem[] = [
  {
    id: 'REP-001',
    name: 'CS Block Faculty Attendance Summary (Oct 2023)',
    type: 'Department Summary',
    dateRange: 'Oct 01 - Oct 31, 2023',
    generatedBy: 'Dr. Sarah Chen',
    lastGenerated: 'Oct 31, 2023 05:30 PM',
    status: 'COMPLETED',
    sizeBytes: '2.4 MB',
    recordsCount: 412,
    description: 'Detailed monthly attendance sheets for CS department teaching assistants, lecturers, and professors.',
  },
  {
    id: 'REP-002',
    name: 'Admin Block F1 Biometric Sync Latency Check',
    type: 'Device Health',
    dateRange: 'Jun 20 - Jun 28, 2026',
    generatedBy: 'System Cron',
    lastGenerated: 'Jun 28, 2026 10:15 AM',
    status: 'COMPLETED',
    sizeBytes: '145 KB',
    recordsCount: 24,
    description: 'Latency metrics, offline sync triggers, and transaction counters for Admin Block F1 security hub.',
  },
  {
    id: 'REP-003',
    name: 'Library Staff Shift Overtime Payout Audit',
    type: 'Payroll Attendance Summary',
    dateRange: 'Jun 01 - Jun 25, 2026',
    generatedBy: 'Linda Watson',
    lastGenerated: 'Jun 26, 2026 04:00 PM',
    status: 'COMPLETED',
    sizeBytes: '1.2 MB',
    recordsCount: 98,
    description: 'Detailed work-hours validation, break logs audit, and computed overtime for library services team.',
  },
  {
    id: 'REP-004',
    name: 'Institutional Overtime and Work-Hours Summary',
    type: 'Monthly Attendance',
    dateRange: 'May 01 - May 31, 2026',
    generatedBy: 'Dr. Sarah Chen',
    lastGenerated: 'Jun 01, 2026 09:00 AM',
    status: 'FAILED',
    sizeBytes: '--',
    recordsCount: 0,
    description: 'Aggregated analytics reflecting average weekly hours worked, holiday leaves, and overtime allocations.',
  },
];
