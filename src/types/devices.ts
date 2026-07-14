export type DeviceCategory = 'FINGERPRINT' | 'FACE' | 'HYBRID' | 'RFID';
export type DeviceHealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface Device {
  id: string;
  deviceCode: string;
  deviceName: string;
  deviceCategory: DeviceCategory;
  supportedVerificationMethods: string[];
  manufacturer: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  ipAddress: string;
  macAddress: string;
  port: number;
  campus: string;
  building: string;
  floor: string;
  room: string;
  locationDescription: string;
  assignedDepartment: string;
  connectionMode: string;
  heartbeatInterval: number;
  isAttendanceEnabled: boolean;
  isDefaultDevice: boolean;
  status: 'ONLINE' | 'OFFLINE' | 'ERROR';
  healthStatus: DeviceHealthStatus;
  failureCount: number;
  uptime: number;
  downtime: number;
  lastHealthCheck: string;
  lastSeen: string;
  lastSync: string;
  lastHeartbeat: string;
  lastError: string;
  isActive: boolean;
  
  // Frontend Specific mappings / Fallbacks
  totalEventsToday: number;
  installationDate: string;
  lastPing: string;
}

export interface DeviceSummary {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  totalAttendanceEventsToday: number;
  avgSyncDelaySecs: number;
}

export interface DeviceActivity {
  id: string;
  timestamp: string;
  deviceName: string;
  deviceId: string;
  event: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  description: string;
}
