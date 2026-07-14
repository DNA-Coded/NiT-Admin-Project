import { apiClient } from '@/services/api/client';
import type { 
  AttendanceListResponse, 
  GetAttendanceQueryParams, 
  CorrectAttendancePayload,
  AttendanceDTO
} from '../types/attendance.api.types';

export const attendanceService = {
  getAttendance: async (params?: GetAttendanceQueryParams) => {
    const response = await apiClient.get<{ success: boolean; data: AttendanceListResponse; message: string }>('/attendance', {
      params,
    });
    return response.data;
  },

  getAttendanceById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: AttendanceDTO; message: string }>(`/attendance/${id}`);
    return response.data;
  },

  correctAttendance: async (id: string, payload: CorrectAttendancePayload) => {
    const response = await apiClient.patch<{ success: boolean; data: AttendanceDTO; message: string }>(`/attendance/${id}/correct`, payload);
    return response.data;
  },

  deleteAttendance: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; data: null; message: string }>(`/attendance/${id}`);
    return response.data;
  },

  restoreAttendance: async (id: string) => {
    const response = await apiClient.patch<{ success: boolean; data: AttendanceDTO; message: string }>(`/attendance/${id}/restore`);
    return response.data;
  }
};
