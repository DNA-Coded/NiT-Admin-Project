export type PayrollReviewStatus = 'VERIFIED' | 'PENDING' | 'FLAGGED';

export interface PayrollRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  employmentType: string;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  halfDays: number;
  overtimeHours: number;
  lateArrivals: number;
  attendanceStatus: string; // e.g. Present / Late / Leave
  reviewStatus: PayrollReviewStatus;
  exceptionsCount: number;
  notes?: string;
}

export interface PayrollSummary {
  employeesProcessed: number;
  pendingReviews: number;
  overtimeHours: number;
  totalLateArrivals: number;
  halfDays: number;
  unapprovedExceptions: number;
}

export interface PayrollFilterState {
  payrollMonth: string;
  department: string;
  employeeSearch: string;
  employmentType: string;
  attendanceStatus: string;
  payrollStatus: string;
}

export interface PayrollException {
  id: string;
  employeeName: string;
  employeeId: string;
  type: string; // e.g. Missing Check-Out, Excessive Late Arrivals
  description: string;
  severity: 'critical' | 'warning' | 'info';
}
