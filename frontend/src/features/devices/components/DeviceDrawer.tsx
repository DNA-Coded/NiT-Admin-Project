import React, { useEffect } from 'react';
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
  // Bind escape shortcut listeners natively for dynamic dashboard layout frames
  useEffect(() => {
    if (!device) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [device, onClose]);

  if (!device) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label={`Details for hardware terminal: ${device.deviceName}`}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col transition-transform duration-300 transform translate-x-0"
      >
        {/* Header - Fixed Static Block */}
        <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between shrink-0">
          <h3 className="font-headline-md text-headline-md text-on-background font-bold">Device Details</h3>
          <button
            type="button"
            aria-label="Close details panel"
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all focus:outline-2 focus:outline-primary"
            onClick={onClose}
          >
            <span className="material-symbols-outlined block">close</span>
          </button>
        </div>

        {/* Content Body - Scalable Scrolling Workspace */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 font-body-sm text-body-sm custom-scrollbar">
          {/* Base Telemetry Identity Header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold shrink-0">
              <span className="material-symbols-outlined text-[32px]" aria-hidden="true">
                {device.deviceCategory === 'FACE' ? 'face' : 'fingerprint'}
              </span>
            </div>
            <div className="overflow-hidden">
              <h4 className="font-headline-sm text-headline-sm text-on-background font-bold truncate">
                {device.deviceName}
              </h4>
              <p className="font-mono text-[11px] text-on-surface-variant truncate">SN: {device.serialNumber}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="bg-primary-fixed text-primary px-2.5 py-0.5 rounded-full font-label-xs text-label-xs font-bold">
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

          {/* Location card metrics */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Deployment & Location</h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-on-surface">
              <div>
                <span className="block text-outline font-label-xs text-label-xs mb-0.5">Building</span>
                <span className="font-medium">{device.building}</span>
              </div>
              <div>
                <span className="block text-outline font-label-xs text-label-xs mb-0.5">Floor</span>
                <span className="font-medium">Floor {device.floor}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-outline font-label-xs text-label-xs mb-0.5">Room / Entrance</span>
                <span className="font-medium truncate block">{device.room || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Network details */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Hardware & Network Telemetry</h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-on-surface">
              <div>
                <span className="block text-outline font-label-xs text-label-xs mb-0.5">IP Address</span>
                <span className="font-mono text-xs select-all">{device.ipAddress}</span>
              </div>
              <div>
                <span className="block text-outline font-label-xs text-label-xs mb-0.5">Firmware Version</span>
                <span className="font-mono text-xs">{device.firmwareVersion}</span>
              </div>
              <div>
                <span className="block text-outline font-label-xs text-label-xs mb-0.5">Ping Latency</span>
                <span>{device.lastPing || 'Disconnected'}</span>
              </div>
              <div>
                <span className="block text-outline font-label-xs text-label-xs mb-0.5">Installation Date</span>
                <span>{device.installationDate}</span>
              </div>
            </div>
          </div>

          {/* Uptime Indicators */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Uptime Indicators</h5>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
                <span className="block text-[10px] text-outline font-bold tracking-wider uppercase mb-1">EVENTS TODAY</span>
                <span className="font-bold text-primary text-base">{device.totalEventsToday}</span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
                <span className="block text-[10px] text-outline font-bold tracking-wider uppercase mb-1">HEALTH STATE</span>
                <span
                  className={`font-bold text-base ${
                    device.healthStatus === 'HEALTHY'
                      ? 'text-success'
                      : device.healthStatus === 'WARNING'
                      ? 'text-warning'
                      : 'text-error'
                  }`}
                >
                  {device.healthStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section - Permanently Anchored to Panel Baseline */}
        <div className="p-6 border-t border-outline-variant bg-surface-container-lowest flex flex-col gap-3 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 bg-surface-container-high text-on-surface py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors font-bold flex items-center justify-center gap-2 focus:outline-2 focus:outline-primary"
              onClick={() => alert('Triggering network diagnostics check...')}
              disabled={isMutating}
            >
              <span className="material-symbols-outlined text-[18px]">network_ping</span>
              Ping
            </button>
            <button
              type="button"
              className="flex-1 bg-surface-container-high text-on-surface py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors font-bold flex items-center justify-center gap-2 focus:outline-2 focus:outline-primary"
              onClick={() => onSync(device.id, device.manufacturer || 'UNKNOWN')}
              disabled={isMutating}
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              Sync Data
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors font-bold flex items-center justify-center gap-2 focus:outline-2 focus:outline-primary-container"
              onClick={onEditClick}
              disabled={isMutating}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Details
            </button>

            {device.isActive ? (
              <button
                type="button"
                className="flex-1 bg-error text-on-error py-2.5 rounded-lg font-label-md text-label-md hover:bg-error/90 transition-colors font-bold flex items-center justify-center gap-2 focus:outline-2 focus:outline-error-container"
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
                type="button"
                className="flex-1 bg-success text-white py-2.5 rounded-lg font-label-md text-label-md hover:bg-success/90 transition-colors font-bold flex items-center justify-center gap-2 focus:outline-2 focus:outline-success"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to restore ${device.deviceName}?`)) {
                    onRestore(device.id);
                  }
                }}
                disabled={isMutating}
              >
                <span className="material-symbols-outlined text-[18px]">restore</span>
                Restore Unit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};