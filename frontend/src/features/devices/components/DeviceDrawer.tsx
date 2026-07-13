import React from 'react';
import type { Device } from '@/types/devices';

interface DeviceDrawerProps {
  device: Device | null;
  onClose: () => void;
}

export const DeviceDrawer: React.FC<DeviceDrawerProps> = ({ device, onClose }) => {
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
                {device.deviceType === 'FACE' ? 'face' : 'fingerprint'}
              </span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-on-background font-bold">
                {device.name}
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">SN: {device.serialNumber}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="bg-primary-fixed text-primary px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                  {device.deviceType}
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
                {device.department}
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

          {/* Diagnostics Actions */}
          <div className="flex gap-3 mt-auto border-t border-outline-variant pt-4 shrink-0">
            <button
              className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm font-bold"
              onClick={() => alert('Triggering network diagnostics check... (Simulated Action)')}
            >
              Ping Diagnostic
            </button>
            <button
              className="flex-1 bg-white text-secondary border border-outline-variant py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors font-bold"
              onClick={() => alert('Checking cloud update servers... (Simulated Action)')}
            >
              Update Firmware
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
