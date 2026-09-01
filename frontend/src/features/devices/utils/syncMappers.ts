import type { DeviceActivity } from '@/types/devices';
import type { SyncJobDTO } from '../types/sync.api.types';
import { formatDate } from '@/utils/formatters';

export function mapSyncJobToActivity(dto: SyncJobDTO): DeviceActivity {
  let status: DeviceActivity['status'];
  if (dto.status === 'SUCCESS') {
    status = 'SUCCESS';
  } else if (dto.status === 'FAILED') {
    status = 'FAILED';
  } else {
    status = 'WARNING';
  }

  let description = '';
  if (dto.status === 'SUCCESS') {
    description = `Synchronized ${dto.recordsProcessed} records successfully.`;
  } else if (dto.status === 'FAILED') {
    const errorMsg = dto.error?.message || dto.error || 'Unknown error occurred.';
    description = `Failed after ${dto.retryCount} retries. Error: ${errorMsg}`;
  } else if (dto.status === 'RUNNING') {
    description = `Synchronization in progress...`;
  } else {
    description = `Synchronization pending.`;
  }

  const displayTime = dto.startedAt ? formatDate(dto.startedAt) : 'N/A';

  return {
    id: dto.id || dto.syncId,
    timestamp: displayTime,
    deviceName: dto.device?.deviceName || dto.device?.deviceCode || 'Unknown Device',
    deviceId: dto.device?.id || '',
    event: `Data Sync ${dto.status}`,
    status,
    description,
  };
}
