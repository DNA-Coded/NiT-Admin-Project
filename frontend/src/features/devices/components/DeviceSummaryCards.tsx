import React from 'react';
import type { DeviceSummary } from '@/types/devices';

interface DeviceSummaryCardsProps {
  summary: DeviceSummary;
}

export const DeviceSummaryCards: React.FC<DeviceSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-8">
      {/* Total Devices */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between shadow-sm">
        <div>
          <p className="text-label-sm text-outline uppercase tracking-wider mb-2 font-medium">Total Devices</p>
          <h3 className="text-display-lg text-3xl font-bold text-primary">{summary.totalDevices}</h3>
        </div>
        <div className="mt-4 flex items-center gap-2 text-label-sm text-primary font-bold">
          <span className="material-symbols-outlined text-[16px]">info</span>
          Active in 5 Blocks
        </div>
      </div>

      {/* Online Status */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between shadow-sm">
        <div>
          <p className="text-label-sm text-outline uppercase tracking-wider mb-2 font-medium">Online Status</p>
          <h3 className="text-display-lg text-3xl font-bold text-[#10b981]">{summary.onlineDevices}</h3>
        </div>
        <div className="mt-4 flex items-center gap-2 text-label-sm text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded w-fit font-bold">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          91.6% Uptime
        </div>
      </div>

      {/* Offline Alerts */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between shadow-sm">
        <div>
          <p className="text-label-sm text-outline uppercase tracking-wider mb-2 font-medium">Offline Alerts</p>
          <h3 className="text-display-lg text-3xl font-bold text-error">{summary.offlineDevices}</h3>
        </div>
        <div className="mt-4 flex items-center gap-2 text-label-sm text-error bg-error-container px-2 py-1 rounded w-fit font-bold animate-bounce">
          <span className="material-symbols-outlined text-[16px]">warning</span>
          Action Required
        </div>
      </div>

      {/* Sync Success */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between shadow-sm">
        <div>
          <p className="text-label-sm text-outline uppercase tracking-wider mb-2 font-medium">Sync Success</p>
          <h3 className="text-display-lg text-3xl font-bold text-primary">99.8%</h3>
        </div>
        <div className="mt-4 text-label-sm text-outline font-medium">
          Last 24 hours average
        </div>
      </div>
    </div>
  );
};
