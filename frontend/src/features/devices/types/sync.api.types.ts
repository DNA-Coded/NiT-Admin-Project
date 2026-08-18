import type { PaginationMeta } from './device.api.types';

export interface SyncJobDTO {
  id: string;
  syncId: string;
  device: {
    id: string;
    deviceCode: string;
    deviceName: string;
  } | null;
  provider: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  source: 'MANUAL' | 'SCHEDULED' | 'SYSTEM';
  startedAt: string | null;
  completedAt: string | null;
  lastSyncedTimestamp: string | null;
  recordsFetched: number;
  recordsProcessed: number;
  recordsFailed: number;
  retryCount: number;
  duration: number | null;
  error: any | null;
  metadata: any | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetSyncHistoryQueryParams {
  page?: number;
  limit?: number;
  deviceId?: string;
  status?: string;
  source?: string;
  provider?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SyncHistoryResponse {
  history: SyncJobDTO[];
  pagination: PaginationMeta;
}

export interface StartSyncPayload {
  deviceId: string;
  provider?: string;
  source?: string;
}
