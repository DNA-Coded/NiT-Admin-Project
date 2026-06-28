export type DeviceType = 'FINGERPRINT' | 'FACE' | 'HYBRID';
export type DeviceHealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL';

export interface Device {
  id: string;
  name: string;
  building: string;
  floor: string;
  room: string;
  department: string;
  deviceType: DeviceType;
  status: 'ONLINE' | 'OFFLINE' | 'ERROR';
  lastSync: string;
  firmwareVersion: string;
  ipAddress: string;
  totalEventsToday: number;
  healthStatus: DeviceHealthStatus;
  serialNumber: string;
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
