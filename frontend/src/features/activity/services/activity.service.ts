import { apiClient } from '@/services/api/client';
import type { ActivityListResponse, ActivityDetailResponse, ActivityAPIParams } from '../types/activity.api.types';

export const activityService = {
  getActivities: async (params: ActivityAPIParams): Promise<ActivityListResponse> => {
    // If search keyword is provided, use the search endpoint
    if (params.q) {
      const response = await apiClient.get<ActivityListResponse>('/activity/search', { params });
      return response.data;
    }
    
    // Check if there are any filters applied (other than pagination/sorting)
    const hasFilters = Object.keys(params).some(
      (key) => !['page', 'limit', 'sortBy', 'sortOrder'].includes(key) && params[key as keyof ActivityAPIParams] !== undefined && params[key as keyof ActivityAPIParams] !== ''
    );

    // If filters are applied, use the filter endpoint
    if (hasFilters) {
      const response = await apiClient.get<ActivityListResponse>('/activity/filter', { params });
      return response.data;
    }

    // Otherwise use standard list endpoint
    const response = await apiClient.get<ActivityListResponse>('/activity', { params });
    return response.data;
  },

  getActivityById: async (id: string): Promise<ActivityDetailResponse> => {
    const response = await apiClient.get<ActivityDetailResponse>(`/activity/${id}`);
    return response.data;
  }
};
