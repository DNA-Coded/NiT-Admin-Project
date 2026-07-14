import { apiClient } from '@/services/api/client';
import type { 
  DashboardOverviewResponse, 
  DashboardLiveResponse, 
  DashboardAnalyticsResponse 
} from '../types/dashboard.api.types';

export const dashboardService = {
  getOverview: async () => {
    const response = await apiClient.get<{ data: DashboardOverviewResponse }>('/dashboard/overview');
    return response.data.data;
  },
  
  getLiveMonitoring: async () => {
    const response = await apiClient.get<{ data: DashboardLiveResponse }>('/dashboard/live');
    return response.data.data;
  },

  getAnalytics: async () => {
    const response = await apiClient.get<{ data: DashboardAnalyticsResponse }>('/dashboard/analytics');
    return response.data.data;
  }
};
