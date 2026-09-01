import React from 'react';
import type { Device } from '@/types/devices';
import { DeviceCard } from './DeviceCard';

interface DeviceGridProps {
  devices: Device[];
  onSelect: (device: Device) => void;
}

export const DeviceGrid: React.FC<DeviceGridProps> = ({ devices, onSelect }) => {
  return (
    <div className="w-full">
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <div 
          role="status"
          className="text-center py-16 px-4 text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-xl font-medium shadow-2xs max-w-full mx-auto mt-6"
        >
          <span className="material-symbols-outlined text-[40px] text-outline block mb-2" aria-hidden="true">
            developer_board_off
          </span>
          <p className="text-sm">No hardware modules found matching your active filter criteria.</p>
        </div>
      )}
    </div>
  );
};