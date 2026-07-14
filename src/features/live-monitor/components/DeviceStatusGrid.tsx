import React from 'react';
import type { Device } from '@/types/devices';

interface DeviceStatusGridProps {
  devices: Device[];
}

export const DeviceStatusGrid: React.FC<DeviceStatusGridProps> = ({ devices }) => {
  const onlineCount = devices.filter((d) => d.status === 'ONLINE').length;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col h-[400px]">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0">
        <h3 className="font-headline-md text-headline-md text-on-surface">Device Health</h3>
        <span className="bg-success-bg text-success-text border border-success/15 px-2.5 py-0.5 rounded font-label-sm text-label-sm font-bold">
          {onlineCount} Online
        </span>
      </div>

      {/* Grid List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="p-3 border border-outline-variant/60 rounded bg-surface hover:border-primary/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">
                  {device.deviceName.toLowerCase().includes('face') ? 'face' : 'fingerprint'}
                </span>
                <h4 className="font-label-md text-label-md text-on-surface font-bold truncate">
                  {device.deviceName}
                </h4>
              </div>
              {/* Online/Offline Badge */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-on-surface-variant font-medium">
                  {device.status}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    device.status === 'ONLINE'
                      ? 'bg-success animate-pulse'
                      : device.status === 'OFFLINE'
                      ? 'bg-danger'
                      : 'bg-warning'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-on-surface-variant text-[11px] font-medium leading-none">
              <span>IP: {device.ipAddress}</span>
              <span>Sync: {device.lastPing}</span>
            </div>
            
            {device.totalEventsToday !== undefined && (
              <div className="mt-2 text-[10px] text-outline font-bold flex justify-between">
                <span>Today Events</span>
                <span>{device.totalEventsToday}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
