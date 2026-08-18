import { useState, useCallback, useEffect } from 'react';
import { deviceService } from '../services/device.service';
import { mapDeviceList } from '../utils/deviceMappers';
import type { Device } from '@/types/devices';
import type { PaginationMeta, CreateDeviceDTO, UpdateDeviceDTO } from '../types/device.api.types';

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    building: '',
    deviceCategory: '',
    status: '',
    isActive: '',
  });

  const [isMutating, setIsMutating] = useState(false);

  // Unified data access channel
  // Inside useDevices hook
  const fetchDevices = useCallback(async (targetPage = page, activeFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const res = await deviceService.getDevices({
        page: targetPage,
        limit,
        search: activeFilters.search || undefined,
        building: activeFilters.building || undefined,
        deviceCategory: activeFilters.deviceCategory || undefined,
        status: activeFilters.status || undefined,
        isActive: activeFilters.isActive || undefined,
      });
      
      // Fix: Access properties directly on 'res'
      setDevices(mapDeviceList(res.devices)); 
      setMeta(res.pagination);
      
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch devices';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [limit, page, filters]);

  // Debounce search and filter executions accurately
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDevices(page, filters);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [page, filters, fetchDevices]);

  // Safe wrapper for modifying filters without causing layout loops
  const updateFilters = useCallback((updater: Partial<typeof filters> | ((prev: typeof filters) => typeof filters)) => {
    setFilters((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
    setPage(1); // Page reset happens atomically inside the same frame
  }, []);

  // Structural mutations (Create, Update, Delete)
  const runMutation = async (mutationFn: () => Promise<any>) => {
    try {
      setIsMutating(true);
      await mutationFn();
      await fetchDevices(page, filters);
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Mutation failed');
    } finally {
      setIsMutating(false);
    }
  };

  return {
    devices,
    meta,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    page,
    setPage,
    isMutating,
    createDevice: (data: CreateDeviceDTO) => runMutation(() => deviceService.createDevice(data)),
    updateDevice: (id: string, data: UpdateDeviceDTO) => runMutation(() => deviceService.updateDevice(id, data)),
    updateDeviceStatus: (id: string, status: string) => runMutation(() => deviceService.updateDeviceStatus(id, status)),
    removeDevice: (id: string) => runMutation(() => deviceService.deleteDevice(id)),
    recoverDevice: (id: string) => runMutation(() => deviceService.restoreDevice(id)),
    refetch: () => fetchDevices(page, filters),
  };
}