import { useState, useEffect, useMemo } from 'react';
import type { Device, DeviceActivity, DeviceSummary } from '@/types/devices';

import { DeviceSummaryCards } from '@/features/devices/components/DeviceSummaryCards';
import { DeviceGrid } from '@/features/devices/components/DeviceGrid';
import { DeviceDrawer } from '@/features/devices/components/DeviceDrawer';
import { DeviceActivityTable } from '@/features/devices/components/DeviceActivityTable';
import { CampusDeviceLayout } from '@/features/devices/components/CampusDeviceLayout';
import { DeviceAlertsPanel } from '@/features/devices/components/DeviceAlertsPanel';
import { useDevices } from '@/features/devices/hooks/useDevices';
import { AddDeviceDialog } from '@/features/devices/components/AddDeviceDialog';
import { EditDeviceDialog } from '@/features/devices/components/EditDeviceDialog';
import { departmentsService } from '@/features/departments/services/departments.service';
import { mockDeviceActivities } from '@/mocks/devices';

export default function Devices() {
  const {
    devices,
    meta,
    loading,
    filters,
    setFilters,
    page,
    setPage,
    isMutating,
    createDevice,
    updateDevice,
    removeDevice,
    recoverDevice,
  } = useDevices();

  const [activities] = useState<DeviceActivity[]>(mockDeviceActivities);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);

  // We extract unique buildings dynamically from the current page of devices,
  // or we could use a static list if the backend provided it. For now, we'll
  // extract what we have on the current page to allow some filtering.
  const uniqueBuildings = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.building))).filter(Boolean).sort();
  }, [devices]);

  useEffect(() => {
    departmentsService.getDepartments({ limit: 100, isActive: 'true' })
      .then((res) => setDepartments(res.data.map(d => ({ id: d.id, name: d.name }))))
      .catch(() => console.error('Failed to load departments'));
  }, []);

  // Update selected device if it changes in the background
  useEffect(() => {
    if (selectedDevice) {
      const updated = devices.find(d => d.id === selectedDevice.id);
      if (updated) setSelectedDevice(updated);
    }
  }, [devices, selectedDevice]);

  const handleSearchChange = (val: string) => setFilters(p => ({ ...p, search: val }));
  const handleBuildingChange = (val: string) => setFilters(p => ({ ...p, building: val }));

  // Calculate dynamic summary
  const summary: DeviceSummary = useMemo(() => {
    return {
      totalDevices: meta?.total || 0,
      onlineDevices: devices.filter(d => d.status === 'ONLINE').length,
      offlineDevices: devices.filter(d => d.status === 'OFFLINE').length,
      warningDevices: devices.filter(d => d.healthStatus === 'WARNING').length,
      totalAttendanceEventsToday: devices.reduce((acc, curr) => acc + curr.totalEventsToday, 0),
      avgSyncDelaySecs: 12, // Still mock or calculated if backend provided
    };
  }, [devices, meta?.total]);

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Biometric Devices</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 font-medium">
            Real-time synchronization status and telemetry logs for all campus biometric units.
          </p>
        </div>
        <div className="flex gap-3 self-start md:self-auto">
          <button
            aria-label="Export device logs"
            className="px-4 py-2 bg-white border border-outline text-primary font-label-md rounded-lg hover:bg-surface-container-low transition-colors shadow-sm"
            onClick={() => alert('Exporting devices list logs... (Simulated Action)')}
          >
            Export Logs
          </button>
          <button
            aria-label="Register new device"
            className="px-4 py-2 bg-primary text-white font-label-md rounded-lg hover:bg-primary-container transition-colors shadow-sm font-bold flex items-center gap-2"
            onClick={() => setIsAddOpen(true)}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Register Device
          </button>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <DeviceSummaryCards summary={summary} />

      {/* Filter Action Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h4 className="font-label-md text-primary font-bold">Active Device Network</h4>
        <div className="flex flex-1 flex-col md:flex-row justify-end items-end gap-3 w-full max-w-xl">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              className="w-full bg-surface border border-outline-variant rounded-lg pl-9 pr-3 py-1.5 font-body-sm text-body-sm focus:border-primary outline-none transition-all"
              placeholder="Search by device, IP or room location..."
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-48">
            <select
              className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-3 py-1.5 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.building}
              onChange={(e) => handleBuildingChange(e.target.value)}
            >
              <option value="">All Buildings</option>
              {uniqueBuildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      <div className="mb-4">
        {loading && devices.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <DeviceGrid devices={devices} onSelect={setSelectedDevice} />
        )}
      </div>

      {/* Pagination Controls */}
      {meta && meta.total > 0 && (
        <div className="mb-8 px-4 py-3 border border-outline-variant rounded-lg bg-white flex items-center justify-between flex-wrap gap-2 shadow-sm">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Showing page {meta.page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous page"
              className="p-1 text-on-surface-variant hover:bg-surface-container rounded disabled:opacity-50 transition-all duration-200"
              disabled={!meta.hasPrevPage || loading}
              onClick={() => setPage(p => p - 1)}
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                aria-label={`Go to page ${p}`}
                className={`w-8 h-8 rounded flex items-center justify-center font-label-sm text-label-sm transition-all duration-200 ${
                  page === p
                    ? 'bg-primary text-white shadow-sm font-bold'
                    : 'text-on-surface hover:bg-surface-container'
                } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              aria-label="Next page"
              className="p-1 text-on-surface-variant hover:bg-surface-container rounded disabled:opacity-50 transition-all duration-200"
              disabled={!meta.hasNextPage || loading}
              onClick={() => setPage(p => p + 1)}
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* Campus Map Topology layout */}
      <div className="mb-8">
        <CampusDeviceLayout devices={devices} onSelect={setSelectedDevice} />
      </div>

      {/* Details logs and alerts panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeviceActivityTable activities={activities} viewState={'success'} />
        </div>
        <div>
          <DeviceAlertsPanel />
        </div>
      </div>

      {/* Details drawer view */}
      <DeviceDrawer
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
        onEditClick={() => setIsEditOpen(true)}
        onDelete={removeDevice}
        onRestore={recoverDevice}
        isMutating={isMutating}
      />

      <AddDeviceDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={createDevice}
        departments={departments}
      />

      <EditDeviceDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onEdit={updateDevice}
        device={selectedDevice}
        departments={departments}
      />
    </div>
  );
}
