import { useState, useEffect } from 'react';
import {
  mockDeviceSummary,
  mockDevices,
  mockDeviceActivities,
} from '@/mocks/devices';
import type { Device, DeviceActivity } from '@/types/devices';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { DeviceSummaryCards } from '@/features/devices/components/DeviceSummaryCards';
import { DeviceGrid } from '@/features/devices/components/DeviceGrid';
import { DeviceDrawer } from '@/features/devices/components/DeviceDrawer';
import { DeviceActivityTable } from '@/features/devices/components/DeviceActivityTable';
import { CampusDeviceLayout } from '@/features/devices/components/CampusDeviceLayout';
import { DeviceAlertsPanel } from '@/features/devices/components/DeviceAlertsPanel';

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [activities, setActivities] = useState<DeviceActivity[]>(mockDeviceActivities);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [search, setSearch] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');

  // Extract unique building blocks
  const buildings = Array.from(new Set(mockDevices.map((d) => d.building))).sort();

  // Simulate server sync reload
  useEffect(() => {
    setViewState('loading');
    const timer = setTimeout(() => {
      setViewState('success');
    }, 400);
    return () => clearTimeout(timer);
  }, [search, selectedBuilding]);

  // Simulate auto-refresh logs triggers every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      
      const newActivity: DeviceActivity = {
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        deviceName: randomDevice.name,
        deviceId: randomDevice.id,
        event: 'Heartbeat Ping',
        status: 'SUCCESS',
        description: `Subnet handshake success. Ping rate ${Math.floor(Math.random() * 20) + 5}ms.`,
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 14)]);

      // Dynamically increment device check count
      setDevices((prev) =>
        prev.map((d) =>
          d.id === randomDevice.id
            ? { ...d, totalEventsToday: d.totalEventsToday + 1, lastSync: 'Just now' }
            : d
        )
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [devices]);

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      search === '' ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ipAddress.includes(search) ||
      d.room.toLowerCase().includes(search.toLowerCase());

    const matchesBuilding = selectedBuilding === '' || d.building === selectedBuilding;

    return matchesSearch && matchesBuilding;
  });

  const currentViewState =
    viewState === 'success' && filteredDevices.length === 0 ? 'empty' : viewState;

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
            className="px-4 py-2 bg-primary text-white font-label-md rounded-lg hover:bg-primary-container transition-colors shadow-sm font-bold"
            onClick={() => alert('Device registration dialog template... (Simulated Action)')}
          >
            Register Device
          </button>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <DeviceSummaryCards summary={mockDeviceSummary} />

      {/* Filter Action Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h4 className="font-label-md text-primary font-bold">Active Device Network</h4>
        <div className="flex flex-1 flex-col md:flex-row justify-end items-end gap-3 w-full max-w-xl">
          {/* Search IP/Name */}
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              className="w-full bg-surface border border-outline-variant rounded-lg pl-9 pr-3 py-1.5 font-body-sm text-body-sm focus:border-primary outline-none transition-all"
              placeholder="Search by device, IP or room location..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Building Select */}
          <div className="relative w-full md:w-48">
            <select
              className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-3 py-1.5 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
            >
              <option value="">All Buildings</option>
              {buildings.map((b) => (
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
      <div className="mb-8">
        <DeviceGrid devices={filteredDevices} onSelect={setSelectedDevice} />
      </div>

      {/* Campus Map Topology layout */}
      <div className="mb-8">
        <CampusDeviceLayout devices={filteredDevices} onSelect={setSelectedDevice} />
      </div>

      {/* Details logs and alerts panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeviceActivityTable activities={activities} viewState={currentViewState} />
        </div>
        <div>
          <DeviceAlertsPanel />
        </div>
      </div>

      {/* Details drawer view */}
      <DeviceDrawer device={selectedDevice} onClose={() => setSelectedDevice(null)} />
    </div>
  );
}
