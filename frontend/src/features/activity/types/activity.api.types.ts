export interface ActivityFilters {
  module?: string;
  action?: string;
  status?: string;
  severity?: string;
  performedBy?: string;
  from?: string;
  to?: string;
}

export interface ActivityAPIParams extends ActivityFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  q?: string; // Search query
}

export interface ActivityUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface ActivityLogAPI {
  _id: string;
  activityId: string;
  module: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description: string;
  performedBy?: string | ActivityUser; // Could be object ID or populated object
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
}

export interface ActivityListResponse {
  success: boolean;
  message: string;
  data: ActivityLogAPI[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ActivityDetailResponse {
  success: boolean;
  message: string;
  data: ActivityLogAPI;
}

// Frontend facing domain model
export interface ActivityItem {
  id: string;
  activityId: string;
  module: string;
  action: string;
  description: string;
  performedBy: string; // resolved to a display string
  timestamp: string; // mapped from createdAt
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  entityType?: string;
  entityId?: string;
}
