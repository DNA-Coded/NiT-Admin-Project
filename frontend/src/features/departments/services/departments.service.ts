// src/services/departments.service.ts
import { apiClient } from '@/services/api/client';
import type {
  GetDepartmentsParams,
  DepartmentDTO,
  PaginationMeta,
} from '../types/departments.api.types';

export interface DepartmentFetchResult {
  departments: DepartmentDTO[];
  pagination: PaginationMeta | null;
}

export const departmentsService = {
  getDepartments: async (params?: GetDepartmentsParams): Promise<DepartmentFetchResult> => {
    const response = await apiClient.get('/departments', { params });
    const payload = response.data;

    // Handle payload whether data is directly an array or nested inside object
    const rawList = Array.isArray(payload?.data) 
      ? payload.data 
      : payload?.data?.departments || [];

    const paginationMeta = payload?.pagination || payload?.data?.pagination || null;

    return {
      departments: rawList,
      pagination: paginationMeta,
    };
  },

  getDepartmentById: async (id: string) => {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data?.data;
  },

  createDepartment: async (data: { name: string; code: string; description?: string }) => {
    const response = await apiClient.post('/departments', data);
    return response.data?.data;
  },

  updateDepartment: async (id: string, data: { name?: string; code?: string; description?: string }) => {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response.data?.data;
  },

  deleteDepartment: async (id: string) => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  },

  restoreDepartment: async (id: string) => {
    const response = await apiClient.patch(`/departments/${id}/restore`);
    return response.data?.data;
  },
};