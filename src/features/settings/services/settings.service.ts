import { apiClient } from '@/services/api/client';
import type { SettingsResponse, UpdateSettingsPayload, SettingsUpdateResponse } from '../types/settings.api.types';

export const settingsService = {
  getSettings: async (): Promise<SettingsResponse> => {
    const response = await apiClient.get<SettingsResponse>('/settings');
    return response.data;
  },

  updateSettings: async (payload: UpdateSettingsPayload): Promise<SettingsUpdateResponse> => {
    const response = await apiClient.put<SettingsUpdateResponse>('/settings', payload);
    return response.data;
  },

  resetSettings: async (): Promise<SettingsUpdateResponse> => {
    const response = await apiClient.post<SettingsUpdateResponse>('/settings/reset', {});
    return response.data;
  }
};
