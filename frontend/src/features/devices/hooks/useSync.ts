import { useState, useCallback, useEffect } from 'react';
import { syncService } from '../services/sync.service';
import { mapSyncJobToActivity } from '../utils/syncMappers';
import type { DeviceActivity } from '@/types/devices';
import type { GetSyncHistoryQueryParams } from '../types/sync.api.types';

const DEFAULT_LIMIT = 10;

export function useSync(deviceId?: string) {
  const [activities, setActivities] = useState<DeviceActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: DEFAULT_LIMIT });

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: GetSyncHistoryQueryParams = {
        page,
        limit: DEFAULT_LIMIT,
      };

      // Selectively use device-scoped analytics endpoints if provided
      const res = deviceId 
        ? await syncService.getDeviceSyncHistory(deviceId, params)
        : await syncService.getSyncHistory(params);
      
      setActivities(res.history.map(mapSyncJobToActivity));
      setMeta({
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
        limit: res.pagination.limit,
      });
    } catch (err) {
      console.error('Failed to capture sync telemetry logs:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, deviceId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const triggerSync = async (targetDeviceId: string, provider: string) => {
    try {
      setLoading(true);
      await syncService.startSync({ deviceId: targetDeviceId, provider, source: 'MANUAL' });
      await fetchHistory();
    } catch (err) {
      console.error('Failed to start sync execution path:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const retrySync = async (syncId: string) => {
    try {
      setLoading(true);
      await syncService.retrySync(syncId);
      await fetchHistory();
    } catch (err) {
      console.error('Failed to dispatch retry event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    loading,
    error,
    page,
    setPage,
    meta,
    fetchHistory,
    triggerSync,
    retrySync,
  };
}