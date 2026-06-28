import React from 'react';
import type { Device } from '@/types/devices';
import { DeviceCard } from './DeviceCard';

interface DeviceGridProps {
  devices: Device[];
  onSelect: (device: Device) => void;
}

export const DeviceGrid: React.FC<DeviceGridProps> = ({ devices, onSelect }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onSelect={onSelect}
          />
        ))}
      </div>
      {devices.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-xl italic shadow-sm">
          No hardware modules found matching selected filters.
        </div>
      )}
    </div>
  );
};
