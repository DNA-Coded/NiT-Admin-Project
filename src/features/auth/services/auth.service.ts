import { apiClient } from '@/services/api/client';
import type { AuthResponse, MeResponse, StandardSuccess } from '@/types/auth.types';

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<StandardSuccess> => {
    const response = await apiClient.post<StandardSuccess>('/auth/logout');
    return response.data;
  },

  getMe: async (): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>('/auth/me');
    return response.data;
  }
};
