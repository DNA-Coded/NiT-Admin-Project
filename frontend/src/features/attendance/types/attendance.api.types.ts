import type { AttendanceStatus } from '@/types/attendance';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GetAttendanceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  device?: string;
  status?: string;
  attendanceDate?: string;
  startDate?: string;
  endDate?: string;
  view?: 'raw' | 'daily';
  isActive?: string;
}

export interface CorrectAttendancePayload {
  status?: AttendanceStatus;
  attendanceType?: 'CHECK_IN' | 'CHECK_OUT';
  remarks?: string;
  correctionReason: string;
}

export interface DailyAttendanceDTO {
  id: string;
  employee: {
    id: string;
    fullName: string;
    employeeId: string;
    department?: string;
    designation?: string;
  };
  attendanceDate: string;
  firstIn: string;
  lastOut: string;
  totalHours: string;
  status: string;
}

export interface AttendanceDTO {
  id: string;
  attendanceCode?: string;
  attendanceIdentity?: string;
  attendanceType?: 'IN' | 'OUT' | 'CHECK_IN' | 'CHECK_OUT';
  attendanceDate: string;
  attendanceTime?: string;
  timestamp?: string;
  status: AttendanceStatus;
  remarks?: string | null;
  person?: {
    id: string;
    fullName?: string;
    employeeId?: string;
    department?: { name?: string; code?: string };
  };
  device?: { deviceName?: string };
  correctionHistory?: any[];
}

export interface AttendanceListResponse {
  records?: DailyAttendanceDTO[];
  attendance?: AttendanceDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}