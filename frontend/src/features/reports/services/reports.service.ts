import { apiClient } from '@/services/api/client';

import type { 
  GenerateReportParams, 
  ReportSummaryResponse, 
  ActivityListResponse,
  GetActivitiesParams
} from '../types/reports.api.types';

export const reportsService = {
  generateReport: async (type: string, params?: GenerateReportParams) => {
    // Map report types to endpoints
    let endpoint = '/reports/attendance';
    switch (type) {
      case 'Faculty':
      case 'Department Summary':
        endpoint = '/reports/faculty';
        break;
      case 'Device':
      case 'Device Health':
        endpoint = '/reports/devices';
        break;
      case 'Synchronization':
      case 'Synchronization Summary':
        endpoint = '/reports/synchronization';
        break;
      case 'Attendance':
      case 'Daily Attendance':
      case 'Monthly Attendance':
      case 'Employee Attendance':
      case 'Payroll Summary':
      default:
        endpoint = '/reports/attendance';
        break;
    }
    const response = await apiClient.get<{ data: ReportSummaryResponse }>(endpoint, { params });
    return response.data.data;
  },

  getReportLogs: async (params?: GetActivitiesParams) => {
    // Default filter for report activities
    const queryParams = { ...params, module: 'REPORT' };
    
    // If search is provided, we can use the /activity/search endpoint, but we also want module filtering.
    // The filterActivities endpoint in backend doesn't support $text search directly, but we'll try sending it.
    // Actually, we'll just use /activity/filter for now since it filters by module.
    const response = await apiClient.get<{ data: ActivityListResponse }>('/activity/filter', { params: queryParams });
    return response.data.data;
  }
};
