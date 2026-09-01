import React from 'react';
import type { Device } from '@/types/devices';

interface DeviceCardProps {
  device: Device;
  onSelect: (device: Device) => void;
}

// Icon mapping based on categories defined in Add/Edit form
const CATEGORY_ICONS: Record<string, string> = {
  BIOMETRIC_TERMINAL: 'fingerprint',
  RFID_READER: 'contactless',
  QR_SCANNER: 'qr_code_scanner',
  MOBILE_DEVICE: 'smartphone',
  OTHER: 'devices',
  // Backward compatibility fallback
  FACE: 'face',
  FINGERPRINT: 'fingerprint',
};

// Formats ENUM_STRINGS to "Enum Strings"
const formatLabel = (value?: string) => {
  if (!value) return 'Unknown';
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onSelect }) => {
  const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'OFFLINE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getHealthBadge = (health: Device['healthStatus']) => {
    switch (health) {
      case 'HEALTHY':
        return 'bg-emerald-500';
      case 'WARNING':
        return 'bg-amber-500';
      case 'CRITICAL':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(device);
    }
  };

  const categoryIcon = CATEGORY_ICONS[device.deviceCategory] || 'devices';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Hardware card for ${device.deviceName}, Status: ${device.status}, Health: ${device.healthStatus}`}
      className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
      onClick={() => onSelect(device)}
      onKeyDown={handleKeyDown}
    >
      {/* Header Info */}
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div 
            className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center text-primary shrink-0" 
            aria-hidden="true"
          >
            <span className="material-symbols-outlined text-[24px]">
              {categoryIcon}
            </span>
          </div>
          <div className="overflow-hidden">
            <h4 className="font-label-md text-label-md text-primary font-bold truncate leading-tight">
              {device.deviceName}
            </h4>
            <p className="font-mono text-[10px] text-outline truncate mt-0.5" title={device.id}>
              ID: {device.deviceCode || device.id}
            </p>
          </div>
        </div>
        
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 uppercase tracking-wide ${getStatusBadge(
            device.status
          )}`}
        >
          {device.status}
        </span>
      </div>

      {/* Specifications */}
      <div className="flex-1 space-y-2 py-2.5 font-body-sm text-[12px] text-on-surface-variant border-y border-outline-variant/30 mb-3">
        <div className="flex justify-between gap-4">
          <span className="text-outline">IP Address</span>
          <span className="font-mono text-on-surface select-all">{device.ipAddress}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-outline">Location</span>
          <span className="font-medium truncate text-on-surface" title={`${device.building} • Fl ${device.floor}`}>
            {device.building} • Fl {device.floor}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-outline">Category</span>
          <span className="font-bold text-on-surface text-[11px] bg-surface-container-high px-1.5 py-0.5 rounded">
            {formatLabel(device.deviceCategory)}
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center pt-0.5">
        <div>
          <p className="text-[10px] text-outline font-bold uppercase tracking-wider leading-none mb-0.5">
            Events Today
          </p>
          <p className="font-bold text-on-surface text-sm leading-tight">
            {device.totalEventsToday ?? 0}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/30">
          <span className="text-[10px] text-outline font-bold uppercase tracking-wider">
            Health
          </span>
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${getHealthBadge(device.healthStatus)}`}
            title={`Health Status: ${device.healthStatus || 'UNKNOWN'}`}
          />
        </div>
      </div>
    </div>
  );
};