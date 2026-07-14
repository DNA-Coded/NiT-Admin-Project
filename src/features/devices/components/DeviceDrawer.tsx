import React from 'react';
import type { Device } from '@/types/devices';

interface DeviceDrawerProps {
  device: Device | null;
  onClose: () => void;
  onEditClick: () => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onSync: (deviceId: string, provider: string) => void;
  isMutating?: boolean;
}

export const DeviceDrawer: React.FC<DeviceDrawerProps> = ({ 
  device, 
  onClose,
  onEditClick,
  onDelete,
  onRestore,
  onSync,
  isMutating
}) => {
  if (!device) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-lg z-50 flex flex-col transition-transform duration-300 transform translate-x-0 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-background">Device Details</h3>
          <button
            aria-label="Close details"
            className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6 font-body-sm text-body-sm">
          {/* Header Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-headline-lg font-bold text-xl">
              <span className="material-symbols-outlined text-[32px]">
                {device.deviceCategory === 'FACE' ? 'face' : 'fingerprint'}
              </span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-on-background font-bold">
                {device.deviceName}
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">SN: {device.serialNumber}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="bg-primary-fixed text-primary px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                  {device.deviceCategory}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    device.status === 'ONLINE'
                      ? 'bg-[#dcfce7] text-[#166534] border-success/15'
                      : 'bg-error-container text-on-error-container border-error/15'
                  }`}
                >
                  {device.status}
                </span>
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Deployment & Location</h5>
            <div className="grid grid-cols-2 gap-3 font-body-sm text-body-sm text-on-surface">
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Building</span>
                {device.building}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Floor</span>
                {device.floor}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Room / Entrance</span>
                {device.room}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Assigned Block Dept</span>
                {device.assignedDepartment}
              </div>
            </div>
          </div>

          {/* Specs / Network details */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Hardware & Network telemetry</h5>
            <div className="grid grid-cols-2 gap-3 font-body-sm text-body-sm text-on-surface">
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">IP Address</span>
                <span className="font-mono">{device.ipAddress}</span>
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Firmware Version</span>
                {device.firmwareVersion}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Network Ping Latency</span>
                {device.lastPing}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Installation Date</span>
                {device.installationDate}
              </div>
            </div>
          </div>

          {/* Health Stats */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Uptime Indicators</h5>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-surface p-2.5 rounded border border-outline-variant/30">
                <span className="block text-[10px] text-on-surface-variant font-medium">EVENTS TODAY</span>
                <span className="font-bold text-primary text-sm">{device.totalEventsToday}</span>
              </div>
              <div className="bg-surface p-2.5 rounded border border-outline-variant/30">
                <span className="block text-[10px] text-on-surface-variant font-medium">HEALTH STATE</span>
                <span
                  className={`font-bold text-sm ${
                    device.healthStatus === 'HEALTHY'
                      ? 'text-[#10b981]'
                      : device.healthStatus === 'WARNING'
                      ? 'text-warning-text'
                      : 'text-error'
                  }`}
                >
                  {device.healthStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnostics & Management Actions */}
          <div className="flex flex-col gap-3 mt-auto border-t border-outline-variant pt-4 shrink-0">
            {/* Action Row 1: Diagnostics (Simulated) */}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-surface-container-high text-on-surface py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors shadow-sm font-bold flex items-center justify-center gap-2"
                onClick={() => alert('Triggering network diagnostics check... (Simulated Action)')}
                disabled={isMutating}
              >
                <span className="material-symbols-outlined text-[18px]">network_ping</span>
                Ping
              </button>
              <button
                className="flex-1 bg-surface-container-high text-on-surface py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors shadow-sm font-bold flex items-center justify-center gap-2"
                onClick={() => onSync(device.id, device.manufacturer || 'UNKNOWN')}
                disabled={isMutating}
              >
                <span className="material-symbols-outlined text-[18px]">sync</span>
                Sync Data
              </button>
            </div>

            {/* Action Row 2: Management */}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm font-bold flex items-center justify-center gap-2"
                onClick={onEditClick}
                disabled={isMutating}
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit
              </button>

              {device.isActive ? (
                <button
                  className="flex-1 bg-error text-on-error py-2.5 rounded-lg font-label-md text-label-md hover:bg-error-container transition-colors shadow-sm font-bold flex items-center justify-center gap-2"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to deactivate ${device.deviceName}?`)) {
                      onDelete(device.id);
                    }
                  }}
                  disabled={isMutating}
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Deactivate
                </button>
              ) : (
                <button
                  className="flex-1 bg-success-bg text-success-text border border-success/30 py-2.5 rounded-lg font-label-md text-label-md hover:bg-success/20 transition-colors shadow-sm font-bold flex items-center justify-center gap-2"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to restore ${device.deviceName}?`)) {
                      onRestore(device.id);
                    }
                  }}
                  disabled={isMutating}
                >
                  <span className="material-symbols-outlined text-[18px]">restore</span>
                  Restore
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
