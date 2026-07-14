import { useState, useCallback, useEffect } from 'react';
import { syncService } from '../services/sync.service';
import { mapSyncJobToActivity } from '../utils/syncMappers';
import type { DeviceActivity } from '@/types/devices';
import type { GetSyncHistoryQueryParams } from '../types/sync.api.types';

export function useSync() {
  const [activities, setActivities] = useState<DeviceActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: GetSyncHistoryQueryParams = {
        page,
        limit: meta.limit,
      };

      const res = await syncService.getSyncHistory(params);
      
      const mapped = res.history.map(mapSyncJobToActivity);
      setActivities(mapped);
      setMeta({
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
        limit: res.pagination.limit,
      });
    } catch (err) {
      console.error('Failed to fetch sync history', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, meta.limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const triggerSync = async (deviceId: string, provider: string) => {
    try {
      setLoading(true);
      await syncService.startSync({
        deviceId,
        provider,
        source: 'MANUAL'
      });
      // After triggering, immediately fetch history to show it as PENDING/RUNNING
      await fetchHistory();
    } catch (err) {
      console.error('Failed to start sync', err);
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
      console.error('Failed to retry sync', err);
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
