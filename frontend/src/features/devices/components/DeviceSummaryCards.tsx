import React from 'react';
import type { DeviceSummary } from '@/types/devices';

interface DeviceSummaryCardsProps {
  summary: DeviceSummary;
}

export const DeviceSummaryCards: React.FC<DeviceSummaryCardsProps> = ({ summary }) => {
  const {
    totalDevices = 0,
    onlineDevices = 0,
    offlineDevices = 0,
    warningDevices = 0,
    totalAttendanceEventsToday = 0,
    avgSyncDelaySecs = 0,
  } = summary;

  // 1. Dynamic Uptime Percentage calculation
  const uptimePercentage =
    totalDevices > 0
      ? ((onlineDevices / totalDevices) * 100).toFixed(1)
      : '0.0';

  // 2. Format Sync Delay string
  const syncDelayText = avgSyncDelaySecs < 1 
    ? '< 1s' 
    : `${avgSyncDelaySecs.toFixed(1)}s`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-8">
      {/* 1. Total Devices */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between shadow-sm">
        <div>
          <p className="text-label-sm text-outline uppercase tracking-wider mb-2 font-medium">
            Total Devices
          </p>
          <h3 className="text-display-lg text-3xl font-bold text-primary">
            {totalDevices}
          </h3>
        </div>
        <div className="mt-4 flex items-center gap-2 text-label-sm text-primary font-bold">
          <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
          {totalAttendanceEventsToday.toLocaleString()} Scans Today
        </div>
      </div>

      {/* 2. Online Status */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between shadow-sm">
        <div>
          <p className="text-label-sm text-outline uppercase tracking-wider mb-2 font-medium">
            Online Status
          </p>
          <h3 className="text-display-lg text-3xl font-bold text-[#10b981]">
            {onlineDevices}
          </h3>
        </div>
        <div className="mt-4 flex items-center gap-2 text-label-sm text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded w-fit font-bold">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          {uptimePercentage}% Uptime
        </div>
      </div>

      {/* 3. Offline / Warning Alerts */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between shadow-sm">
        <div>
          <p className="text-label-sm text-outline uppercase tracking-wider mb-2 font-medium">
            Offline Alerts
          </p>
          <h3
            className={`text-display-lg text-3xl font-bold ${
              offlineDevices > 0 ? 'text-error' : 'text-on-surface-variant'
            }`}
          >
            {offlineDevices}
          </h3>
        </div>

        {offlineDevices > 0 ? (
          <div className="mt-4 flex items-center gap-2 text-label-sm text-error bg-error-container px-2 py-1 rounded w-fit font-bold animate-pulse">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Action Required
          </div>
        ) : warningDevices > 0 ? (
          <div className="mt-4 flex items-center gap-2 text-label-sm text-amber-600 bg-amber-100 px-2 py-1 rounded w-fit font-bold">
            <span className="material-symbols-outlined text-[16px]">error_outline</span>
            {warningDevices} Warnings
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 text-label-sm text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded w-fit font-bold">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            All Operational
          </div>
        )}
      </div>

      {/* 4. Sync Delay Metric */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between shadow-sm">
        <div>
          <p className="text-label-sm text-outline uppercase tracking-wider mb-2 font-medium">
            Avg Sync Delay
          </p>
          <h3 className="text-display-lg text-3xl font-bold text-primary">
            {syncDelayText}
          </h3>
        </div>
        <div className="mt-4 text-label-sm text-outline font-medium truncate">
          Hardware to network latency
        </div>
      </div>
    </div>
  );
};