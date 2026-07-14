import { apiClient } from '@/services/api/client';
import type {
  GetDepartmentsResponse,
  DepartmentResponse,
  GetDepartmentsParams,
} from '../types/departments.api.types';

export const departmentsService = {
  getDepartments: async (params?: GetDepartmentsParams) => {
    const response = await apiClient.get<GetDepartmentsResponse>('/departments', { params });
    return response.data;
  },

  getDepartmentById: async (id: string) => {
    const response = await apiClient.get<DepartmentResponse>(`/departments/${id}`);
    return response.data.data;
  },

  createDepartment: async (data: { name: string; code: string; description?: string }) => {
    const response = await apiClient.post<DepartmentResponse>('/departments', data);
    return response.data.data;
  },

  updateDepartment: async (id: string, data: { name?: string; code?: string; description?: string }) => {
    const response = await apiClient.put<DepartmentResponse>(`/departments/${id}`, data);
    return response.data.data;
  },

  deleteDepartment: async (id: string) => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  },

  restoreDepartment: async (id: string) => {
    const response = await apiClient.patch<DepartmentResponse>(`/departments/${id}/restore`);
    return response.data.data;
  },
};
