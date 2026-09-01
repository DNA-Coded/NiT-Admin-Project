import type { PaginationMeta } from '@/features/devices/types/device.api.types';

export interface GenerateReportParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  department?: string;
  device?: string;
  designation?: string;
  status?: string;
  attendanceType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ActivityLogDTO {
  _id: string;
  activityId: string;
  module: string;
  action: string;
  status: string;
  severity: string;
  description: string;
  performedBy: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export interface GetActivitiesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  module?: string;
  action?: string;
  status?: string;
  search?: string;
}

export interface ActivityListResponse {
  activities: ActivityLogDTO[];
  pagination: PaginationMeta;
}

export interface ReportSummaryResponse {
  filters: any;
  summary: any;
  data: any[];
  pagination: PaginationMeta;
}
