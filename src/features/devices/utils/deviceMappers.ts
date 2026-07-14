import type { DeviceDTO } from '../types/device.api.types';
import type { Device, DeviceCategory, DeviceHealthStatus } from '@/types/devices';
import { formatDate } from '@/utils/formatters';

export function mapDeviceDTOToDevice(dto: DeviceDTO): Device {
  return {
    id: dto.id,
    deviceCode: dto.deviceCode,
    deviceName: dto.deviceName,
    deviceCategory: dto.deviceCategory as DeviceCategory,
    supportedVerificationMethods: dto.supportedVerificationMethods || [],
    manufacturer: dto.manufacturer || 'Unknown',
    model: dto.model || 'Unknown',
    serialNumber: dto.serialNumber,
    firmwareVersion: dto.firmwareVersion || 'Unknown',
    ipAddress: dto.ipAddress,
    macAddress: dto.macAddress || 'Unknown',
    port: dto.port,
    campus: dto.campus || 'Main Campus',
    building: dto.building,
    floor: dto.floor,
    room: dto.room,
    locationDescription: dto.locationDescription || '',
    assignedDepartment: dto.assignedDepartment?.name || 'Unassigned',
    connectionMode: dto.connectionMode || 'PUSH',
    heartbeatInterval: dto.heartbeatInterval || 5,
    isAttendanceEnabled: dto.isAttendanceEnabled,
    isDefaultDevice: dto.isDefaultDevice,
    status: (dto.status as any) || 'OFFLINE',
    healthStatus: (dto.healthStatus as DeviceHealthStatus) || 'OFFLINE',
    failureCount: dto.failureCount || 0,
    uptime: dto.uptime || 0,
    downtime: dto.downtime || 0,
    lastHealthCheck: dto.lastHealthCheck ? formatDate(dto.lastHealthCheck) : 'Never',
    lastSeen: dto.lastSeen ? formatDate(dto.lastSeen) : 'Never',
    lastSync: dto.lastSync ? formatDate(dto.lastSync) : 'Never',
    lastHeartbeat: dto.lastHeartbeat ? formatDate(dto.lastHeartbeat) : 'Never',
    lastError: dto.lastError || '',
    isActive: dto.isActive,
    
    // Fallbacks
    totalEventsToday: 0,
    installationDate: dto.createdAt ? formatDate(dto.createdAt) : 'Unknown',
    lastPing: 'N/A',
  };
}

export function mapDeviceList(dtos: DeviceDTO[]): Device[] {
  return dtos.map(mapDeviceDTOToDevice);
}
