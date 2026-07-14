import { apiClient } from '@/services/api/client';
import type { 
  DeviceListResponse, 
  DeviceDetailResponse, 
  CreateDeviceDTO, 
  UpdateDeviceDTO,
  GetDevicesParams
} from '../types/device.api.types';

const BASE_URL = '/devices';

export const deviceService = {
  getDevices: async (params?: GetDevicesParams) => {
    const response = await apiClient.get<DeviceListResponse>(BASE_URL, { params });
    return response.data;
  },

  getDeviceById: async (id: string) => {
    const response = await apiClient.get<DeviceDetailResponse>(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  createDevice: async (data: CreateDeviceDTO) => {
    const response = await apiClient.post<DeviceDetailResponse>(BASE_URL, data);
    return response.data.data;
  },

  updateDevice: async (id: string, data: UpdateDeviceDTO) => {
    const response = await apiClient.put<DeviceDetailResponse>(`${BASE_URL}/${id}`, data);
    return response.data.data;
  },

  updateDeviceStatus: async (id: string, status: string) => {
    const response = await apiClient.patch<DeviceDetailResponse>(`${BASE_URL}/${id}/status`, { status });
    return response.data.data;
  },

  deleteDevice: async (id: string) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  restoreDevice: async (id: string) => {
    const response = await apiClient.patch<DeviceDetailResponse>(`${BASE_URL}/${id}/restore`);
    return response.data.data;
  },
};
