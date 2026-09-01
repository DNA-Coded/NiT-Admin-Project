import React from 'react';

interface SummaryStripProps {
  currentlyInside: number;
  totalCheckIns: number;
  totalCheckOuts: number;
  activeDevices: number;
  offlineDevices: number;
  lastEventTime: string;
}

export const SummaryStrip: React.FC<SummaryStripProps> = ({
  currentlyInside,
  totalCheckIns,
  totalCheckOuts,
  activeDevices,
  offlineDevices,
  lastEventTime,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      {/* Currently Inside */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 border-l-4 border-l-success shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Inside Campus</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">{currentlyInside.toLocaleString()}</div>
      </div>

      {/* Check Ins */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Today Check-Ins</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">{totalCheckIns.toLocaleString()}</div>
      </div>

      {/* Check Outs */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Today Check-Outs</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">{totalCheckOuts.toLocaleString()}</div>
      </div>

      {/* Active Devices */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 border-l-4 border-l-primary shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Active Devices</span>
        <div className="font-display-lg text-2xl font-bold text-success-text">{activeDevices}</div>
      </div>

      {/* Offline Devices */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 border-l-4 border-l-danger shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Offline Devices</span>
        <div className="font-display-lg text-2xl font-bold text-danger-text">{offlineDevices}</div>
      </div>

      {/* Last Event */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          Last Update
        </span>
        <div className="font-display-lg text-lg font-bold text-on-background">{lastEventTime || 'Waiting...'}</div>
      </div>
    </div>
  );
};
