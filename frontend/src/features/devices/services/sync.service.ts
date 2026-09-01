import { apiClient } from '@/services/api/client';
import type { 
  SyncHistoryResponse, 
  GetSyncHistoryQueryParams, 
  StartSyncPayload, 
  SyncJobDTO 
} from '../types/sync.api.types';

export const syncService = {
  getSyncHistory: async (params?: GetSyncHistoryQueryParams) => {
    const response = await apiClient.get<{ data: SyncHistoryResponse }>('/sync', { params });
    return response.data.data;
  },

  getDeviceSyncHistory: async (deviceId: string, params?: GetSyncHistoryQueryParams) => {
    const response = await apiClient.get<{ data: SyncHistoryResponse }>(`/sync/device/${deviceId}`, { params });
    return response.data.data;
  },

  getLatestSync: async (deviceId: string) => {
    const response = await apiClient.get<{ data: SyncJobDTO }>('/sync/latest', { params: { deviceId } });
    return response.data.data;
  },

  startSync: async (payload: StartSyncPayload) => {
    const response = await apiClient.post<{ data: SyncJobDTO }>('/sync/start', payload);
    return response.data.data;
  },

  retrySync: async (id: string) => {
    const response = await apiClient.post<{ data: SyncJobDTO }>(`/sync/${id}/retry`);
    return response.data.data;
  },

  getSyncJob: async (id: string) => {
    const response = await apiClient.get<{ data: SyncJobDTO }>(`/sync/${id}`);
    return response.data.data;
  }
};
