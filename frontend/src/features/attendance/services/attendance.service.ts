import { apiClient } from '@/services/api/client';
import type { 
  ApiResponse,
  AttendanceListResponse, 
  GetAttendanceQueryParams, 
  CorrectAttendancePayload,
  AttendanceDTO
} from '../types/attendance.api.types';
import type { AttendanceSummary } from '@/types/attendance';

export const attendanceService = {
  getAttendance: async (params?: GetAttendanceQueryParams) => {
    const response = await apiClient.get<ApiResponse<AttendanceListResponse>>('/attendance', {
      params,
    });
    return response.data;
  },

  getSummary: async (date?: string) => {
    const response = await apiClient.get<ApiResponse<AttendanceSummary>>('/attendance/summary', {
      params: { date },
    });
    return response.data;
  },

  getAttendanceById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<AttendanceDTO>>(`/attendance/${id}`);
    return response.data;
  },

  correctAttendance: async (id: string, payload: CorrectAttendancePayload) => {
    const response = await apiClient.patch<ApiResponse<AttendanceDTO>>(`/attendance/${id}/correct`, payload);
    return response.data;
  },

  deleteAttendance: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/attendance/${id}`);
    return response.data;
  },

  restoreAttendance: async (id: string) => {
    const response = await apiClient.patch<ApiResponse<AttendanceDTO>>(`/attendance/${id}/restore`);
    return response.data;
  }
};