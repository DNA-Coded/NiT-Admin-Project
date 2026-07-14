import React from 'react';
import type { Device } from '@/types/devices';

interface DeviceCardProps {
  device: Device;
  onSelect: (device: Device) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onSelect }) => {
  const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-[#dcfce7] text-[#166534] border-success/20';
      case 'OFFLINE':
        return 'bg-error-container text-on-error-container border-error/20';
      default:
        return 'bg-[#fef3c7] text-[#92400e] border-warning/20';
    }
  };

  const getHealthBadge = (health: Device['healthStatus']) => {
    switch (health) {
      case 'HEALTHY':
        return 'bg-success text-white';
      case 'WARNING':
        return 'bg-warning text-white';
      case 'CRITICAL':
        return 'bg-danger text-white';
    }
  };

  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-primary/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      onClick={() => onSelect(device)}
    >
      {/* Header Info */}
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface-container-high rounded flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[24px]">
              {device.deviceCategory === 'FACE' ? 'face' : 'fingerprint'}
            </span>
          </div>
          <div className="overflow-hidden">
            <h4 className="font-label-md text-label-md text-primary font-bold truncate leading-tight">
              {device.deviceName}
            </h4>
            <p className="text-[11px] text-outline truncate leading-none mt-0.5">ID: {device.id}</p>
          </div>
        </div>
        {/* Status Badge */}
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadge(
            device.status
          )}`}
        >
          {device.status}
        </span>
      </div>

      {/* Meta Specifications */}
      <div className="flex-1 space-y-2 py-2 font-body-sm text-[12px] text-on-surface-variant border-y border-outline-variant/30 mb-3">
        <div className="flex justify-between">
          <span className="text-outline">IP Address</span>
          <span className="font-mono">{device.ipAddress}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-outline">Location</span>
          <span className="font-medium truncate max-w-[150px]">
            {device.building} • Fl {device.floor}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-outline">Assigned Dept</span>
          <span className="font-medium truncate max-w-[150px]">{device.assignedDepartment}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-outline">Category</span>
          <span className="font-bold">{device.deviceCategory}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center">
        <div className="text-[11px]">
          <p className="text-outline leading-tight">Events Today</p>
          <p className="font-bold text-on-surface text-[13px]">{device.totalEventsToday}</p>
        </div>
        {/* Health Dot */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-outline font-bold">Health:</span>
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${getHealthBadge(device.healthStatus)}`}
            title={`Health: ${device.healthStatus}`}
          />
        </div>
      </div>
    </div>
  );
};
