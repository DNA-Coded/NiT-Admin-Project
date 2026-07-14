export interface AttendanceCorrectionHistoryDTO {
  correctionReason: string;
  correctedAt: string;
  correctedBy: string;
  originalStatus: string;
  originalAttendanceType: string;
  originalRemarks: string | null;
}

export interface AttendancePersonDTO {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  department: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface AttendanceDeviceDTO {
  id: string;
  deviceCode: string;
  deviceName: string;
  deviceCategory: string;
}

export interface AttendanceDTO {
  id: string;
  attendanceCode: string;
  personType: string;
  person: AttendancePersonDTO | null;
  device: AttendanceDeviceDTO | null;
  verificationMethod: string;
  attendanceType: 'IN' | 'OUT';
  timestamp: string;
  attendanceDate: string;
  attendanceTime: string;
  status: string;
  remarks: string | null;
  correctionHistory: AttendanceCorrectionHistoryDTO[];
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceListResponse {
  attendance: AttendanceDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GetAttendanceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  personType?: string;
  person?: string;
  department?: string;
  device?: string;
  verificationMethod?: string;
  attendanceType?: string;
  status?: string;
  attendanceDate?: string;
  isActive?: boolean | 'true' | 'false' | 'all';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CorrectAttendancePayload {
  status?: string;
  attendanceType?: string;
  remarks?: string;
  correctionReason: string;
}
