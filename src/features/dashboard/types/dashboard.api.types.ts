export interface DashboardOverviewResponse {
  summary: {
    totalDepartments: number;
    totalFaculty: number;
    totalDevices: number;
  };
  devices: {
    online: number;
    offline: number;
    maintenance: number;
    healthy: number;
    warning: number;
    error: number;
  };
  attendance: {
    today: number;
    present: number;
    absent: number;
    corrected: number;
    manual: number;
  };
  synchronization: {
    lastSync: string | null;
    pendingJobs: number;
    failedJobs: number;
    queueSize: number;
  };
}

export interface LiveAttendanceDocs {
  personName: string;
  personType: string;
  attendanceType: 'IN' | 'OUT';
  verificationMethod: string;
  timestamp: string;
  deviceName: string;
}

export interface DashboardLiveResponse {
  latestAttendance: LiveAttendanceDocs[];
  activeDevices: any[];
  failedDevices: any[];
  recentCorrections: any[];
  activeSyncJobs: any[];
  recentSystemEvents: any[];
}

export interface DashboardAnalyticsResponse {
  attendance: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  departments: Array<{
    department: string;
    totalFaculty: number;
    attendancePercentage: number;
  }>;
  faculty: {
    total: number;
    active: number;
    inactive: number;
  };
  devices: {
    total: number;
    online: number;
    offline: number;
    maintenance: number;
    healthy: number;
    warning: number;
    error: number;
  };
  synchronization: {
    totalJobs: number;
    successfulJobs: number;
    failedJobs: number;
    pendingJobs: number;
    retryJobs: number;
  };
}
