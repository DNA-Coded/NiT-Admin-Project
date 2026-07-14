export interface DepartmentRef {
  id: string;
  name: string;
  code: string;
}

export interface DeviceDTO {
  id: string;
  deviceCode: string;
  deviceName: string;
  deviceCategory: string;
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
  assignedDepartment: DepartmentRef | null;
  connectionMode: string;
  heartbeatInterval: number;
  isAttendanceEnabled: boolean;
  isDefaultDevice: boolean;
  status: string;
  healthStatus: string;
  failureCount: number;
  uptime: number;
  downtime: number;
  lastHealthCheck: string | null;
  lastSeen: string | null;
  lastSync: string | null;
  lastHeartbeat: string | null;
  lastError: string | null;
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DeviceListResponse {
  data: {
    devices: DeviceDTO[];
    pagination: PaginationMeta;
  };
}

export interface DeviceDetailResponse {
  data: DeviceDTO;
}

export interface CreateDeviceDTO {
  deviceCode: string;
  deviceName: string;
  deviceCategory: string;
  supportedVerificationMethods: string[];
  manufacturer: string;
  model: string;
  serialNumber: string;
  ipAddress: string;
  macAddress?: string;
  port: number;
  campus?: string;
  building: string;
  floor: string;
  room: string;
  locationDescription?: string;
  firmwareVersion?: string;
  status?: string;
  assignedDepartment?: string;
  connectionMode?: string;
  heartbeatInterval?: number;
  isAttendanceEnabled?: boolean;
  isDefaultDevice?: boolean;
}

export type UpdateDeviceDTO = Partial<CreateDeviceDTO>;

export interface GetDevicesParams {
  page?: number;
  limit?: number;
  search?: string;
  deviceCategory?: string;
  status?: string;
  building?: string;
  floor?: string;
  assignedDepartment?: string;
  isActive?: boolean | string;
}
