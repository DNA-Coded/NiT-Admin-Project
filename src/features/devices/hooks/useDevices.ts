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

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await deviceService.getDevices({
        page,
        limit,
        search: filters.search || undefined,
        building: filters.building || undefined,
        deviceCategory: filters.deviceCategory || undefined,
        status: filters.status || undefined,
        isActive: filters.isActive || undefined,
      });
      setDevices(mapDeviceList(res.data.devices));
      setMeta(res.data.pagination);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch devices';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters.search, filters.building, filters.deviceCategory, filters.status, filters.isActive]);

  // Debounce search/filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDevices();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [fetchDevices]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.building, filters.deviceCategory, filters.status, filters.isActive]);

  const createDevice = async (data: CreateDeviceDTO) => {
    try {
      setIsMutating(true);
      await deviceService.createDevice(data);
      await fetchDevices();
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create device');
    } finally {
      setIsMutating(false);
    }
  };

  const updateDevice = async (id: string, data: UpdateDeviceDTO) => {
    try {
      setIsMutating(true);
      await deviceService.updateDevice(id, data);
      await fetchDevices();
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update device');
    } finally {
      setIsMutating(false);
    }
  };

  const updateDeviceStatus = async (id: string, status: string) => {
     try {
      setIsMutating(true);
      await deviceService.updateDeviceStatus(id, status);
      await fetchDevices();
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update device status');
    } finally {
      setIsMutating(false);
    }
  }

  const removeDevice = async (id: string) => {
    try {
      setIsMutating(true);
      await deviceService.deleteDevice(id);
      await fetchDevices();
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to deactivate device');
    } finally {
      setIsMutating(false);
    }
  };

  const recoverDevice = async (id: string) => {
    try {
      setIsMutating(true);
      await deviceService.restoreDevice(id);
      await fetchDevices();
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to restore device');
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
    setFilters,
    page,
    setPage,
    isMutating,
    createDevice,
    updateDevice,
    updateDeviceStatus,
    removeDevice,
    recoverDevice,
    refetch: fetchDevices,
  };
}
